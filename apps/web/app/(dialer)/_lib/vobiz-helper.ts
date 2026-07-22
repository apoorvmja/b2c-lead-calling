export type VobizParams = Record<string, string>;

export const VOBIZ_RECORDING_CALLBACK_URL =
  process.env.VOBIZ_RECORDING_CALLBACK_URL ??
  "https://crm.mja.in/api/webhooks/vobiz/call-recording";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function parseVobizParams(request: Request) {
  const query = Object.fromEntries(new URL(request.url).searchParams.entries());
  const body = await request.text();

  return body
    ? { ...query, ...Object.fromEntries(new URLSearchParams(body).entries()) }
    : query;
}

export function isVobizSdkCall(params: VobizParams) {
  const from = params.From ?? params.from ?? "";
  const routeType = (params.RouteType ?? params.routeType ?? "").toLowerCase();

  return from.startsWith("sip:") || routeType === "sip";
}

export function isVobizHangup(params: VobizParams) {
  return (params.Event ?? params.event) === "Hangup";
}

export function normalizeVobizDestination(destination = "") {
  let value = destination.trim();

  if (value.startsWith("sip:")) {
    value = value.match(/^sip:(.*?)@/)?.[1] ?? value;
  }

  return value && !value.startsWith("+") ? `+${value}` : value;
}

export function vobizXml(inner = "") {
  return `<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`;
}

export function vobizOutboundXml(params: VobizParams, callerId: string) {
  const destination = normalizeVobizDestination(params.To ?? params.to ?? "");

  return vobizXml(`
    <Record startOnDialAnswer="true" callbackUrl="${VOBIZ_RECORDING_CALLBACK_URL}" callbackMethod="POST" redirect="false" playBeep="false"/>
    <Dial callerId="${escapeXml(callerId)}">
      <Number>${escapeXml(destination)}</Number>
    </Dial>`);
}

export function vobizInboundXml(callerId: string, sipEndpoint: string) {
  return vobizXml(`
    <Dial callerId="${escapeXml(callerId)}" timeout="30">
      <User>${escapeXml(sipEndpoint)}</User>
    </Dial>`);
}
