import React from "react";

const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-4",
    lg: "h-10 w-10 border-4",
    xl: "h-16 w-16 border-4",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
      <div className={`animate-spin rounded-full border-t-primary border-white ${sizes[size]}`} />
    </div>
  );
};

export default Spinner;
