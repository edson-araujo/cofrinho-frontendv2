import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function LoginForm({ onSwitch, userAutenticado }: { onSwitch: (nextStep: "login" | "register" | "autenticar" | "reenviar") => void, userAutenticado?: boolean }) {
  const { toast } = useToast()
  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    console.log(data)
  };

  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, control } = methods;

  useEffect(() => {
    if (userAutenticado) {
      toast({
        title: "Conta autenticada com sucesso!",
        description: "Você já pode acessar sua conta.",
      });
    }
  }, [userAutenticado, toast]);
  return (
    <FormProvider {...methods}>
      <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 p-4">
          <div className="grid gap-2">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-gray-600">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center w-full">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="flex justify-between items-center w-full">
                      <FormLabel className="font-medium text-gray-600">
                        Senha
                      </FormLabel>
                      <Link
                        href="#"
                        className="ml-auto text-sm font-medium text-gray-400"
                        prefetch={false}
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                    <FormControl className="w-full">
                      <div className="relative w-full">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="py-3 px-3 w-full"
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
                          {!showPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <Button variant="outline" className="w-full">
            Entrar com Google
          </Button>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            Não tem uma conta?{" "}
            <button type="button" onClick={() => onSwitch("register")} className="text-foreground hover:underline">
              Criar Conta
            </button>
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
