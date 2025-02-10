"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "./schema";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/services/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ReenviarCodigoResponse } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface VerifyFormInputs {
    email: string;
    codigoVerificacao: string;
    [key: string]: string;
}

export default function VerifyForm({
    onSwitch,
    email,
}: {
    onSwitch: (
        nextStep: "login" | "register" | "autenticar" | "reenviar",
        email: string,
        userAutenticado: boolean,
    ) => void;
    email: string;
}) {
    const authService = useAuth();
    const methods = useForm<VerifyFormInputs>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            email: email,
            codigoVerificacao: "",
        },
    });

    const { handleSubmit, setValue, watch } = methods;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { toast } = useToast()
    const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        codeInputsRef.current[0]?.focus();
    }, []);

    const handleCodeChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const currentCode = watch("codigoVerificacao").split("");
        currentCode[index] = value || "";
        setValue("codigoVerificacao", currentCode.join(""));

        if (value && index < 5) {
            codeInputsRef.current[index + 1]?.focus();
        }

        if (!value && index > 0) {
            codeInputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("Text").trim();
        if (/^\d{6}$/.test(pastedData)) {
            setValue("codigoVerificacao", pastedData);

            pastedData.split("").forEach((char, index) => {
                if (codeInputsRef.current[index]) {
                    if (codeInputsRef.current[index]) {
                        codeInputsRef.current[index].value = char;
                    }
                }
            });

            codeInputsRef.current[5]?.focus();
        }
    };

    const onSubmit = async (data: VerifyFormInputs) => {
        setLoading(true);
        setErrorMessage("");
        data.email = email;
        data.codigoVerificacao = data.codigoVerificacao.replace(/\D/g, "");
        try {
            const response = await authService.autenticarConta(data);
            if (response?.status === 200) {
                onSwitch("login", "", true);
            } else {
                if (response) {
                    const responseData = await response.json();
                    setErrorMessage(responseData?.message || "Erro ao verificar conta.");
                } else {
                    setErrorMessage("Erro ao verificar conta.");
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message || "Erro ao verificar conta.");
            } else {
                setErrorMessage("Erro ao verificar conta.");
            }
        } finally {
            setLoading(false);
        }
    };

    const reenviarCodigo = async (email: string) => {
        try {
            const reenviarCodigoResponse: ReenviarCodigoResponse = {
                email: email,
            };
            const response = await authService.reenviarCodigoAutenticacao(reenviarCodigoResponse);
            if (response?.status === 200) {
                toast({
                    title: "Código reenviado com sucesso!",
                    description: "Um novo código de verificação foi enviado para o seu email.",
                });
                setErrorMessage("");
            } else {
                if (response) {
                    const responseData = await response.json();
                    setErrorMessage(responseData?.message || "Erro ao reenviar código de verificação.");
                } else {
                    setErrorMessage("Erro ao reenviar código de verificação.");
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(
                    error.message || "Erro ao reenviar código de verificação.",
                );
            } else {
                setErrorMessage("Erro ao reenviar código de verificação.");
            }
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                className="max-w-md mx-auto space-y-6 bg-white p-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-center text-xl font-semibold text-foreground ">
                    Insira o código de verificação
                </h2>
                <p className="text-center text-muted-foreground">
                    Enviamos um código para &nbsp;
                    <span className="font-semibold text-foreground">{email}</span>
                </p>

                {errorMessage && (
                    <p className="text-red-500 text-center text-sm">{errorMessage}</p>
                )}

                <div className="flex justify-center gap-2">
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <Input
                                key={index}
                                ref={(el) => {
                                    if (el) codeInputsRef.current[index] = el;
                                }}
                                type="text"
                                maxLength={1}
                                value={watch("codigoVerificacao")[index] || ""}
                                className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                                onChange={(e) => handleCodeChange(index, e.target.value)}
                                onClick={(e) => e.currentTarget.select()}
                                onPaste={handlePaste}
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Backspace" &&
                                        !watch("codigoVerificacao")[index] &&
                                        index > 0
                                    ) {
                                        codeInputsRef.current[index - 1]?.focus();
                                    }
                                }}
                            />
                        ))}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={loading}
                    onClick={handleSubmit(onSubmit)}
                >
                    Verificar Conta
                </Button>

                <p className="text-center text-muted-foreground">
                    <span>Não recebeu um código&nbsp;</span>
                    <span
                        className="font-semibold text-foreground cursor-pointer hover:text-muted-foreground"
                        onClick={() => reenviarCodigo(email)}
                        onKeyUp={() => { }}
                    >
                        Clique para reenviar
                    </span>
                </p>
            </form>
        </FormProvider>
    );
}
