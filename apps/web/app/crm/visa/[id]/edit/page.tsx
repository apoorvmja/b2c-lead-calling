import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { VisaForm } from "../../_components/visa-form";
import { VisaUpdatesCard } from "../../_components/visa-updates-card";
import { updateVisa } from "../../actions";

export default async function EditVisaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const visa = await prisma.studentVisa.findUnique({
    where: { id },
    include: {
      updates: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!visa) {
    notFound();
  }

  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });
  const action = updateVisa.bind(null, visa.id);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Edit Visa</h2>
          <p className="text-sm text-muted-foreground">
            Update visa details and status history
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
        action={action}
        students={students}
        visa={visa}
        submitLabel="Update Visa"
      />

      <VisaUpdatesCard visaId={visa.id} updates={visa.updates} />
    </>
  );
}
