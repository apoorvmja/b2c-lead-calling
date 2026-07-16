import type { LeadHistory } from "@repo/db";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

export function LeadHistoryTable({ history }: { history: LeadHistory[] }) {
  return (
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
  );
}
