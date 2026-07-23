import Link from "next/link";

import type { Lead, Student, User } from "@repo/db";
import { INTAKES, STUDENT_STATUS } from "@repo/shared";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const textareaClassName =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function formatDate(date?: Date | null) {
  return date?.toISOString().slice(0, 10) ?? "";
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function SelectField({
  name,
  label,
  data,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  data: Record<string, string>;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <Field label={label}>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className={selectClassName}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {Object.entries(data).map(([key, value]) => (
          <option key={key} value={value}>
            {value}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function StudentForm({
  action,
  student,
  lead,
  enrollmentNumber,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  student?: Student;
  lead?: Lead & { assignedToUser?: User | null };
  enrollmentNumber?: string;
  submitLabel: string;
}) {
  const leadName = lead?.name.trim().split(/\s+/) ?? [];
  const leadFirstName = leadName[0] ?? "";
  const leadSurname = leadName.slice(1).join(" ");

  return (
    <form action={action} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Enrollment</CardTitle>
          <CardDescription>Core student and enrollment details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Enrollment Number">
            <Input
              name="enrollmentNumber"
              defaultValue={student?.enrollmentNumber ?? enrollmentNumber ?? ""}
              className="opacity-50"
              readOnly
              required
            />
          </Field>
          <Field label="Enrollment Date">
            <Input
              name="enrollmentDate"
              type="date"
              defaultValue={formatDate(student?.enrollmentDate)}
              required
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Student identity details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="First Name">
            <Input
              name="firstName"
              defaultValue={student?.firstName ?? leadFirstName}
              required
            />
          </Field>
          <Field label="Middle Name">
            <Input name="middleName" defaultValue={student?.middleName ?? ""} />
          </Field>
          <Field label="Surname">
            <Input
              name="surname"
              defaultValue={student?.surname ?? leadSurname}
              required
            />
          </Field>
          <Field label="Birth Date">
            <Input
              name="birthDate"
              type="date"
              defaultValue={formatDate(student?.birthDate)}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Details</CardTitle>
          <CardDescription>
            Contact and inquiry details from the linked lead
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="font-medium">Phone</p>
            <p className="text-muted-foreground">{lead?.phone ?? "-"}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{lead?.email ?? "-"}</p>
          </div>
          <div>
            <p className="font-medium">Assigned To</p>
            <p className="text-muted-foreground">
              {lead?.assignedToUser?.fullName ?? "Unassigned"}
            </p>
          </div>
          <div>
            <p className="font-medium">Country</p>
            <p className="text-muted-foreground">{lead?.country ?? "-"}</p>
          </div>
          <div>
            <p className="font-medium">Source</p>
            <p className="text-muted-foreground">{lead?.source ?? "-"}</p>
          </div>
          <div>
            <p className="font-medium">English Test</p>
            <p className="text-muted-foreground">{lead?.englishTest ?? "-"}</p>
          </div>
          <div>
            <p className="font-medium">Interested Field</p>
            <p className="text-muted-foreground">
              {lead?.interestedField ?? "-"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="font-medium">Purpose</p>
            <p className="text-muted-foreground">{lead?.purpose ?? "-"}</p>
          </div>
          <div className="md:col-span-2 xl:col-span-3">
            <p className="font-medium">Address</p>
            <p className="text-muted-foreground">{lead?.address ?? "-"}</p>
          </div>
          {lead ? (
            <div className="md:col-span-2 xl:col-span-3">
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href={`/crm/lead/${lead.id}/edit`} />}
              >
                Edit Lead Details
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Details</CardTitle>
          <CardDescription>Enrollment status and study intake</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            name="status"
            label="Status"
            data={STUDENT_STATUS}
            defaultValue={student?.status}
            required
          />
          <SelectField
            name="intake"
            label="Intake"
            data={INTAKES}
            defaultValue={student?.intake}
            required
          />
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Details">
              <textarea
                name="details"
                defaultValue={student?.details ?? ""}
                className={textareaClassName}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
          <CardDescription>Optional emergency contact details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Emergency Name">
            <Input
              name="emergencyName"
              defaultValue={student?.emergencyName ?? ""}
            />
          </Field>
          <Field label="Emergency Phone">
            <Input
              name="emergencyPhone"
              defaultValue={student?.emergencyPhone ?? ""}
            />
          </Field>
          <Field label="Emergency Email">
            <Input
              name="emergencyEmail"
              type="email"
              defaultValue={student?.emergencyEmail ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/student" />}
        >
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
