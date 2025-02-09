import React from "react";
import Spinner from "@/components/ui/spinner";

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Spinner size="xl" />
    </div>
  );
};

export default LoadingScreen;
