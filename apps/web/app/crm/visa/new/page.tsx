import Link from "next/link";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { createVisa } from "../actions";
import { VisaForm } from "../_components/visa-form";

export default async function NewVisaPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">New Visa</h2>
          <p className="text-sm text-muted-foreground">
            Create a student visa record
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/visa" />}
        >
          Back
        </Button>
      </div>

      <VisaForm
        action={createVisa}
        students={students}
        submitLabel="Create Visa"
      />
    </>
  );
}
