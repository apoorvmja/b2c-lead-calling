import Link from "next/link";

import type { Student, StudentApplication } from "@repo/db";
import {
  APPLICATION_STATUS,
  COUNTRIES,
  COURSES,
  INTAKES,
  REFERENCE_PORTALS,
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

export function ApplicationForm({
  action,
  students,
  application,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  students: Student[];
  application?: StudentApplication;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Student</CardTitle>
          <CardDescription>Select the student for this application</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Student" required>
            <select
              name="studentId"
              required
              defaultValue={application?.studentId ?? ""}
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
          <CardTitle>Destination</CardTitle>
          <CardDescription>College and course preferences</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SelectField
            name="preferredCountry"
            label="Preferred Country"
            data={COUNTRIES}
            defaultValue={application?.preferredCountry}
          />
          <SelectField
            name="course"
            label="Course"
            data={COURSES}
            defaultValue={application?.course}
          />
          <Field label="College">
            <Input name="college" defaultValue={application?.college ?? ""} />
          </Field>
          <Field label="Course Duration">
            <Input
              name="courseDuration"
              defaultValue={application?.courseDuration ?? ""}
            />
          </Field>
          <Field label="Fee">
            <Input
              name="fee"
              type="number"
              step="0.01"
              defaultValue={application?.fee?.toString() ?? ""}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application</CardTitle>
          <CardDescription>Application status and reference details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Application No">
            <Input
              name="applicationNo"
              defaultValue={application?.applicationNo ?? ""}
            />
          </Field>
          <Field label="Application Date">
            <Input
              name="applicationDate"
              type="date"
              defaultValue={
                application?.applicationDate?.toISOString().slice(0, 10) ?? ""
              }
            />
          </Field>
          <SelectField
            name="applicationStatus"
            label="Application Status"
            data={APPLICATION_STATUS}
            defaultValue={application?.applicationStatus}
          />
          <SelectField
            name="intake"
            label="Intake"
            data={INTAKES}
            defaultValue={application?.intake}
          />
          <SelectField
            name="referencePortal"
            label="Reference Portal"
            data={REFERENCE_PORTALS}
            defaultValue={application?.referencePortal}
          />
          <Field label="Reference Portal Link">
            <Input
              name="referencePortalLink"
              defaultValue={application?.referencePortalLink ?? ""}
            />
          </Field>
          <label className="flex items-center gap-2 self-end text-sm">
            <input
              type="checkbox"
              name="admissionDone"
              defaultChecked={application?.admissionDone ?? false}
              className="size-4 rounded border-input"
            />
            <span className="font-medium">Admission Done</span>
          </label>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Application Remark">
              <textarea
                name="applicationRemark"
                defaultValue={application?.applicationRemark ?? ""}
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
          render={<Link href="/crm/application" />}
        >
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
