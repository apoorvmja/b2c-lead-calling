import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { LeadForm } from "../../_components/lead-form";
import { LeadHistoryCard } from "../../_components/lead-history-card";
import { updateLead } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      convertedStudent: true,
      history: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) {
    notFound();
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [{ isActive: true }, { id: lead.assignedToUserId ?? "" }],
    },
    orderBy: { fullName: "asc" },
  });
  const action = updateLead.bind(null, lead.id);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Edit Lead</h2>
          <p className="text-sm text-muted-foreground">
            Update lead inquiry and pipeline details
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/lead" />}
        >
          Back
        </Button>
      </div>

      <LeadForm
        action={action}
        users={users}
        lead={lead}
        submitLabel="Update Lead"
      />

      <div className="flex justify-end">
        {lead.isConverted && lead.convertedStudent ? (
          <Button
            nativeButton={false}
            variant="outline"
            render={
              <Link href={`/crm/student/${lead.convertedStudent.id}/edit`} />
            }
          >
            View Student
          </Button>
        ) : (
          <Button
            nativeButton={false}
            variant="outline"
            render={<Link href={`/crm/lead/${lead.id}/convert`} />}
          >
            Convert to Student
          </Button>
        )}
      </div>

      <LeadHistoryCard leadId={lead.id} history={lead.history} />
    </>
  );
}
