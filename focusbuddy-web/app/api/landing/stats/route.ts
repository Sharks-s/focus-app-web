import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/serverFetch";

export async function GET() {
    const response = await fetchBackend("/public/landing/stats");
    const data = await response.json().catch(() => null);

    return NextResponse.json(data, { status: response.status });
}
