import { prisma } from "@repo/db";

import { LeadRecordsPage } from "./_components/lead-records-page";

export default async function LeadPage() {
  const leads = await prisma.lead.findMany({
    include: {
      assignedToUser: true,
      history: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <LeadRecordsPage
      title="Leads"
      description="Lead inquiry and pipeline records"
      countLabel="Total leads"
      tableTitle="Lead Records"
      tableDescription="Recently created leads and inquiries"
      emptyMessage="No leads added yet."
      leads={leads}
    />
  );
}
