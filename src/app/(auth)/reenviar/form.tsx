import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { reenviarSchema } from "./schema";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ReenviarCodigoResponse } from "@/types/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth";

export default function ReenviarForm({
    onSwitch,
    email: initialEmail,
}: { onSwitch: (nextStep: "login" | "register" | "autenticar" | "reenviar", email: string) => void; email: string }) {
    const [email, setEmail] = useState(initialEmail);

    const methods = useForm<ReenviarCodigoResponse>({
        resolver: zodResolver(reenviarSchema),
        defaultValues: {
            email: email,
        },
    });
    const { handleSubmit, control } = methods;
    const authService = useAuth();
    const onSubmit = async (data: ReenviarCodigoResponse) => {
        const response = await authService.reenviarCodigoAutenticacao(data);
        if (response?.status === 200) {
            onSwitch("autenticar", methods.getValues("email"));
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-center text-xl font-semibold text-foreground ">
                    Reenviar código
                </h2>
                <p className="text-center text-muted-foreground">
                    Enviamos um código para &nbsp;
                    <span className="font-semibold text-foreground">{email}</span>
                </p>
                <div className="grid gap-4 mb-4 px-2">
                    <div className="grid gap-2">
                        <FormField
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium text-muted-foreground">
                                        E-mail
                                    </FormLabel>
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
                    <Button variant="secondary" className="w-full" onClick={() => onSwitch("autenticar", "")}>
                        Cancelar
                    </Button>

                    <Button type="submit" className="w-full">
                        Reenviar
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
