import { NextResponse } from "next/server";

import { prisma } from "@repo/db";
import { LEAD_ACTIVITIES } from "@repo/shared";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    const body = await request.text();
    payload = request.headers.get("content-type")?.includes("application/json")
      ? JSON.parse(body)
      : Object.fromEntries(new URLSearchParams(body));
  } catch {
    return NextResponse.json({
      created: false,
      reason: "invalid_json",
    });
  }

  const phone = String(payload.To ?? "").trim();
  const duration = Number(payload.RecordingDurationMs);

  const lead = await prisma.lead.findFirst({
    where: { phone: phone.startsWith("+") ? phone : `+${phone}` },
    select: {
      id: true,
      status: true,
      assignedToUserId: true,
      history: {
        select: {
          status: true,
          followUp: true,
          followUpDate: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!lead) {
    return NextResponse.json({
      created: false,
      reason: "lead_not_found",
    });
  }

  const latestHistory = lead.history[0];

  const callRecord = await prisma.$transaction(async (tx) => {
    const record = await tx.callRecord.create({
      data: {
        calledByUserId: lead.assignedToUserId,
        recordingUrl: String(payload.RecordUrl || payload.RecordFile || ""),
        recordingDurationMs: Number.isFinite(duration)
          ? Math.trunc(duration)
          : null,
      },
      select: { id: true },
    });

    await tx.leadHistory.create({
      data: {
        leadId: lead.id,
        callRecordId: record.id,
        status: latestHistory?.status ?? lead.status,
        activity: LEAD_ACTIVITIES.CALL_DONE,
        remarks: null,
        followUp: latestHistory?.followUp ?? false,
        followUpDate: latestHistory?.followUpDate ?? null,
      },
    });

    return record;
  });

  return NextResponse.json({
    created: true,
    callRecordId: callRecord.id,
  });
}
