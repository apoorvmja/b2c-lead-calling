import { ExternalLink } from "lucide-react";

import type { CallRecord, LeadHistory } from "@repo/db";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "../../_components/status-badge";

type LeadHistoryWithCallRecord = LeadHistory & {
  callRecord?: CallRecord | null;
};

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

export function LeadHistoryTable({
  history,
}: {
  history: LeadHistoryWithCallRecord[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Follow Up</TableHead>
          <TableHead>Follow Up Date</TableHead>
          <TableHead>Remarks</TableHead>
          <TableHead>Recording</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {history.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="h-24 text-center text-muted-foreground"
            >
              No lead history added yet.
            </TableCell>
          </TableRow>
        ) : (
          history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <StatusBadge status={entry.status} />
              </TableCell>
              <TableCell>{entry.activity}</TableCell>
              <TableCell>{entry.followUp ? "Yes" : "No"}</TableCell>
              <TableCell>{formatDate(entry.followUpDate)}</TableCell>
              <TableCell className="max-w-sm whitespace-normal">
                {entry.remarks || "-"}
              </TableCell>
              <TableCell>
                {entry.callRecord?.recordingUrl ? (
                  <Button
                    nativeButton={false}
                    variant="outline"
                    size="sm"
                    render={
                      <a
                        href={entry.callRecord.recordingUrl}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                  >
                    <ExternalLink />
                    Open
                  </Button>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>{formatDate(entry.createdAt)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
