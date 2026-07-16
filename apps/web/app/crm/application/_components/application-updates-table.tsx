import type { ApplicationUpdate } from "@repo/db";

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

export function ApplicationUpdatesTable({
  updates,
}: {
  updates: ApplicationUpdate[];
}) {
  return (
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
              <TableCell>
                <StatusBadge status={update.status} />
              </TableCell>
              <TableCell className="max-w-sm whitespace-normal">
                {update.remarks || "-"}
              </TableCell>
              <TableCell>{formatDate(update.createdAt)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
