"use client";

import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";

let dialerWindow: Window | null = null;

function normalizePhoneNumber(phone: string): string {
  let digits = phone.replace(/\D/g, "");

  // Remove all leading zeros (e.g. 09811317599 -> 9811317599)
  digits = digits.replace(/^0+/, "");

  // Already has country code
  if (digits.startsWith("91") && digits.length === 12) {
    return `+${digits}`;
  }

  // Local Indian number
  if (digits.length === 10) {
    return `+91${digits}`;
  }

  // Too many digits but ends with a valid Indian number
  if (digits.length > 10) {
    return `+91${digits.slice(-10)}`;
  }

  // Fallback
  return `+${digits}`;
}

export function LeadCallButton({ phone }: { phone: string }) {
  const normalizedPhone = normalizePhoneNumber(phone);

  const url = `http://localhost:8080/client/index.html?phone_number=${encodeURIComponent(normalizedPhone)}`;

  function openDialer(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    const width = 420;
    const height = 760;

    if (dialerWindow && !dialerWindow.closed) {
      dialerWindow.location.href = url;
      dialerWindow.focus();
      return;
    }

    dialerWindow = window.open(
      url,
      "dialer",
      `popup=yes,width=${width},height=${height},resizable=yes`
    );
  }

  return (
    <Button
      nativeButton={false}
      variant="outline"
      size="sm"
      render={
        <a href={url} onClick={openDialer} rel="noreferrer" />
      }
    >
      <Phone />
      Call
    </Button>
  );
}