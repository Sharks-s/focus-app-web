// app/(landing)/payment/result/page.tsx
import { Suspense } from "react";
import { PaymentResultView } from "./PaymentResultView";

export default function PaymentResultPage() {
    return (
        <Suspense fallback={<PaymentResultFallback />}>
            <PaymentResultView />
        </Suspense>
    );
}

function PaymentResultFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <p className="text-muted-foreground">Đang tải kết quả thanh toán...</p>
        </div>
    );
}