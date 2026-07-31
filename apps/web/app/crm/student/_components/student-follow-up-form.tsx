"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import { STUDENT_STATUS } from "@repo/shared";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const textareaClassName =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const statusesWithoutFollowUp = [
  STUDENT_STATUS.COMPLETED,
  STUDENT_STATUS.DROPPED,
  STUDENT_STATUS.VISA_REJECTED,
  STUDENT_STATUS.ON_HOLD,
];

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="animate-spin" />
          Adding follow up...
        </>
      ) : (
        "Add Follow Up"
      )}
    </Button>
  );
}

export function StudentFollowUpForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState("");
  const [followUp, setFollowUp] = useState(true);
  const canSkipFollowUp = statusesWithoutFollowUp.includes(status as never);

  async function submitAction(formData: FormData) {
    try {
      await action(formData);
      toast.success("Follow up added");
      formRef.current?.reset();
      setStatus("");
      setFollowUp(true);
    } catch {
      toast.error("Could not add follow up");
    }
  }

  return (
    <form
      ref={formRef}
      action={submitAction}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      <select
        name="status"
        required
        value={status}
        onChange={(event) => {
          const nextStatus = event.target.value;

          setStatus(nextStatus);
          if (!statusesWithoutFollowUp.includes(nextStatus as never)) {
            setFollowUp(true);
          }
        }}
        className={selectClassName}
      >
        <option value="">Select status</option>
        {Object.values(STUDENT_STATUS).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <label className="flex h-8 items-center gap-2 text-sm">
        <input
          name="followUp"
          type="checkbox"
          checked={followUp}
          onChange={(event) => {
            if (canSkipFollowUp) {
              setFollowUp(event.target.checked);
            }
          }}
          className="size-4 rounded border-input"
        />
        <span className="font-medium">Follow up required</span>
      </label>
      <Input name="followUpDate" type="date" required={followUp} />
      <div className="md:col-span-2 xl:col-span-4">
        <textarea
          name="remarks"
          placeholder="Remarks"
          required
          className={textareaClassName}
        />
      </div>
      <div className="md:col-span-2 xl:col-span-4">
        <SubmitButton />
      </div>
    </form>
  );
}
