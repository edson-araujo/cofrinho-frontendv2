import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/services/auth";
import type { LoginFormInputs } from "@/types/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToastContext } from "@/context/ToastContext";

export default function LoginForm({
  onSwitch,
  userAutenticado,
}: {
  onSwitch: (
    nextStep: "login" | "register" | "autenticar" | "reenviar",
    email: string,
    userAutenticado: boolean,
  ) => void;
  userAutenticado?: boolean;
}) {
  const { toast } = useToast();
  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const authService = useAuth();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const onSubmit = async (data: LoginFormInputs) => {
    const { data: responseData, error, status } = await authService.loginUser(data);
    if (error) {
      setGlobalError(error);
      if (status === 401) {
        onSwitch("autenticar", data.email, false);
      }
      return;
    }


    toast({ title: "Sucesso", description: "Login realizado com sucesso!" });
  };

  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, control } = methods;
  const { toastData, setToastData } = useToastContext();

  useEffect(() => {
    if (userAutenticado) {
      toast({
        title: "Conta autenticada com sucesso!",
        description: "Você já pode acessar sua conta.",
      });
    }
  }, [userAutenticado, toast]);

  useEffect(() => {
    if (toastData.showToast) {

      toast({
        title: toastData.toastMessage || "Notificação",
        description: toastData.toastDescription || "",
        variant: toastData.toastVariant || "default",
      });

      setToastData({ showToast: false });
    }
  }, [toastData, toast, setToastData]);
  return (
    <FormProvider {...methods}>
      <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 p-4">
          {globalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold">Atenção</AlertTitle>
              <AlertDescription>
                {globalError}
              </AlertDescription>
            </Alert>

          )}
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
                      onChange={(e) => {
                        field.onChange(e);
                        setGlobalError(null);
                      }}
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
                        onClick={() => onSwitch("reenviar", field.value, false)}
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
                          onChange={(e) => {
                            field.onChange(e);
                            setGlobalError(null);
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
            <button
              type="button"
              onClick={() => onSwitch("register", "", false)}
              className="text-foreground hover:underline"
            >
              Criar Conta
            </button>
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
