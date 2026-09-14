import type { UserStatus } from "../types/users.types";

const STATUS_STYLE: Record<UserStatus, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACTIVE: "bg-green-100 text-green-700",
    DEACTIVATED: "bg-gray-100 text-gray-700",
    SUSPENDED: "bg-orange-100 text-orange-700",
    BLOCKED: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<UserStatus, string> = {
    PENDING: "Chờ xác thực",
    ACTIVE: "Hoạt động",
    DEACTIVATED: "Tự khóa",
    SUSPENDED: "Tạm khóa",
    BLOCKED: "Bị cấm",
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
            {STATUS_LABEL[status]}
        </span>
    );
}