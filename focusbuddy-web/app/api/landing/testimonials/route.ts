import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/serverFetch";

interface BackendFeedback {
    id?: number;
    userName?: string | null;
    name?: string | null;
    role?: string | null;
    userRole?: string | null;
    content?: string | null;
    text?: string | null;
    rating?: number | null;
    status?: string | null;
}

const GOOD_REVIEW_MIN_RATING = 4;

function normalizeFeedback(item: BackendFeedback, index: number) {
    const text = (item.text ?? item.content ?? "").trim();
    const rating = typeof item.rating === "number" ? item.rating : 0;

    if (!text || rating < GOOD_REVIEW_MIN_RATING) return null;

    return {
        id: item.id,
        name: item.name?.trim() || item.userName?.trim() || "Người dùng FocusBuddy",
        role: item.role?.trim() || item.userRole?.trim() || "Người dùng thực tế",
        text,
        rating,
        avatar: ["/images/PANDO.png", "/images/FROGI.png", "/images/MONKI.png", "/images/PIGGY.png"][index % 4],
        color: ["#483BFC", "#FA8A38", "#35C85E", "#FF909E"][index % 4],
    };
}

export async function GET() {
    try {
        const response = await fetchBackend("/public/landing/testimonials");
        const data = await response.json().catch(() => null);
        const rawItems = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const testimonials = rawItems
            .map((item: BackendFeedback, index: number) => normalizeFeedback(item, index))
            .filter(Boolean)
            .slice(0, 8);

        return NextResponse.json(
            {
                success: response.ok,
                data: testimonials,
            },
            { status: response.status },
        );
    } catch {
        return NextResponse.json({ success: false, data: [] }, { status: 200 });
    }
}
