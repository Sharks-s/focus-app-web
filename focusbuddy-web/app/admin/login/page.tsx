import Image from "next/image";
import { LoginForm } from "@/features/auth";

export default function AdminLoginPage() {
    return (
        <div className="admin-login-page flex w-full items-center justify-center p-6">
            <div className="admin-login-card flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="admin-brand-mark">
                        <Image src="/MonkeyLogo.png" alt="FocusBuddy" width={34} height={34} priority />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#483bfc]">
                            FocusBuddy Admin
                        </p>
                        <h1 className="mt-1 text-2xl font-extrabold text-[#1a1b25]">Đăng nhập</h1>
                        <p className="mt-1 text-sm font-semibold text-[#464557]">
                            Quản trị hệ thống học tập và vận hành.
                        </p>
                    </div>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
