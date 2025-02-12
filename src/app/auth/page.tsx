"use client";

import { useState } from "react";
import LoginForm from "./login/form";
import RegisterForm from "./register/form";
import VerifyForm from "./autenticar/form";
import ReenviarForm from "./reenviar/form";
import AlterarSenhaForm from "./alterarSenha/form";

export default function AuthSwitcher() {
    const [step, setStep] = useState<
        "login" | "register" | "autenticar" | "reenviar" | "alterarSenha"
    >("login");
    const [userEmail, setUserEmail] = useState("");
    const [userAutenticado, setUserAutenticado] = useState(false);

    const handleSwitch = (
        nextStep?: "login" | "register" | "autenticar" | "reenviar" | "alterarSenha",
        email?: string,
        userAutenticado?: boolean,
    ) => {
        if (email) {
            setUserEmail(email);
        }
        if (userAutenticado) {
            setUserAutenticado(userAutenticado);
        }

        setStep(nextStep || step);
    };

    return (
        <div className=" bg-white p-4 sm:p-8 md:p-6 m-0 md:m-8 rounded-lg shadow-lg justify-center">
            <div className="relative w-full max-w-xl min-h-fit overflow-hidden">
                {step === "login" && (
                    <LoginForm
                        userAutenticado={userAutenticado}
                        onSwitch={(
                            nextStep: "login" | "register" | "autenticar" | "reenviar",
                            email?: string,
                            userAutenticado?: boolean,
                        ) => handleSwitch(nextStep, email, userAutenticado)}
                    />
                )}
                {step === "register" && (
                    <RegisterForm
                        onSwitch={(nextStep, email) =>
                            handleSwitch(nextStep || "autenticar", email)
                        }
                    />
                )}
                {step === "autenticar" && (
                    <VerifyForm
                        email={userEmail}
                        onSwitch={(nextStep, email, userAutenticado) =>
                            handleSwitch(nextStep || "reenviar", "", userAutenticado)
                        }
                    />
                )}
                {step === "reenviar" && (
                    <ReenviarForm
                        email={userEmail}
                        onSwitch={(nextStep) => handleSwitch(nextStep || "autenticar")}
                    />
                )}
                {step === "alterarSenha" && (
                    <AlterarSenhaForm
                        email={userEmail}
                        onSwitch={(nextStep) => handleSwitch(nextStep || "login")}
                    />
                )}
            </div>
        </div>
    );
}
