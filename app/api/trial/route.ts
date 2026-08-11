import { type NextRequest, NextResponse } from "next/server"
import { saveTrialRequest } from "@/lib/leads"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body?.email || !body?.fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await saveTrialRequest({
      fullName: String(body.fullName),
      practiceName: String(body.practiceName ?? ""),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      requestedAt: typeof body?.requestedAt === "string" ? body.requestedAt : new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[v0] Trial request save failed:", error)
    return NextResponse.json({ error: "Failed to save trial request" }, { status: 500 })
  }
}
