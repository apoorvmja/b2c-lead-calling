import type { ApplicationUpdate } from "@repo/db";
import { APPLICATION_STATUS } from "@repo/shared";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createApplicationUpdate } from "../actions";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const textareaClassName =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

export function ApplicationUpdatesCard({
  applicationId,
  updates,
}: {
  applicationId: string;
  updates: ApplicationUpdate[];
}) {
  const action = createApplicationUpdate.bind(null, applicationId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Updates</CardTitle>
        <CardDescription>
          Track status changes for this application
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updates.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  No application updates added yet.
                </TableCell>
              </TableRow>
            ) : (
              updates.map((update) => (
                <TableRow key={update.id}>
                  <TableCell className="font-medium">{update.status}</TableCell>
                  <TableCell className="max-w-sm whitespace-normal">
                    {update.remarks || "-"}
                  </TableCell>
                  <TableCell>{formatDate(update.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
