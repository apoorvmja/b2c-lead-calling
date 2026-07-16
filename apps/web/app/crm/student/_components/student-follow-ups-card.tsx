import type { StudentFollowUp } from "@repo/db";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { createStudentFollowUp } from "../actions";
import { StudentFollowUpForm } from "./student-follow-up-form";
import { StudentFollowUpsTable } from "./student-follow-ups-table";

export function StudentFollowUpsCard({
  studentId,
  followUps,
}: {
  studentId: string;
  followUps: StudentFollowUp[];
}) {
  const action = createStudentFollowUp.bind(null, studentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow Ups</CardTitle>
        <CardDescription>Track follow-up history for this student</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <StudentFollowUpForm action={action} />
        <StudentFollowUpsTable followUps={followUps} />
      </CardContent>
    </Card>
  );
}
