import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { unallocateAssignedLeads } from "../actions";
import { LeadRecordsPage } from "../_components/lead-records-page";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const pageSize = 50;

export const dynamic = "force-dynamic";

export default async function AllocatedLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ assignedToUserId?: string; page?: string }>;
}) {
  const { assignedToUserId = "", page: pageParam } = await searchParams;
  const page = Math.max(Number(pageParam) || 1, 1);
  const users = await prisma.user.findMany({
    where: { isActive: true },
    orderBy: { fullName: "asc" },
  });
  const selectedUser = users.find((user) => user.id === assignedToUserId);
  const where = selectedUser ? { assignedToUserId } : { id: "" };
  const [totalLeads, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      include: {
        assignedToUser: true,
        history: {
          include: { callRecord: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Allocated Leads</CardTitle>
          <CardDescription>
            Select a user to view and unallocate assigned leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/crm/lead/allocated"
            className="grid gap-4 md:grid-cols-[1fr_auto]"
          >
            <select
              name="assignedToUserId"
              required
              defaultValue={assignedToUserId}
              className={selectClassName}
            >
              <option value="">Select assigned user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} - {user.role}
                </option>
              ))}
            </select>
            <Button type="submit">View Leads</Button>
          </form>
        </CardContent>
      </Card>

      {selectedUser && totalLeads > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Unallocate Leads</CardTitle>
            <CardDescription>
              Unassign up to 50 newest leads from {selectedUser.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={unallocateAssignedLeads}>
              <input
                type="hidden"
                name="assignedToUserId"
                value={assignedToUserId}
              />
              <Button type="submit">Unallocate 50 Leads</Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <LeadRecordsPage
        title="Allocated Leads"
        description={
          selectedUser
            ? `Leads assigned to ${selectedUser.fullName}`
            : "Select a user to view allocated leads"
        }
        countLabel="Total allocated leads"
        tableTitle="Allocated Lead Records"
        tableDescription="Recently created leads assigned to the selected user"
        emptyMessage={
          selectedUser
            ? "No leads allocated to this user."
            : "Select a user to view allocated leads."
        }
        leads={leads}
        totalCount={totalLeads}
        page={page}
        pageSize={pageSize}
        basePath="/crm/lead/allocated"
        paginationQuery={
          selectedUser ? `assignedToUserId=${assignedToUserId}` : undefined
        }
      />
    </>
  );
}
