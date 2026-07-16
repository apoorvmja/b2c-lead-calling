import Link from "next/link";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { ApplicationForm } from "../_components/application-form";
import { createApplication } from "../actions";

export default async function NewApplicationPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">New Application</h2>
          <p className="text-sm text-muted-foreground">
            Create a student application record
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/application" />}
        >
          Back
        </Button>
      </div>

      <ApplicationForm action={createApplication} students={students} />
    </>
  );
}
