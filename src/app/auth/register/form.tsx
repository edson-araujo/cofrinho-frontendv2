"use client";

import { Button } from "@/components/ui/button";
import { defineStepper } from "@stepperize/react";
import BaseDados from "./baseDados";
import ConfidenceDados from "./confidenceDados";
import { useState } from "react";
import "./style.css";
import StepIndicator from "@/components/ui/stepIndicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const { useStepper, utils } = defineStepper(
  {
    id: "baseDados",
    title: "Dados Pessoais",
    description: "Informe seus dados básicos",
  },
  {
    id: "confidenceDados",
    title: "Dados confidenciais ",
    description: "Informe seus dados confidenciais",
  }
);

export default function RegisterForm({
  onSwitch,
}: {
  onSwitch: (
    nextStep: "login" | "register" | "autenticar" | "reenviar",
    email?: string
  ) => void;
}) {
  const stepper = useStepper();
  const currentIndex = utils.getIndex(stepper.current.id);
  const [formData, setFormData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  return (
    <>
      <div className="space-y-6 m-4">
        <StepIndicator currentStep={currentIndex + 1} totalSteps={stepper.all.length} title={stepper.current.title} description={stepper.current.description} />
        {globalError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-semibold">Erro</AlertTitle>
            <AlertDescription>
              {globalError}
            </AlertDescription>
          </Alert>

        )}
        {stepper.switch({
          baseDados: () => <BaseDados updateFormData={updateFormData} formData={formData} formErrors={formErrors}
            setFormErrors={setFormErrors} setGlobalError={setGlobalError} />,
          confidenceDados: () => <ConfidenceDados updateFormData={updateFormData} onSwitch={onSwitch} formData={formData} formErrors={formErrors}
            setFormErrors={setFormErrors}
            setGlobalError={setGlobalError} />,
        })}

        <div className="space-y-4">
          {!stepper.isLast ? (
            <div className="flex justify-between gap-4">
              <Button variant="ghost" onClick={stepper.prev} disabled={stepper.isFirst}>
                Voltar
              </Button>
              <Button variant="ghost" onClick={stepper.next}>{stepper.isLast ? "Completar" : "Próximo"}</Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={stepper.reset} className={`${Object.keys(formErrors).some(key => formErrors[key] !== "") ? "text-red-500" : ""}`}>
              Voltar
            </Button>)}
        </div>
      </div>
      <p className="text-sm text-center mt-4 text-muted-foreground">
        Já tem uma conta? {" "}
        <button type="button" onClick={() => onSwitch("login")} className="text-foreground hover:underline">
          Fazer Login
        </button>
      </p>
    </>
  );
}