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

export default function ConfidenceDados({ onSwitch, updateFormData, formData }: { onSwitch: (nextStep: "login" | "register" | "autenticar" | "reenviar", email?: string) => void, updateFormData: (data: Partial<RegisterFormInputs>) => void, formData: RegisterFormInputs }) {
    const methods = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: formData,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [passwordCriteria, setPasswordCriteria] = useState({
        minLength: false,
        upperCase: false,
        number: false,
        specialChar: false,
        senhasIguais: false,
    });

    const handlePasswordChange = (password: string, password2: string) => {
        setPasswordCriteria({
            minLength: password.length >= 8,
            upperCase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[@$!%*?&]/.test(password),
            senhasIguais: password === password2,
        });
    };

    const matchingPasswords = (password: string, password2: string) => {
        setPasswordCriteria({
            ...passwordCriteria,
            senhasIguais: password === password2,
        });
    };
    const authService = useAuth();
    const onSubmit = async (data: RegisterFormInputs) => {
        debugger
        const response = await authService.registerUser(formData);
        if (response?.status === 201) {
            onSwitch("autenticar", data.email);
        } else {
            const errorMessage = await response?.json();
            alert(errorMessage.message);
        }
    };

    const { handleSubmit, control } = methods;

    return (
        <FormProvider {...methods}>
            <div>
                <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium text-gray-600">Senha</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Crie uma senha segura"
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handlePasswordChange(e.target.value, methods.getValues("password2") as string);
                                                updateFormData({ password: e.target.value })
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
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="password2"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-medium text-gray-600">Confirme a senha</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" placeholder="Repita a senha" value={field.value as string} onChange={(e) => {
                                        field.onChange(e);
                                        matchingPasswords(methods.getValues("password") as string, e.target.value);
                                    }} />
                                </FormControl>
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
