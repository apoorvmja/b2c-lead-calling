import { NextResponse } from "next/server";

import { prisma } from "@repo/db";

import { getCrmRecordScope } from "@/lib/crm-record-scope";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { leadWhere } = await getCrmRecordScope();

  const callRecord = await prisma.callRecord.findFirst({
    where: {
      id,
      recordingUrl: { not: null },
      leadHistories: { some: { lead: leadWhere } },
    },
    select: { recordingUrl: true },
  });

  if (!callRecord?.recordingUrl) {
    return new NextResponse("Recording not found", { status: 404 });
  }

  const authId = process.env.VOBIZ_AUTH_ID;
  const authToken = process.env.VOBIZ_AUTH_TOKEN;

  if (!authId || !authToken) {
    return new NextResponse("Missing Vobiz credentials", { status: 500 });
  }

  const headers = new Headers({
    "X-Auth-ID": authId,
    "X-Auth-Token": authToken,
  });
  const range = request.headers.get("range");

  if (range) {
    headers.set("Range", range);
  }

  const response = await fetch(callRecord.recordingUrl, {
    headers,
    cache: "no-store",
  });

  if (!response.ok || !response.body) {
    return new NextResponse("Recording unavailable", { status: response.status });
  }

  const responseHeaders = new Headers({
    "Cache-Control": "private, no-store",
    "Content-Disposition": "inline",
    "Content-Type": response.headers.get("content-type") ?? "audio/mpeg",
  });

  for (const header of ["accept-ranges", "content-length", "content-range"]) {
    const value = response.headers.get(header);

    if (value) {
      responseHeaders.set(header, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}
