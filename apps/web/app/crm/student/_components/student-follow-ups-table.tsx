import type { StudentFollowUp } from "@repo/db";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "../../_components/status-badge";

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

export function StudentFollowUpsTable({
  followUps,
}: {
  followUps: StudentFollowUp[];
}) {
  return (
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
              <TableCell>
                <StatusBadge status={followUp.status} />
              </TableCell>
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
  );
}
