import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { ApplicationForm } from "../../_components/application-form";
import { ApplicationUpdatesCard } from "../../_components/application-updates-card";
import { updateApplication } from "../../actions";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await prisma.studentApplication.findUnique({
    where: { id },
    include: {
      student: true,
      updates: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!application) {
    notFound();
  }

  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });
  const action = updateApplication.bind(null, application.id);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Edit Application</h2>
          <p className="text-sm text-muted-foreground">
            Update student application details and status history
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

      <ApplicationForm
        action={action}
        students={students}
        application={application}
        submitLabel="Update Application"
      />

      <ApplicationUpdatesCard
        applicationId={application.id}
        updates={application.updates}
      />
    </>
  );
}
