import Link from "next/link";

import { prisma } from "@repo/db";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function StudentPage() {
  const students = await prisma.student.findMany({
    include: { lead: { include: { assignedToUser: true } } },
    orderBy: { createdAt: "desc" },
  });

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
                    <TableCell>{student.lead.country}</TableCell>
                    <TableCell>{student.lead.source}</TableCell>
                    <TableCell>{student.status}</TableCell>
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
