
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-start bg-gray-100">
            <div className="flex justify-center w-full lg:w-full px-4 sm:px-6 lg:px-0 relative z-10">
                <div className="relative w-full max-w-xl min-h-fit overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}