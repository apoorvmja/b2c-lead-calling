import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { StudentForm } from "../../../student/_components/student-form";
import { convertLeadToStudent } from "../../../student/actions";

export default async function ConvertLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id } });

  if (!lead) {
    notFound();
  }

  const users = await prisma.user.findMany({
    where: lead.assignedToUserId
      ? { OR: [{ isActive: true }, { id: lead.assignedToUserId }] }
      : { isActive: true },
    orderBy: { fullName: "asc" },
  });
  const action = convertLeadToStudent.bind(null, lead.id);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Convert Lead</h2>
          <p className="text-sm text-muted-foreground">
            Create a student enrollment record from this lead
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href={`/crm/lead/${lead.id}/edit`} />}
        >
          Back
        </Button>
      </div>

      <StudentForm
        action={action}
        users={users}
        lead={lead}
        submitLabel="Convert to Student"
      />
    </>
  );
}
