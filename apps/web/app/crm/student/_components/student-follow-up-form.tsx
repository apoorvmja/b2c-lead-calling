import { STUDENT_STATUS } from "@repo/shared";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const textareaClassName =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function StudentFollowUpForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <select name="status" required className={selectClassName}>
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
          className="size-4 rounded border-input"
        />
        <span className="font-medium">Follow up required</span>
      </label>
      <Input name="followUpDate" type="date" />
      <div className="md:col-span-2 xl:col-span-4">
        <textarea
          name="remarks"
          placeholder="Remarks"
          className={textareaClassName}
        />
      </div>
      <div className="md:col-span-2 xl:col-span-4">
        <Button type="submit">Add Follow Up</Button>
      </div>
    </form>
  );
}
