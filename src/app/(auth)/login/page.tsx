"use client";

import LoginForm from "./form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Acesse sua conta</h2>
        <LoginForm />
      </div>
    </div>
  );
}
