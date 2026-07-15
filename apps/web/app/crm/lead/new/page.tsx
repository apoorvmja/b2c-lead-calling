import Link from "next/link";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";

import { LeadForm } from "../_components/lead-form";
import { createLead } from "../actions";

export default async function NewLeadPage() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    orderBy: { fullName: "asc" },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">New Lead</h2>
          <p className="text-sm text-muted-foreground">
            Add a lead inquiry to the CRM pipeline
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

      <LeadForm action={createLead} users={users} submitLabel="Create Lead" />
    </>
  );
}
