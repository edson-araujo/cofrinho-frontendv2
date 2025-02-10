import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-start bg-gray-100">
            <div className="flex justify-center w-full lg:w-1/2 px-4 sm:px-6 lg:px-0">
                <div className="relative w-full max-w-xl min-h-fit overflow-hidden">
                    {children}
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 h-screen relative">
                <Image
                    src="/image/porquinho.png"
                    alt="Imagem do porquinho"
                    fill
                    className="object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
