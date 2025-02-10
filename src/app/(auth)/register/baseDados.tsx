import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { registerSchema } from "./schema";

export default function BaseDados({ updateFormData, formData }: { updateFormData: (data: { nome: string; sobrenome: string; email: string }) => void; formData: { nome: string; sobrenome: string; email: string } }) {
    const methods = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: formData,
    });
    const { handleSubmit, control } = methods;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(data => updateFormData(data))}>
                <div className="grid gap-4">
                    <FormField
                        control={control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input {...field} onChange={e => { field.onChange(e); updateFormData({ ...formData, nome: e.target.value }); }} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="sobrenome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sobrenome</FormLabel>
                                <FormControl>
                                    <Input {...field} onChange={e => { field.onChange(e); updateFormData({ ...formData, sobrenome: e.target.value }); }} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" onChange={e => { field.onChange(e); updateFormData({ ...formData, email: e.target.value }); }} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </FormProvider>
    );
}
