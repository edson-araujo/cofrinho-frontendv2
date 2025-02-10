"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { registerUser } from "@/services/auth";
import type { RegisterFormInputs } from "@/types/auth";

export default function RegisterForm({ onSwitch }: { onSwitch: (email: string) => void }) {
  const methods = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      sobrenome: "",
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const { handleSubmit, control } = methods;

  const onSubmit = async (data: RegisterFormInputs) => {
    console.log("Dados de Registro:", data);
    const response = await registerUser(data);
    if (response?.status === 201) {
      onSwitch(data.email);
    } else {
      const errorMessage = await response?.json();
      alert(errorMessage.message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-3 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 p-4">
          <FormField
            control={control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-600">
                  Nome
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite seu nome" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Sobrenome */}
          <FormField
            control={control}
            name="sobrenome"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-600">
                  Sobrenome
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Digite seu sobrenome" />
                </FormControl>
              </FormItem>
            )}
          />

          {/* E-mail */}
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
                    type="email"
                    placeholder="email@example.com"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium text-gray-600">
                  Senha
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Crie uma senha segura"
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      onKeyDown={(e) => {
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

          <Button type="submit" className="w-full">
            Criar Conta
          </Button>

          <p className="text-sm text-center mt-4">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => onSwitch(methods.getValues("email"))}
              className="text-primary hover:underline"
            >
              Fazer Login
            </button>
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
