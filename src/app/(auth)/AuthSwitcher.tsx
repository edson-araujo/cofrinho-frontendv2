"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "./login/form";
import RegisterForm from "./register/form";
import VerifyForm from "./autenticar/form";
import ReenviarForm from "./reenviar/form";

export default function AuthSwitcher() {
    const [step, setStep] = useState<"login" | "register" | "autenticar" | "reenviar">("login");
    const [userEmail, setUserEmail] = useState(""); // Estado para armazenar o e-mail

    const slideVariants = {
        hiddenRight: { x: "100%", opacity: 0 },
        hiddenLeft: { x: "-100%", opacity: 0 },
        visible: { x: "0%", opacity: 1 },
        exitRight: { x: "-100%", opacity: 0 },
        exitLeft: { x: "100%", opacity: 0 },
    };

    return (
        <motion.div
            key={step}
            variants={slideVariants}
            initial={"hiddenLeft"}
            animate="visible"
            exit={step === "register" ? "exitLeft" : "exitRight"}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className=" bg-white p-6 sm:p-8 md:p-6 rounded-lg shadow-lg m-10"
        >
            <div className="relative w-full max-w-xl min-h-fit overflow-hidden">
                {step === "login" && <LoginForm onSwitch={() => setStep("register")} />}
                {step === "register" && <RegisterForm onSwitch={(email) => { setUserEmail(email); setStep("autenticar"); }} />}
                {step === "autenticar" && <VerifyForm email={userEmail} onSwitch={() => setStep("reenviar")} />}
                {step === "reenviar" && <ReenviarForm email={userEmail} onSwitch={() => setStep("autenticar")} />}
            </div>
        </motion.div>
    );
}
