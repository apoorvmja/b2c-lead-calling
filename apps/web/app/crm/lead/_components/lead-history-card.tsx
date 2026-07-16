import type { LeadHistory } from "@repo/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createLeadHistory } from "../actions";
import { LeadHistoryForm } from "./lead-history-form";
import { LeadHistoryTable } from "./lead-history-table";

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
        <LeadHistoryTable history={history} />
      </CardContent>
    </Card>
  );
}
