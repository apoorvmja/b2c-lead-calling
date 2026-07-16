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

export default async function ApplicationPage() {
  const applications = await prisma.studentApplication.findMany({
    include: { student: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Applications</h2>
          <p className="text-sm text-muted-foreground">
            Student application records and admission status
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/application/new" />}
        >
          New Application
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Total applications</CardDescription>
          <CardTitle className="text-3xl">{applications.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Records</CardTitle>
          <CardDescription>
            Recently created student applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application No</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>College</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admission</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No applications added yet.
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.applicationNo ?? "-"}
                    </TableCell>
                    <TableCell>
                      {[
                        application.student.firstName,
                        application.student.middleName,
                        application.student.surname,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </TableCell>
                    <TableCell>{application.preferredCountry ?? "-"}</TableCell>
                    <TableCell>{application.college ?? "-"}</TableCell>
                    <TableCell>{application.course ?? "-"}</TableCell>
                    <TableCell>{application.applicationStatus}</TableCell>
                    <TableCell>
                      {application.admissionDone ? "Done" : "Pending"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        render={
                          <Link
                            href={`/crm/application/${application.id}/edit`}
                          />
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
