// app/(landing)/payment/result/PaymentResultView.tsx
"use client";

import { useSearchParams } from "next/navigation";

export function PaymentResultView() {
    const searchParams = useSearchParams();
    const resultCode = searchParams.get("resultCode");
    const message = searchParams.get("message");
    const orderId = searchParams.get("orderId");
    const isSuccess = resultCode === "0";

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted px-4">
            <div className="w-full max-w-md rounded-2xl bg-background p-10 text-center shadow-lg">
                <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${isSuccess ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                >
                    {isSuccess ? "✓" : "✕"}
                </div>

                <h1 className="text-xl font-semibold">
                    {isSuccess ? "Thanh toán thành công" : "Thanh toán không thành công"}
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    {isSuccess
                        ? "Cảm ơn bạn! Vui lòng quay lại ứng dụng Focus Buddy để tiếp tục."
                        : message || "Giao dịch không hoàn tất. Vui lòng thử lại trong ứng dụng."}
                </p>

                {orderId && (
                    <p className="mt-4 text-xs text-muted-foreground">Mã đơn hàng: {orderId}</p>
                )}

                <p className="mt-6 text-xs text-muted-foreground">
                    Bạn có thể đóng tab này và quay lại ứng dụng.
                </p>
            </div>
        </div>
    );
}