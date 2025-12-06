import { Suspense } from 'react';
import LoginForm from '@/components/login-form';

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex w-full items-end rounded-lg bg-primary p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <h1 className="text-2xl font-bold">VetOS</h1>
                    </div>
                </div>
                <Suspense>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}
