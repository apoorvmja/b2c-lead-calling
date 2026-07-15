import Link from "next/link";

import type { Student, User } from "@repo/db";
import {
  COUNTRIES,
  ENGLISH_TESTS,
  INTAKES,
  INTERESTED_FIELDS,
  LEAD_STATUS,
  SOURCES,
} from "@repo/shared";

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
  users,
  student,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  users: User[];
  student?: Student;
  submitLabel: string;
}) {
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
              defaultValue={student?.enrollmentNumber ?? ""}
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
          <Field label="Assigned To">
            <select
              name="assignedToUserId"
              required
              defaultValue={student?.assignedToUserId ?? ""}
              className={selectClassName}
            >
              <option value="">
                {users.length === 0
                  ? "No active users available"
                  : "Select assigned user"}
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} - {user.role}
                </option>
              ))}
            </select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Student identity and contact information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="First Name">
            <Input name="firstName" defaultValue={student?.firstName ?? ""} required />
          </Field>
          <Field label="Middle Name">
            <Input name="middleName" defaultValue={student?.middleName ?? ""} />
          </Field>
          <Field label="Surname">
            <Input name="surname" defaultValue={student?.surname ?? ""} required />
          </Field>
          <Field label="Phone">
            <Input name="phone" defaultValue={student?.phone ?? ""} required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" defaultValue={student?.email ?? ""} />
          </Field>
          <Field label="Birth Date">
            <Input
              name="birthDate"
              type="date"
              defaultValue={formatDate(student?.birthDate)}
            />
          </Field>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Address">
              <textarea
                name="address"
                defaultValue={student?.address ?? ""}
                className={textareaClassName}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inquiry Details</CardTitle>
          <CardDescription>CRM classification and study preferences</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            name="country"
            label="Country"
            data={COUNTRIES}
            defaultValue={student?.country}
            required
          />
          <SelectField
            name="source"
            label="Source"
            data={SOURCES}
            defaultValue={student?.source}
            required
          />
          <SelectField
            name="status"
            label="Status"
            data={LEAD_STATUS}
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
          <SelectField
            name="interestedField"
            label="Interested Field"
            data={INTERESTED_FIELDS}
            defaultValue={student?.interestedField}
          />
          <SelectField
            name="englishTest"
            label="English Test"
            data={ENGLISH_TESTS}
            defaultValue={student?.englishTest}
          />
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Purpose">
              <textarea
                name="purpose"
                defaultValue={student?.purpose ?? ""}
                className={textareaClassName}
              />
            </Field>
          </div>
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

      <Card>
        <CardHeader>
          <CardTitle>Follow Up</CardTitle>
          <CardDescription>Optional follow-up tracking</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="flex h-8 items-center gap-2 text-sm">
            <input
              name="followUp"
              type="checkbox"
              defaultChecked={student?.followUp ?? false}
              className="size-4 rounded border-input"
            />
            <span className="font-medium">Follow up required</span>
          </label>
          <Field label="Follow Up Date">
            <Input
              name="followUpDate"
              type="date"
              defaultValue={formatDate(student?.followUpDate)}
            />
          </Field>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Follow Up Remark">
              <textarea
                name="followUpRemark"
                defaultValue={student?.followUpRemark ?? ""}
                className={textareaClassName}
              />
            </Field>
          </div>
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
