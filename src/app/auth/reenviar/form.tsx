import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { reenviarSchema } from "./schema";
import { FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ReenviarCodigoResponse } from "@/types/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";
import { useToastContext } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

export default function ReenviarForm({
    onSwitch,
    email: initialEmail,
}: {
    onSwitch: (
        nextStep: "login" | "register" | "autenticar" | "reenviar",
        email: string,
    ) => void;
    email: string;
}) {
    const [email, setEmail] = useState(initialEmail);
    const router = useRouter();
    const methods = useForm<ReenviarCodigoResponse>({
        resolver: zodResolver(reenviarSchema),
        defaultValues: {
            email: email,
        },
    });
    const { handleSubmit, control } = methods;
    const authService = useAuth();
    const { setToastData } = useToastContext();
    const onSubmit = async (data: ReenviarCodigoResponse) => {
        const response = await authService.esqueciSenha(data);
        if (response?.status === 200) {
            setToastData({
                showToast: true,
                toastMessage: "E-mail para alterar senha enviado com sucesso!",
                toastDescription: "Verifique sua caixa de entrada. O e-mail pode ter sido enviado para a caixa de spam também.",
            });
            router.push("/");
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-center text-xl font-semibold text-foreground ">
                    Alterar Senha
                </h2>
                <p className="text-center text-muted-foreground">
                    Digite o endereço de e-mail que você usou para se registrar
                </p>
                <div className="grid gap-4 mt-4 p-2">
                    <div className="grid gap-2">
                        <FormField
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="Digite seu e-mail"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            field.onChange(e);
                                        }}
                                    />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <hr className="bold mx-3" />

                <div className="flex justify-center gap-2 mt-4 px-2">
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => onSwitch("login", "")}
                    >
                        Cancelar
                    </Button>

                    <Button type="submit" className="w-full">
                        Enviar
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
