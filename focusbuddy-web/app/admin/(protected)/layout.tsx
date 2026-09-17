import { AuthGate } from "@/features/auth";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
// import { AdminHeader } from "@/components/layout/AdminHeader";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGate>
            <div className="admin-shell flex h-screen w-full">
                <AdminSidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* <AdminHeader /> */}
                    <main className="admin-main flex-1 overflow-y-auto p-6">{children}</main>
                </div>
            </div>
        </AuthGate>
    );
}
