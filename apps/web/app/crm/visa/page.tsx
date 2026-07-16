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

export default async function VisaPage() {
  const visas = await prisma.studentVisa.findMany({
    include: { student: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Visas</h2>
          <p className="text-sm text-muted-foreground">
            Student visa records and status tracking
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/visa/new" />}
        >
          New Visa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Total visas</CardDescription>
          <CardTitle className="text-3xl">{visas.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visa Records</CardTitle>
          <CardDescription>Recently created student visas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visa No</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Visa Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visa Done</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No visas added yet.
                  </TableCell>
                </TableRow>
              ) : (
                visas.map((visa) => (
                  <TableRow key={visa.id}>
                    <TableCell className="font-medium">
                      {visa.visaNumber ?? "-"}
                    </TableCell>
                    <TableCell>
                      {[
                        visa.student.firstName,
                        visa.student.middleName,
                        visa.student.surname,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </TableCell>
                    <TableCell>{visa.student.phone}</TableCell>
                    <TableCell>{visa.country ?? "-"}</TableCell>
                    <TableCell>{visa.visaType}</TableCell>
                    <TableCell>{visa.status}</TableCell>
                    <TableCell>{visa.visaDone ? "Done" : "Pending"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        render={<Link href={`/crm/visa/${visa.id}/edit`} />}
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
