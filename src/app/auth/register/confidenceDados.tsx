import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { RegisterFormInputs } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { registerSchema } from "./schema";
import { useState } from "react";
import { useAuth } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { FaCheck, FaRegCircle } from "react-icons/fa6";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function ConfidenceDados({ onSwitch, updateFormData, formData, formErrors, setFormErrors, setGlobalError }: {
    onSwitch: (nextStep: "login" | "register" | "autenticar" | "reenviar", email?: string) => void,
    updateFormData: (data: Partial<RegisterFormInputs>) => void,
    formData: RegisterFormInputs,
    formErrors: Record<string, string>;
    setFormErrors: (errors: Record<string, string>) => void;
    setGlobalError: (error: string | null) => void;
}) {
    const methods = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: formData,
    });

    const { handleSubmit, control, setError } = methods;
    const [showPassword, setShowPassword] = useState(false);
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

    const authService = useAuth();
    const { clearErrors } = methods;

    const onSubmit = async (data: RegisterFormInputs) => {
        if (Object.keys(formErrors).some(key => formErrors[key] !== "")) return;
        formatarNomeSobrenomePrimeiraLetraMaiuscula(data);
        const response = await authService.registerUser(formData);

        if (response && "error" in response) {
            setFormErrors({});
            setGlobalError(null);
            if (response.fieldErrors) {
                for (const key of Object.keys(response.fieldErrors) as Array<keyof RegisterFormInputs>) {
                    setError(key as string, {
                        type: "manual",
                        message: response.fieldErrors[key]
                    });
                }
                setFormErrors(response.fieldErrors);
            }

            if (response.error) {
                setGlobalError(response.error);
            }
        } else if (response?.status === 201) {
            onSwitch("autenticar", data.email);
        }
    };

    const formatarNomeSobrenomePrimeiraLetraMaiuscula = (data: RegisterFormInputs) => {
        const nome = data.nome.split(" ");
        const sobrenome = data.sobrenome.split(" ");
        const nomeFormatado = nome.map((nome) => nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase());
        const sobrenomeFormatado = sobrenome.map((sobrenome) => sobrenome.charAt(0).toUpperCase() + sobrenome.slice(1).toLowerCase());
        data.nome = nomeFormatado.join(" ");
        data.sobrenome = sobrenomeFormatado.join(" ");
        updateFormData(data);
    };

    return (
        <FormProvider {...methods}>
            <div>
                <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                        control={control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="font-medium text-gray-600">Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Crie uma senha segura"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handlePasswordChange(e.target.value, methods.getValues("confirmPassword") as string);
                                                updateFormData({ password: e.target.value });
                                                clearErrors("password"); // Remove erro ao corrigir input
                                            }}
                                            onPaste={(e) => {
                                                e.preventDefault(); // Impede a ação de colar
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
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="font-medium text-gray-600">Confirme a senha</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder="Repita a senha"
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            matchingPasswords(methods.getValues("password") as string, e.target.value);
                                        }}
                                        onPaste={(e) => {
                                            e.preventDefault(); // Impede a ação de colar
                                        }}
                                    />
                                </FormControl>
                                {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
                            </FormItem>
                        )}
                    />
                    <div className="rounded-lg text-sm">
                        <ul className="space-y-1">
                            <li className="flex items-center gap-2 text-muted-foreground">
                                {passwordCriteria.minLength ? <FaCheck className="text-muted-foreground" /> : <FaRegCircle className="text-muted-foreground" />}
                                Pelo menos 8 caracteres
                            </li>
                            <li className="flex items-center gap-2  text-muted-foreground">
                                {passwordCriteria.upperCase ? <FaCheck className="text-muted-foreground" /> : <FaRegCircle className="text-muted-foreground" />}
                                Uma letra maiúscula
                            </li>
                            <li className="flex items-center gap-2  text-muted-foreground">
                                {passwordCriteria.number ? <FaCheck className="text-muted-foreground" /> : <FaRegCircle className="text-muted-foreground" />}
                                Um número
                            </li>
                            <li className="flex items-center gap-2  text-muted-foreground">
                                {passwordCriteria.specialChar ? <FaCheck className="text-muted-foreground" /> : <FaRegCircle className="text-muted-foreground" />}
                                Um caractere especial (@$!%*?&)
                            </li>
                            <li className="flex items-center gap-2  text-muted-foreground">
                                {passwordCriteria.senhasIguais ? <FaCheck className="text-muted-foreground" /> : <FaRegCircle className="text-muted-foreground" />}
                                As senhas coincidem
                            </li>
                        </ul>
                    </div>

                    <Button type="submit" className="w-full">
                        Criar Conta
                    </Button>
                </form>
            </div>
        </FormProvider>
    );
}
