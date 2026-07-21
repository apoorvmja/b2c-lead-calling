import Link from "next/link";

import { prisma } from "@repo/db";
import type { Lead, Student, StudentFollowUp, User } from "@repo/db";

import { getCrmRecordScope } from "@/lib/crm-record-scope";
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

import { createStudentFollowUp } from "./actions";
import { StatusBadge } from "../_components/status-badge";
import { StudentFollowUpForm } from "./_components/student-follow-up-form";
import { StudentFollowUpsTable } from "./_components/student-follow-ups-table";

type StudentWithDetails = Student & {
  lead: Lead & { assignedToUser: User | null };
  followUps: StudentFollowUp[];
};

export default async function StudentPage() {
  const { studentWhere } = await getCrmRecordScope();
  const students = (await prisma.student.findMany({
    where: studentWhere,
    include: {
      lead: { include: { assignedToUser: true } },
      followUps: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  } as never)) as StudentWithDetails[];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Students</h2>
          <p className="text-sm text-muted-foreground">
            Converted student enrollment records
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Total students</CardDescription>
          <CardTitle className="text-3xl">{students.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
          <CardDescription>Recently converted students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enrollment No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No converted students yet.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.enrollmentNumber}
                    </TableCell>
                    <TableCell>
                      {[student.firstName, student.middleName, student.surname]
                        .filter(Boolean)
                        .join(" ")}
                    </TableCell>
                    <TableCell>{student.lead.phone}</TableCell>
                    <TableCell>{student.lead.country ?? "-"}</TableCell>
                    <TableCell>{student.lead.source}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger
                          render={<Button variant="ghost" size="sm" className="p-0" />}
                        >
                          <StatusBadge status={student.status} />
                        </DialogTrigger>
                        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-auto sm:max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              {[
                                student.firstName,
                                student.middleName,
                                student.surname,
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </DialogTitle>
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
                    <TableCell>
                      {student.lead.assignedToUser?.fullName ?? "Unassigned"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        render={
                          <Link href={`/crm/student/${student.id}/edit`} />
                        }
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
