import { DashboardContent } from "@/features/dashboard";

export const metadata = {
    title: "Dashboard - FocusBuddy Admin",
    description: "Tổng quan số liệu hệ thống FocusBuddy: users, sessions, tăng trưởng.",
};

export default function DashboardPage() {
    return <DashboardContent />;
}
