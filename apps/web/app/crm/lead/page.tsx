import { prisma } from "@repo/db";

import { getCrmRecordScope } from "@/lib/crm-record-scope";

import { LeadRecordsPage } from "./_components/lead-records-page";

export const dynamic = "force-dynamic";

const pageSize = 50;

export default async function LeadPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(Number((await searchParams).page) || 1, 1);
  const { leadWhere } = await getCrmRecordScope();
  const [totalLeads, leads] = await Promise.all([
    prisma.lead.count({ where: leadWhere }),
    prisma.lead.findMany({
      where: leadWhere,
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
    <LeadRecordsPage
      title="Leads"
      description="Lead inquiry and pipeline records"
      countLabel="Total leads"
      tableTitle="Lead Records"
      tableDescription="Recently created leads and inquiries"
      emptyMessage="No leads added yet."
      leads={leads}
      totalCount={totalLeads}
      page={page}
      pageSize={pageSize}
      basePath="/crm/lead"
    />
  );
}
