import { cn } from "@/lib/utils";

function statusClassName(status: string) {
  const value = status.toLowerCase();

  if (value.includes("dead") || value.includes("reject") || value.includes("drop")) {
    return "border-red-500 bg-red-100 text-red-800 dark:border-red-400 dark:bg-red-500/25 dark:text-red-100";
  }

  if (
    value.includes("approved") ||
    value.includes("received") ||
    value.includes("done") ||
    value.includes("enrolled") ||
    value.includes("converted") ||
    value.includes("accepted")
  ) {
    return "border-emerald-500 bg-emerald-100 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-500/25 dark:text-emerald-100";
  }

  if (
    value.includes("hot") ||
    value.includes("progress") ||
    value.includes("process") ||
    value.includes("preparation") ||
    value.includes("applied")
  ) {
    return "border-blue-500 bg-blue-100 text-blue-800 dark:border-blue-400 dark:bg-blue-500/25 dark:text-blue-100";
  }

  if (
    value.includes("warm") ||
    value.includes("follow") ||
    value.includes("pending") ||
    value.includes("hold") ||
    value.includes("booked")
  ) {
    return "border-amber-500 bg-amber-100 text-amber-900 dark:border-amber-400 dark:bg-amber-500/25 dark:text-amber-100";
  }

  if (value.includes("cold") || value.includes("not started")) {
    return "border-slate-500 bg-slate-100 text-slate-800 dark:border-slate-400 dark:bg-slate-500/25 dark:text-slate-100";
  }

  return "border-sky-500 bg-sky-100 text-sky-800 dark:border-sky-400 dark:bg-sky-500/25 dark:text-sky-100";
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-semibold",
        statusClassName(status),
      )}
    >
      {status}
    </span>
  );
}
