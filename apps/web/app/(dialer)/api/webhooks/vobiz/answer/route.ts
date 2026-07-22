import { NextResponse } from "next/server";

import {
  isVobizHangup,
  isVobizSdkCall,
  parseVobizParams,
  vobizInboundXml,
  vobizOutboundXml,
  vobizXml,
} from "../../../../_lib/vobiz-helper";

const xmlHeaders = {
  "Content-Type": "text/xml",
};

async function answer(request: Request) {
  const params = await parseVobizParams(request);
  if (isVobizHangup(params)) {
    return new NextResponse(vobizXml(), { headers: xmlHeaders });
  }

  const callerId = process.env.CALLER_ID;
  if (!callerId) {
    return new NextResponse("Missing CALLER_ID", { status: 500 });
  }

  if (isVobizSdkCall(params)) {
    return new NextResponse(vobizOutboundXml(params, callerId), {
      headers: xmlHeaders,
    });
  }

  const sipEndpoint = process.env.SIP_ENDPOINT;
  if (!sipEndpoint) {
    return new NextResponse("Missing SIP_ENDPOINT", { status: 500 });
  }

  return new NextResponse(vobizInboundXml(callerId, sipEndpoint), {
    headers: xmlHeaders,
  });
}

export async function GET(request: Request) {
  return answer(request);
}

export async function POST(request: Request) {
  return answer(request);
}
