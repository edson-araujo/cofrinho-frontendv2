import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const methods = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  interface LoginFormInputs {
    email: string;
    password: string;
  }

  interface LoginResponse {
    success: boolean;
    message?: string;
  }

  const onSubmit = async (data: LoginFormInputs) => {
    const response: LoginResponse = await login(data);
    if (response.success) {
      router.push("/dashboard");
    } else {
      alert(response.message);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, control } = methods;

  return (
    <FormProvider {...methods}>
      <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
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
        </div>
      </form>
    </FormProvider>
  );
}