import Link from "next/link";

import type { Student, StudentVisa } from "@repo/db";
import { COUNTRIES, VISA_STATUS, VISA_TYPES } from "@repo/shared";

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

function Field({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
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
    <Field label={label} required={required}>
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

export function VisaForm({
  action,
  students,
  visa,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  students: Student[];
  visa?: StudentVisa;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Detail</CardTitle>
          <CardDescription>Select the student for this visa record</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Student/Client" required>
            <select
              name="studentId"
              required
              defaultValue={visa?.studentId ?? ""}
              className={selectClassName}
            >
              <option value="">
                {students.length === 0
                  ? "No students available"
                  : "Select student"}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.enrollmentNumber} -{" "}
                  {[student.firstName, student.middleName, student.surname]
                    .filter(Boolean)
                    .join(" ")}
                </option>
              ))}
            </select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visa Detail</CardTitle>
          <CardDescription>Visa type, country and status</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            name="country"
            label="Country"
            data={COUNTRIES}
            defaultValue={visa?.country}
          />
          <SelectField
            name="visaType"
            label="Visa Type"
            data={VISA_TYPES}
            defaultValue={visa?.visaType}
            required
          />
          <Field label="Visa No">
            <Input name="visaNumber" defaultValue={visa?.visaNumber ?? ""} />
          </Field>
          <SelectField
            name="status"
            label="Status"
            data={VISA_STATUS}
            defaultValue={visa?.status}
            required
          />
          <label className="flex items-center gap-2 self-end text-sm">
            <input
              type="checkbox"
              name="visaDone"
              defaultChecked={visa?.visaDone ?? false}
              className="size-4 rounded border-input"
            />
            <span className="font-medium">Visa Done</span>
          </label>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/visa" />}
        >
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
