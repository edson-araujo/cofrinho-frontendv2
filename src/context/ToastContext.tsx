"use client";
import { createContext, useContext, useState, type ReactNode } from "react";

type ToastMessage = {
    showToast: boolean;
    toastMessage?: string;
    toastDescription?: string;
    toastVariant?: "default" | "destructive";
};

type ToastContextType = {
    toastData: ToastMessage;
    setToastData: (data: ToastMessage) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toastData, setToastData] = useState<ToastMessage>({
        showToast: false,
    });

    return (
        <ToastContext.Provider value={{ toastData, setToastData }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToastContext() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToastContext deve ser usado dentro do ToastProvider");
    }
    return context;
}
