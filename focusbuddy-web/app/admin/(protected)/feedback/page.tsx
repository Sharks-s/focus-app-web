import { UserFeedbacksPanel } from "@/features/user-feedbacks";

export default function FeedbackPage() {
    return (
        <div className="flex flex-col gap-5">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#483bfc]">
                    Feedback
                </p>
                <h1>Phản hồi người dùng</h1>
                <p className="text-sm font-semibold text-muted-foreground">
                    Theo dõi góp ý, xử lý trạng thái và phản hồi trực tiếp cho user.
                </p>
            </div>

            <UserFeedbacksPanel />
        </div>
    );
}
