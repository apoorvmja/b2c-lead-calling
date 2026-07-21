import Link from "next/link";

import { prisma } from "@repo/db";
import type { Lead, LeadHistory, User } from "@repo/db";

import { getCrmRecordScope } from "@/lib/crm-record-scope";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createLeadHistory } from "../actions";
import { StatusBadge } from "../../_components/status-badge";
import { LeadHistoryForm } from "../_components/lead-history-form";
import { LeadHistoryTable } from "../_components/lead-history-table";

type LeadWithHistory = Lead & {
  assignedToUser: User | null;
  history: LeadHistory[];
};

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

export default async function LeadFollowUpPage() {
  const { leadWhere } = await getCrmRecordScope();
  const startOfTomorrow = new Date();
  startOfTomorrow.setHours(0, 0, 0, 0);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const leads = (await prisma.lead.findMany({
    where: leadWhere,
    include: {
      assignedToUser: true,
      history: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  })) as LeadWithHistory[];

  const followUpLeads = leads.filter((lead) => {
    const latest = lead.history[0];

    return (
      latest?.followUp === true &&
      latest.followUpDate !== null &&
      latest.followUpDate < startOfTomorrow
    );
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Lead Follow Ups</h2>
          <p className="text-sm text-muted-foreground">
            Leads with active follow ups due today or overdue
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/lead" />}
        >
          Lead Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Due follow ups</CardDescription>
          <CardTitle className="text-3xl">{followUpLeads.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follow Up Records</CardTitle>
          <CardDescription>
            Latest active lead follow ups due today or earlier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Follow Up Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUpLeads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No lead follow ups due.
                  </TableCell>
                </TableRow>
              ) : (
                followUpLeads.map((lead) => {
                  const latest = lead.history[0];

                  if (!latest) {
                    return null;
                  }

                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>{lead.country ?? "-"}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger
                            render={<Button variant="ghost" size="sm" className="p-0" />}
                          >
                            <StatusBadge status={latest.status} />
                          </DialogTrigger>
                          <DialogContent className="max-h-[calc(100vh-2rem)] overflow-auto sm:max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{lead.name}</DialogTitle>
                              <DialogDescription>
                                Current status: <StatusBadge status={lead.status} />
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6">
                              <LeadHistoryForm
                                action={createLeadHistory.bind(null, lead.id)}
                              />
                              <LeadHistoryTable history={lead.history} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>{latest.activity}</TableCell>
                      <TableCell>{formatDate(latest.followUpDate)}</TableCell>
                      <TableCell>
                        {lead.assignedToUser?.fullName ?? "Unassigned"}
                      </TableCell>
                      <TableCell className="max-w-sm whitespace-normal">
                        {latest.remarks || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
