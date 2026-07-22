import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { allocateUnallocatedLeads } from "../actions";
import { LeadRecordsPage } from "../_components/lead-records-page";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export const dynamic = "force-dynamic";

export default async function UnallocatedLeadsPage() {
  const [leads, users] = await Promise.all([
    prisma.lead.findMany({
      where: { assignedToUserId: null },
      include: {
        assignedToUser: true,
        history: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  return (
    <>
      {leads.length > 0 && users.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Allocate Leads</CardTitle>
            <CardDescription>
              Assign up to 50 newest unallocated leads to one user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={allocateUnallocatedLeads}
              className="grid gap-4 md:grid-cols-[1fr_auto]"
            >
              <select
                name="assignedToUserId"
                required
                className={selectClassName}
              >
                <option value="">Select assigned user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName} - {user.role}
                  </option>
                ))}
              </select>
              <Button type="submit">Allocate 50 Leads</Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <LeadRecordsPage
        title="Unallocated Leads"
        description="Leads not assigned to a CRM user"
        countLabel="Total unallocated leads"
        tableTitle="Unallocated Lead Records"
        tableDescription="Recently created leads without assignment"
        emptyMessage="No unallocated leads."
        leads={leads}
      />
    </>
  );
}
