import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { StudentForm } from "../../../student/_components/student-form";
import { convertLeadToStudent } from "../../../student/actions";
import { nextEnrollmentNumber } from "../../../student/enrollment-number";

export default async function ConvertLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { assignedToUser: true },
  });

  if (!lead) {
    notFound();
  }

  const enrollmentNumber = await nextEnrollmentNumber();
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
        lead={lead}
        enrollmentNumber={enrollmentNumber}
        submitLabel="Convert to Student"
      />
    </>
  );
}
