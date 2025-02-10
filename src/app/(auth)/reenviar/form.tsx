import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { reenviarSchema } from "./schema";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ReenviarEmailResponse } from "@/types/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ReenviarForm({
    onSwitch,
    email: initialEmail,
}: { onSwitch: () => void; email: string }) {
    const [email, setEmail] = useState(initialEmail);

    const methods = useForm<ReenviarEmailResponse>({
        resolver: zodResolver(reenviarSchema),
        defaultValues: {
            email: email,
        },
    });
    const { handleSubmit, control } = methods;
    const onSubmit = async (data: ReenviarEmailResponse) => {
        console.log(data);
    };
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-center text-xl font-semibold text-foreground ">
                    Reenviar código
                </h2>
                <p className="text-center text-muted-foreground">
                    E-mail para o envio do código de verificação
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
                    <Button variant="secondary" type="submit" className="w-full" onClick={onSwitch}>
                        Cancelar
                    </Button>

                    <Button type="submit" className="w-full" onClick={handleSubmit(onSubmit)}>
                        Reenviar
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
