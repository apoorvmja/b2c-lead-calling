import { prisma } from "@repo/db";

import { getCrmRecordScope } from "@/lib/crm-record-scope";

import { LeadRecordsPage } from "./_components/lead-records-page";

export default async function LeadPage() {
  const { leadWhere } = await getCrmRecordScope();
  const leads = await prisma.lead.findMany({
    where: leadWhere,
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
