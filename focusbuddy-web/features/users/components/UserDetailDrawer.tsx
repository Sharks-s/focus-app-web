"use client";

import { useUserDetail, useUpdateUserStatus, useUpdateUserRole } from "../hooks/useUsers";
import { UserStatusBadge } from "./UserStatusBadge";
import { useAuthStore } from "@/features/auth";
import type { UserStatus, RoleCode } from "../types/users.types";

const ADMIN_ASSIGNABLE_STATUSES: UserStatus[] = ["ACTIVE", "DEACTIVATED", "SUSPENDED", "BLOCKED"];
const ROLE_OPTIONS: RoleCode[] = ["ADMIN", "USER"];

export function UserDetailDrawer({
    userId,
    onClose,
}: {
    userId: number;
    onClose: () => void;
}) {
    const { data: user, isLoading } = useUserDetail(userId);
    const updateStatus = useUpdateUserStatus();
    const updateRole = useUpdateUserRole();
    const { user: currentAdmin } = useAuthStore();

    const isSelf = currentAdmin?.id === userId;
    const currentRole = user?.roles[0]; // chỉ 1 role active tại 1 thời điểm theo nghiệp vụ đã chốt

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="h-full w-full max-w-md overflow-y-auto bg-background p-6 shadow-xl"
            >
                <button onClick={onClose} className="mb-4 text-sm text-muted-foreground">
                    Đóng ✕
                </button>

                {isLoading && <p className="text-sm">Đang tải...</p>}

                {user && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.fullName ?? user.email}
                                    className="h-14 w-14 rounded-full object-cover border"
                                />
                            ) : (
                                <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground">
                                    {(user.fullName ?? user.email).charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg font-semibold">{user.fullName ?? user.email}</h2>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <UserStatusBadge status={user.status} />
                            {user.premium && (
                                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                                    Premium
                                </span>
                            )}
                        </div>

                        <dl className="grid grid-cols-2 gap-y-2 text-sm">
                            <dt className="text-muted-foreground">SĐT</dt>
                            <dd>{user.phoneNumber ?? "—"}</dd>

                            <dt className="text-muted-foreground">Giới tính</dt>
                            <dd>{user.gender ?? "—"}</dd>

                            <dt className="text-muted-foreground">Ngày sinh</dt>
                            <dd>{user.dateOfBirth ?? "—"}</dd>

                            <dt className="text-muted-foreground">Personality</dt>
                            <dd>{user.personalityCode ?? "—"}</dd>

                            <dt className="text-muted-foreground">Tổng session</dt>
                            <dd>{user.totalFocusSessions}</dd>

                            <dt className="text-muted-foreground">Phút dùng hôm nay</dt>
                            <dd>{user.dailyUsedMinutes ?? 0} phút</dd>

                            <dt className="text-muted-foreground">Hồ sơ</dt>
                            <dd>{user.profileCompleted ? "Đã hoàn thiện" : "Chưa hoàn thiện"}</dd>

                            <dt className="text-muted-foreground">Đăng nhập gần nhất</dt>
                            <dd>
                                {user.lastLoginAt
                                    ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                                    : "Chưa từng đăng nhập"}
                            </dd>

                            <dt className="text-muted-foreground">Đăng ký lúc</dt>
                            <dd>{new Date(user.createdAt).toLocaleString("vi-VN")}</dd>
                        </dl>

                        {/* Đổi role */}
                        <div className="flex flex-col gap-2 border-t pt-4">
                            <label className="text-sm font-medium">Role</label>

                            {isSelf && (
                                <p className="text-xs text-amber-600">
                                    Không thể tự đổi role của chính tài khoản đang đăng nhập.
                                </p>
                            )}

                            <select
                                value={currentRole ?? ""}
                                disabled={isSelf || updateRole.isPending}
                                onChange={(e) =>
                                    updateRole.mutate({ id: userId, roleCode: e.target.value as RoleCode })
                                }
                                className="border rounded-md px-3 py-2 text-sm disabled:bg-muted disabled:text-muted-foreground"
                            >
                                {!currentRole && <option value="">-- Chưa có role --</option>}
                                {ROLE_OPTIONS.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>

                            {updateRole.isError && (
                                <p className="text-sm text-red-500">Đổi role thất bại, thử lại.</p>
                            )}
                        </div>

                        {/* Đổi trạng thái */}
                        <div className="flex flex-col gap-2 border-t pt-4">
                            <label className="text-sm font-medium">Đổi trạng thái</label>

                            {user.status === "PENDING" && (
                                <p className="text-xs text-muted-foreground">
                                    User đang chờ xác thực OTP, không thể set tay — chỉ có thể chuyển
                                    sang các trạng thái bên dưới nếu cần can thiệp thủ công.
                                </p>
                            )}

                            <select
                                defaultValue=""
                                disabled={updateStatus.isPending}
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    updateStatus.mutate({ id: userId, status: e.target.value as UserStatus });
                                }}
                                className="border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">-- Chọn trạng thái mới --</option>
                                {ADMIN_ASSIGNABLE_STATUSES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>

                            {updateStatus.isError && (
                                <p className="text-sm text-red-500">Cập nhật thất bại, thử lại.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
