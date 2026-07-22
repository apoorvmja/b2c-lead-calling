import { VobizCallWrapper } from "../_components/vobiz-call-wrapper";

export default function DialerPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 text-foreground">
      <VobizCallWrapper defaultOpen />
    </main>
  );
}
