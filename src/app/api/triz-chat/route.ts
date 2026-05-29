import { NextResponse } from "next/server";
import { answerTrizQuestion, type TrizLocale } from "@/lib/triz/triz-rag";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: unknown; locale?: unknown };
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const locale: TrizLocale = body.locale === "en" ? "en" : "vi";

    if (!query) {
      return NextResponse.json({ error: "empty-query" }, { status: 400 });
    }

    if (query.length > 1200) {
      return NextResponse.json({ error: "query-too-long" }, { status: 400 });
    }

    return NextResponse.json(answerTrizQuestion(query, locale));
  } catch (error) {
    console.error("TRIZ chat failed", error);
    return NextResponse.json({ error: "triz-chat-failed" }, { status: 500 });
  }
}
