import Link from "next/link";

import type { Lead, LeadHistory, User } from "@repo/db";

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
import { LeadHistoryForm } from "./lead-history-form";
import { LeadHistoryTable } from "./lead-history-table";

type LeadWithAssignedUser = Lead & {
  assignedToUser: User | null;
  history: LeadHistory[];
};

export function LeadRecordsPage({
  title,
  description,
  countLabel,
  tableTitle,
  tableDescription,
  emptyMessage,
  leads,
}: {
  title: string;
  description: string;
  countLabel: string;
  tableTitle: string;
  tableDescription: string;
  emptyMessage: string;
  leads: LeadWithAssignedUser[];
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/lead/new" />}
        >
          New Lead
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>{countLabel}</CardDescription>
          <CardTitle className="text-3xl">{leads.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{tableTitle}</CardTitle>
          <CardDescription>{tableDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interested Field</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.country}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger
                          render={
                            <Button variant="outline" size="sm" />
                          }
                        >
                          {lead.status}
                        </DialogTrigger>
                        <DialogContent className="dark max-h-[calc(100vh-2rem)] overflow-auto sm:max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>{lead.name}</DialogTitle>
                            <DialogDescription>
                              Current status: {lead.status}
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
                    <TableCell>{lead.interestedField || "-"}</TableCell>
                    <TableCell>
                      {lead.assignedToUser?.fullName ?? "Unassigned"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        render={<Link href={`/crm/lead/${lead.id}/edit`} />}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
