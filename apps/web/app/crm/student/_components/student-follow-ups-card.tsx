import type { StudentFollowUp } from "@repo/db";
import { STUDENT_STATUS } from "@repo/shared";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createStudentFollowUp } from "../actions";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const textareaClassName =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

export function StudentFollowUpsCard({
  studentId,
  followUps,
}: {
  studentId: string;
  followUps: StudentFollowUp[];
}) {
  const action = createStudentFollowUp.bind(null, studentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow Ups</CardTitle>
        <CardDescription>Track follow-up history for this student</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Follow Up</TableHead>
              <TableHead>Follow Up Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {followUps.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No follow ups added yet.
                </TableCell>
              </TableRow>
            ) : (
              followUps.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell className="font-medium">{followUp.status}</TableCell>
                  <TableCell>{followUp.followUp ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(followUp.followUpDate)}</TableCell>
                  <TableCell className="max-w-sm whitespace-normal">
                    {followUp.remarks || "-"}
                  </TableCell>
                  <TableCell>{formatDate(followUp.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
