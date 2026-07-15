import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { StudentForm } from "../../_components/student-form";
import { updateStudent } from "../../actions";

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });

  if (!student) {
    notFound();
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [{ isActive: true }, { id: student.assignedToUserId ?? "" }],
    },
    orderBy: { fullName: "asc" },
  });
  const action = updateStudent.bind(null, student.id);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Edit Student</h2>
          <p className="text-sm text-muted-foreground">
            Update student inquiry or enrollment details
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/student" />}
        >
          Back
        </Button>
      </div>

      <StudentForm
        action={action}
        users={users}
        student={student}
        submitLabel="Update Student"
      />
    </>
  );
}
