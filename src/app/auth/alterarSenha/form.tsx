import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import type { alterarSenhaResponse } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { alterarSenhaSchema } from "./schema";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";

export default function AlterarSenhaForm({
    onSwitch,
    email,
}: {
    onSwitch: (
        nextStep: "login" | "register" | "autenticar" | "reenviar",
        email: string,
    ) => void;
    email: string;
}) {
    const methods = useForm<alterarSenhaResponse>({
        resolver: zodResolver(alterarSenhaSchema),
        defaultValues: {
            email: email,
            codigoVerificacao: "",
        },
    });

    const { handleSubmit, setValue, watch, control } = methods;
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const authService = useAuth();

    const onSubmit = async (data: alterarSenhaResponse) => {
        setLoading(true);
        const response = await authService.alterarSenha(data);
        if (response?.status === 200) {
            onSwitch("login", "");
        } else {
            setErrorMessage("Ocorreu um erro ao alterar a senha. Por favor, tente novamente.");
        }
        setLoading(false);
    };
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
            </form>
        </FormProvider>
    );
}
