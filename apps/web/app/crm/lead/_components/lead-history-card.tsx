import type { LeadHistory } from "@repo/db";

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
import { LeadHistoryForm } from "./lead-history-form";

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
        <LeadHistoryForm action={action} />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Follow Up</TableHead>
              <TableHead>Follow Up Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
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
                  <TableCell>{entry.followUp ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(entry.followUpDate)}</TableCell>
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
