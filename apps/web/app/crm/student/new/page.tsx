import Link from "next/link";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { StudentForm } from "../_components/student-form";
import { createStudent } from "../actions";

export default async function NewStudentPage() {
  const users = await prisma.user.findMany({ where: { isActive: true }, orderBy: { fullName: "asc" } });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">New Student</h2>
          <p className="text-sm text-muted-foreground">
            Add a student inquiry or enrollment record
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
        action={createStudent}
        users={users}
        submitLabel="Create Student"
      />
    </>
  );
}
