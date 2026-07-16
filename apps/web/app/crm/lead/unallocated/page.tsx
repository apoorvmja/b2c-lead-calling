import { prisma } from "@repo/db";

import { LeadRecordsPage } from "../_components/lead-records-page";

export default async function UnallocatedLeadsPage() {
  const leads = await prisma.lead.findMany({
    where: { assignedToUserId: null },
    include: {
      assignedToUser: true,
      history: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <LeadRecordsPage
      title="Unallocated Leads"
      description="Leads not assigned to a CRM user"
      countLabel="Total unallocated leads"
      tableTitle="Unallocated Lead Records"
      tableDescription="Recently created leads without assignment"
      emptyMessage="No unallocated leads."
      leads={leads}
    />
  );
}
