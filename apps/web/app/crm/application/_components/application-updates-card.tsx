import type { ApplicationUpdate } from "@repo/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createApplicationUpdate } from "../actions";
import { ApplicationUpdateForm } from "./application-update-form";
import { ApplicationUpdatesTable } from "./application-updates-table";

export function ApplicationUpdatesCard({
  applicationId,
  updates,
}: {
  applicationId: string;
  updates: ApplicationUpdate[];
}) {
  const action = createApplicationUpdate.bind(null, applicationId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Updates</CardTitle>
        <CardDescription>
          Track status changes for this application
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <ApplicationUpdateForm action={action} />
        <ApplicationUpdatesTable updates={updates} />
      </CardContent>
    </Card>
  );
}
