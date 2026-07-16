import type { StudentVisaUpdate } from "@repo/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createVisaUpdate } from "../actions";
import { VisaUpdateForm } from "./visa-update-form";
import { VisaUpdatesTable } from "./visa-updates-table";

export function VisaUpdatesCard({
  visaId,
  updates,
}: {
  visaId: string;
  updates: StudentVisaUpdate[];
}) {
  const action = createVisaUpdate.bind(null, visaId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visa Updates</CardTitle>
        <CardDescription>Track status changes for this visa</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <VisaUpdateForm action={action} />
        <VisaUpdatesTable updates={updates} />
      </CardContent>
    </Card>
  );
}
