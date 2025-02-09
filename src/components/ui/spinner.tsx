import React from "react";

const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-4",
    lg: "h-10 w-10 border-4",
    xl: "h-16 w-16 border-4",
  };

  return (
    <div className={`animate-spin rounded-full border-t-primary border-gray-200 ${sizes[size]}`} />
  );
};

export default Spinner;
