import Link from "next/link";

import { prisma } from "@repo/db";
import type { Lead, LeadHistory, Student, StudentFollowUp, User } from "@repo/db";

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

type LeadWithHistory = Lead & {
  assignedToUser: User | null;
  history: LeadHistory[];
};

type StudentWithFollowUps = Student & {
  lead: Lead & { assignedToUser: User | null };
  followUps: StudentFollowUp[];
};

type LeadActivity = LeadHistory & {
  lead: Pick<Lead, "name" | "phone">;
};

type StudentActivity = StudentFollowUp & {
  student: Pick<Student, "firstName" | "middleName" | "surname">;
};

function formatDate(date?: Date | null) {
  return date ? date.toLocaleDateString("en-IN") : "-";
}

function studentName(student: Pick<Student, "firstName" | "middleName" | "surname">) {
  return [student.firstName, student.middleName, student.surname]
    .filter(Boolean)
    .join(" ");
}

export default async function CrmPage() {
  const startOfTomorrow = new Date();
  startOfTomorrow.setHours(0, 0, 0, 0);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const [
    totalLeads,
    totalStudents,
    applicationsInProgress,
    visasInProgress,
    leads,
    students,
    recentLeadHistory,
    recentStudentFollowUps,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.student.count(),
    prisma.studentApplication.count({ where: { admissionDone: false } }),
    prisma.studentVisa.count({ where: { visaDone: false } }),
    prisma.lead.findMany({
      include: {
        assignedToUser: true,
        history: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.student.findMany({
      include: {
        lead: { include: { assignedToUser: true } },
        followUps: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    } as never),
    prisma.leadHistory.findMany({
      include: { lead: { select: { name: true, phone: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.studentFollowUp.findMany({
      include: {
        student: {
          select: { firstName: true, middleName: true, surname: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    } as never),
  ]);

  const leadFollowUps = (leads as LeadWithHistory[]).filter((lead) => {
    const latest = lead.history[0];

    return (
      latest?.followUp === true &&
      latest.followUpDate !== null &&
      latest.followUpDate < startOfTomorrow
    );
  });

  const studentFollowUps = (students as StudentWithFollowUps[]).filter(
    (student) => {
      const latest = student.followUps[0];

      return (
        latest?.followUp === true &&
        latest.followUpDate !== null &&
        latest.followUpDate < startOfTomorrow
      );
    },
  );

  const stats = [
    { label: "Total Leads", value: totalLeads, note: "All lead records" },
    {
      label: "Lead Follow Ups",
      value: leadFollowUps.length,
      note: "Due today or overdue",
    },
    { label: "Total Students", value: totalStudents, note: "Converted records" },
    {
      label: "Student Follow Ups",
      value: studentFollowUps.length,
      note: "Due today or overdue",
    },
    {
      label: "Applications",
      value: applicationsInProgress,
      note: "Pending admission",
    },
    { label: "Visas", value: visasInProgress, note: "Pending visa completion" },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Daily CRM work, follow ups and recent activity
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {stat.note}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Lead Follow Ups</CardTitle>
              <CardDescription>Due today or overdue</CardDescription>
            </div>
            <Button
              nativeButton={false}
              variant="outline"
              size="sm"
              render={<Link href="/crm/lead/follow-up" />}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow Up Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadFollowUps.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No lead follow ups due.
                    </TableCell>
                  </TableRow>
                ) : (
                  leadFollowUps.slice(0, 5).map((lead) => {
                    const latest = lead.history[0];

                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>{latest?.status ?? lead.status}</TableCell>
                        <TableCell>{formatDate(latest?.followUpDate)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Student Follow Ups</CardTitle>
              <CardDescription>Due today or overdue</CardDescription>
            </div>
            <Button
              nativeButton={false}
              variant="outline"
              size="sm"
              render={<Link href="/crm/student/follow-up" />}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Follow Up Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentFollowUps.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No student follow ups due.
                    </TableCell>
                  </TableRow>
                ) : (
                  studentFollowUps.slice(0, 5).map((student) => {
                    const latest = student.followUps[0];

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {studentName(student)}
                        </TableCell>
                        <TableCell>{student.lead.phone}</TableCell>
                        <TableCell>{latest?.status ?? student.status}</TableCell>
                        <TableCell>{formatDate(latest?.followUpDate)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest lead and student follow-up entries</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ...(recentLeadHistory as LeadActivity[]).map((entry) => ({
                  id: entry.id,
                  type: "Lead",
                  name: entry.lead.name,
                  status: entry.status,
                  remarks: entry.remarks,
                  createdAt: entry.createdAt,
                })),
                ...(recentStudentFollowUps as StudentActivity[]).map((entry) => ({
                  id: entry.id,
                  type: "Student",
                  name: studentName(entry.student),
                  status: entry.status,
                  remarks: entry.remarks,
                  createdAt: entry.createdAt,
                })),
              ]
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(0, 8)
                .map((entry) => (
                  <TableRow key={`${entry.type}-${entry.id}`}>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell className="font-medium">{entry.name}</TableCell>
                    <TableCell>{entry.status}</TableCell>
                    <TableCell className="max-w-sm whitespace-normal">
                      {entry.remarks || "-"}
                    </TableCell>
                    <TableCell>{formatDate(entry.createdAt)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
