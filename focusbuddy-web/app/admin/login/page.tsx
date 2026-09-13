import { LoginForm } from "@/features/auth";

export default function AdminLoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <h1 className="text-xl font-semibold">Đăng nhập Admin</h1>
                <LoginForm />
            </div>
        </div>
    );
}