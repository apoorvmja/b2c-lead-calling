import { APPLICATION_STATUS } from "@repo/shared";

import { Button } from "@/components/ui/button";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const textareaClassName =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function ApplicationUpdateForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <select name="status" required className={selectClassName}>
        <option value="">Select status</option>
        {Object.values(APPLICATION_STATUS).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <div className="md:col-span-2">
        <textarea
          name="remarks"
          placeholder="Remarks"
          className={textareaClassName}
        />
      </div>
      <div className="md:col-span-2">
        <Button type="submit">Add Update</Button>
      </div>
    </form>
  );
}
