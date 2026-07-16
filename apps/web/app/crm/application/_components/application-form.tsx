import Link from "next/link";

import type { Student } from "@repo/db";
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
}: {
  name: string;
  label: string;
  data: Record<string, string>;
}) {
  return (
    <Field label={label}>
      <select name={name} defaultValue="" className={selectClassName}>
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
}: {
  action: (formData: FormData) => Promise<void>;
  students: Student[];
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Student</CardTitle>
          <CardDescription>Select the student for this application</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Student">
            <select
              name="studentId"
              required
              defaultValue=""
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
          />
          <SelectField name="course" label="Course" data={COURSES} />
          <Field label="College">
            <Input name="college" />
          </Field>
          <Field label="Course Duration">
            <Input name="courseDuration" />
          </Field>
          <Field label="Fee">
            <Input name="fee" type="number" step="0.01" />
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
            <Input name="applicationNo" />
          </Field>
          <Field label="Application Date">
            <Input name="applicationDate" type="date" />
          </Field>
          <SelectField
            name="applicationStatus"
            label="Application Status"
            data={APPLICATION_STATUS}
          />
          <SelectField name="intake" label="Intake" data={INTAKES} />
          <SelectField
            name="referencePortal"
            label="Reference Portal"
            data={REFERENCE_PORTALS}
          />
          <Field label="Reference Portal Link">
            <Input name="referencePortalLink" />
          </Field>
          <label className="flex items-center gap-2 self-end text-sm">
            <input
              type="checkbox"
              name="admissionDone"
              className="size-4 rounded border-input"
            />
            <span className="font-medium">Admission Done</span>
          </label>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Application Remark">
              <textarea name="applicationRemark" className={textareaClassName} />
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
        <Button type="submit">Create Application</Button>
      </div>
    </form>
  );
}
