import type { LeadHistory } from "@repo/db";
import { LEAD_ACTIVITIES, LEAD_STATUS } from "@repo/shared";

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

import { createLeadHistory } from "../actions";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const textareaClassName =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

export function LeadHistoryCard({
  leadId,
  history,
}: {
  leadId: string;
  history: LeadHistory[];
}) {
  const action = createLeadHistory.bind(null, leadId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead History</CardTitle>
        <CardDescription>Track status changes and activity for this lead</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <form action={action} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <select name="status" required className={selectClassName}>
            <option value="">Select status</option>
            {Object.values(LEAD_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select name="activity" required className={selectClassName}>
            <option value="">Select activity</option>
            {Object.values(LEAD_ACTIVITIES).map((activity) => (
              <option key={activity} value={activity}>
                {activity}
              </option>
            ))}
          </select>
          <div className="md:col-span-2 xl:col-span-4">
            <textarea
              name="remarks"
              placeholder="Remarks"
              className={textareaClassName}
            />
          </div>
          <div className="md:col-span-2 xl:col-span-4">
            <Button type="submit">Add History</Button>
          </div>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No lead history added yet.
                </TableCell>
              </TableRow>
            ) : (
              history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.status}</TableCell>
                  <TableCell>{entry.activity}</TableCell>
                  <TableCell className="max-w-sm whitespace-normal">
                    {entry.remarks || "-"}
                  </TableCell>
                  <TableCell>{formatDate(entry.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
