"use client";

import type React from "react";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    size?: number;
    strokeWidth?: number;
    title?: string;
    description?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
    currentStep,
    totalSteps,
    size = 80,
    strokeWidth = 6,
    title,
    description,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const fillPercentage = (currentStep / totalSteps) * 100;
    const dashOffset = circumference - (circumference * fillPercentage) / 100;

    return (
        <div className="flex items-center gap-4">
            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size}>
                    <title>Indicador de etapas</title>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        className="text-muted-foreground"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className="text-primary transition-all duration-300 ease-in-out"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium" aria-live="polite">
                        {currentStep} de {totalSteps}
                    </span>
                </div>
            </div>
            <div className="flex flex-col">
                <h2 className="flex-1 text-lg font-medium">{title}</h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div >
    );
};

export default StepIndicator;
