import { prisma } from "@repo/db";

import { getCrmRecordScope } from "@/lib/crm-record-scope";

import { LeadRecordsPage } from "./_components/lead-records-page";

export const dynamic = "force-dynamic";

export default async function LeadPage() {
  const { leadWhere } = await getCrmRecordScope();
  const leads = await prisma.lead.findMany({
    where: leadWhere,
    include: {
      assignedToUser: true,
      history: {
        include: { callRecord: true },
        orderBy: { createdAt: "desc" },
      },
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
