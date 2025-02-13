"use client";

import { alterarSenhaSchema } from "@/app/auth/alterarSenha/schema";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToastContext } from "@/context/ToastContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/services/auth";
import type { alterarSenhaResponse } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaCheck, FaRegCircle } from "react-icons/fa6";

export default function AlterarSenha() {
    const methods = useForm<alterarSenhaResponse>({
        resolver: zodResolver(alterarSenhaSchema),
        defaultValues: {
            codigoVerificacao: "",
        },
    });
    const { handleSubmit, setValue, watch, control } = methods;
    const [showPassword, setShowPassword] = useState(false);
    const { codigoValidacaoAlterarSenha } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (codigoValidacaoAlterarSenha) {
            setValue("codigoVerificacao", codigoValidacaoAlterarSenha as string);
            if (typeof codigoValidacaoAlterarSenha === 'string') {
                codigoValidacaoAlterarSenha.split("").forEach((char, index) => {
                    if (codeInputsRef.current[index]) {
                        codeInputsRef.current[index].value = char;
                    }
                });
            }
        }
    }, [codigoValidacaoAlterarSenha, setValue]);
    const { toast } = useToast();
    const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);
    const authService = useAuth();
    const { setToastData } = useToastContext();
    const onSubmit = async (data: alterarSenhaResponse) => {
        console.log(data);
        const response = await authService.alterarSenha(data);
        if (response && "error" in response) {

            if (response.error) {
                toast({
                    title: "Erro ao alterar senha",
                    description: response.error,
                    variant: "destructive",
                });
            }
        } else if (response?.status === 200) {
            setToastData({
                showToast: true,
                toastMessage: "Senha alterada com sucesso!",
                toastDescription: "Agora você pode fazer login com sua nova senha.",
            });
            router.push("/");
        }
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

    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        upperCase: false,
        number: false,
        specialChar: false,
        senhasIguais: false,
    });

    const handlePasswordChange = (password: string, confirmPassword: string) => {
        setPasswordCriteria({
            minLength: password.length >= 8,
            upperCase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[@$!%*?&]/.test(password),
            senhasIguais: password === confirmPassword,
        });
    };

    const matchingPasswords = (password: string, confirmPassword: string) => {
        setPasswordCriteria({
            ...passwordCriteria,
            senhasIguais: password === confirmPassword,
        });
    };
    return (
        <FormProvider {...methods}>
            <form
                className="max-w-md mx-auto bg-white p-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="mb-6">
                    <h2 className="text-left text-xl font-semibold text-foreground mb-2">
                        Alterar Senha
                    </h2>
                    <p className="text-left text-muted-foreground">
                        Insira o código enviado para o seu e-mail cadastrado para alterar sua senha.
                    </p>

                </div>

                <div className="flex justify-left gap-2 mb-4">
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
                                className="w-10 h-10 text-center text-md font-bold border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
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

                <div className="space-y-3">
                    <FormField
                        control={control}
                        name="novaSenha"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="font-medium text-gray-600">Nova senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Crie uma senha segura"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handlePasswordChange(e.target.value, methods.getValues("confirmarNovaSenha") as string);
                                            }}
                                            onPaste={(e) => {
                                                e.preventDefault();
                                            }}
                                        />

                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    setShowPassword(!showPassword);
                                                }
                                            }}
                                        >
                                            {showPassword ? <EyeIcon className="h-5 w-5 text-gray-500" /> : <EyeOffIcon className="h-5 w-5 text-gray-500" />}
                                        </div>
                                    </div>
                                </FormControl>
                                {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="confirmarNovaSenha"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="font-medium text-gray-600">Confirme a nova senha</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            matchingPasswords(methods.getValues("novaSenha") as string, e.target.value);
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault();
                                        }}
                                    />
                                </FormControl>
                                {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                            </FormItem>
                        )}
                    />
                    <div className="rounded-lg text-sm">
                        <ul className="space-y-1">
                            <li className={`flex items-center gap-2 ${passwordCriteria.minLength ? "text-primary" : "text-muted-foreground"}`}>
                                {passwordCriteria.minLength ? <FaCheck className="text-primary" /> : <FaRegCircle className="text-muted-foreground" />}
                                Pelo menos 8 caracteres
                            </li>
                            <li className={`flex items-center gap-2 ${passwordCriteria.upperCase ? "text-primary" : "text-muted-foreground"}`}>
                                {passwordCriteria.upperCase ? <FaCheck className="text-primary" /> : <FaRegCircle className="text-muted-foreground" />}
                                Uma letra maiúscula
                            </li>
                            <li className={`flex items-center gap-2 ${passwordCriteria.number ? "text-primary" : "text-muted-foreground"}`}>
                                {passwordCriteria.number ? <FaCheck className="text-primary" /> : <FaRegCircle className="text-muted-foreground" />}
                                Um número
                            </li>
                            <li className={`flex items-center gap-2 ${passwordCriteria.specialChar ? "text-primary" : "text-muted-foreground"}`}>
                                {passwordCriteria.specialChar ? <FaCheck className="text-primary" /> : <FaRegCircle className="text-muted-foreground" />}
                                Um caractere especial (@$!%*?&)
                            </li>
                            <li className={`flex items-center gap-2 ${passwordCriteria.senhasIguais ? "text-primary" : "text-muted-foreground"}`}>
                                {passwordCriteria.senhasIguais ? <FaCheck className="text-primary" /> : <FaRegCircle className="text-muted-foreground" />}
                                As senhas coincidem
                            </li>
                        </ul>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    onClick={handleSubmit(onSubmit)}
                >
                    Alterar senha
                </Button>
                <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => router.replace("/")}
                >
                    Cancelar
                </Button>
            </form>
        </FormProvider >
    );
}
