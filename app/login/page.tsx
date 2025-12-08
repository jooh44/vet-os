import { Suspense } from 'react';
import LoginForm from '@/components/login-form';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="mb-8 flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8"
                        >
                            <path d="M10 5.172C10 3.782 8.217 2.5 6.043 2.5a4.25 4.25 0 0 0-4.008 5.75c.9 2.5 3.8 6.5 7.965 10.75a.75.75 0 0 0 1.077 0c4.165-4.25 7.065-8.25 7.965-10.75A4.25 4.25 0 0 0 14.15 2.5c-2.174 0-3.957 1.282-3.957 2.672" />
                            <path d="M16 10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Vet.OS Login</h1>
                    <p className="text-sm text-gray-500">
                        Entre com suas credenciais para acessar o sistema
                    </p>
                </div>
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}
