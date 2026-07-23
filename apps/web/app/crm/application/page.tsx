import Link from "next/link";

import { prisma } from "@repo/db";
import type {
  ApplicationUpdate,
  Student,
  StudentApplication,
} from "@repo/db";

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

import { createApplicationUpdate } from "./actions";
import { CrmPagination } from "../_components/crm-pagination";
import { StatusBadge } from "../_components/status-badge";
import { ApplicationUpdateForm } from "./_components/application-update-form";
import { ApplicationUpdatesTable } from "./_components/application-updates-table";

export const dynamic = "force-dynamic";

const pageSize = 50;

type ApplicationWithDetails = StudentApplication & {
  student: Student;
  updates: ApplicationUpdate[];
};

export default async function ApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(Number((await searchParams).page) || 1, 1);
  const { applicationWhere } = await getCrmRecordScope();
  const [totalApplications, pagedApplications] = await Promise.all([
    prisma.studentApplication.count({ where: applicationWhere }),
    prisma.studentApplication.findMany({
      where: applicationWhere,
      include: {
        student: true,
        updates: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    } as never),
  ]);
  const applications = pagedApplications as ApplicationWithDetails[];
  const totalPages = Math.ceil(totalApplications / pageSize);

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
          <CardTitle className="text-3xl">{totalApplications}</CardTitle>
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
                    <TableCell>
                      <Dialog>
                        <DialogTrigger
                          render={<Button variant="ghost" size="sm" className="p-0" />}
                        >
                          <StatusBadge status={application.applicationStatus} />
                        </DialogTrigger>
                        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-auto sm:max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              {application.applicationNo ?? "Application"}
                            </DialogTitle>
                            <DialogDescription>
                              Current status:{" "}
                              <StatusBadge status={application.applicationStatus} />
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-6">
                            <ApplicationUpdateForm
                              action={createApplicationUpdate.bind(
                                null,
                                application.id,
                              )}
                            />
                            <ApplicationUpdatesTable
                              updates={application.updates}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
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
          <CrmPagination
            basePath="/crm/application"
            page={page}
            totalPages={totalPages}
          />
        </CardContent>
      </Card>
    </>
  );
}
