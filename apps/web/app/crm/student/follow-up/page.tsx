import Link from "next/link";

import { prisma } from "@repo/db";
import type { Lead, Student, StudentFollowUp, User } from "@repo/db";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createStudentFollowUp } from "../actions";
import { StatusBadge } from "../../_components/status-badge";
import { StudentFollowUpForm } from "../_components/student-follow-up-form";
import { StudentFollowUpsTable } from "../_components/student-follow-ups-table";

type StudentWithFollowUps = Student & {
  lead: Lead & { assignedToUser: User | null };
  followUps: StudentFollowUp[];
};

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

function studentName(student: Student) {
  return [student.firstName, student.middleName, student.surname]
    .filter(Boolean)
    .join(" ");
}

export default async function StudentFollowUpPage() {
  const startOfTomorrow = new Date();
  startOfTomorrow.setHours(0, 0, 0, 0);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const students = (await prisma.student.findMany({
    include: {
      lead: { include: { assignedToUser: true } },
      followUps: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  } as never)) as StudentWithFollowUps[];

  const followUpStudents = students.filter((student) => {
    const latest = student.followUps[0];

    return (
      latest?.followUp === true &&
      latest.followUpDate !== null &&
      latest.followUpDate < startOfTomorrow
    );
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Student Follow Ups</h2>
          <p className="text-sm text-muted-foreground">
            Students with active follow ups due today or overdue
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/student" />}
        >
          Student Details
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Due follow ups</CardDescription>
          <CardTitle className="text-3xl">{followUpStudents.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Follow Up Records</CardTitle>
          <CardDescription>
            Latest active student follow ups due today or earlier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Follow Up Date</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUpStudents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No student follow ups due.
                  </TableCell>
                </TableRow>
              ) : (
                followUpStudents.map((student) => {
                  const latest = student.followUps[0];

                  if (!latest) {
                    return null;
                  }

                  const name = studentName(student);

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.enrollmentNumber}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{student.lead.phone}</TableCell>
                      <TableCell>{student.lead.country ?? "-"}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger
                            render={<Button variant="ghost" size="sm" className="p-0" />}
                          >
                            <StatusBadge status={latest.status} />
                          </DialogTrigger>
                          <DialogContent className="max-h-[calc(100vh-2rem)] overflow-auto sm:max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{name}</DialogTitle>
                              <DialogDescription>
                                Current status: <StatusBadge status={student.status} />
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6">
                              <StudentFollowUpForm
                                action={createStudentFollowUp.bind(
                                  null,
                                  student.id,
                                )}
                              />
                              <StudentFollowUpsTable
                                followUps={student.followUps}
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>{formatDate(latest.followUpDate)}</TableCell>
                      <TableCell>
                        {student.lead.assignedToUser?.fullName ?? "Unassigned"}
                      </TableCell>
                      <TableCell className="max-w-sm whitespace-normal">
                        {latest.remarks || "-"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
