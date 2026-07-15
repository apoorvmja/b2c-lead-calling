import Link from "next/link";

import type { Lead, User } from "@repo/db";
import {
  COUNTRIES,
  ENGLISH_TESTS,
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

export function LeadForm({
  action,
  users,
  lead,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  users: User[];
  lead?: Lead;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Lead identity and contact information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Name">
            <Input name="name" defaultValue={lead?.name ?? ""} required />
          </Field>
          <Field label="Phone">
            <Input name="phone" defaultValue={lead?.phone ?? ""} required />
          </Field>
          <Field label="Email">
            <Input
              name="email"
              type="email"
              defaultValue={lead?.email ?? ""}
            />
          </Field>
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Address">
              <textarea
                name="address"
                defaultValue={lead?.address ?? ""}
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
            name="source"
            label="Source"
            data={SOURCES}
            defaultValue={lead?.source}
            required
          />
          <Field label="Assigned To">
            <select
              name="assignedToUserId"
              required
              defaultValue={lead?.assignedToUserId ?? ""}
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
          <SelectField
            name="country"
            label="Country"
            data={COUNTRIES}
            defaultValue={lead?.country}
            required
          />
          <SelectField
            name="status"
            label="Status"
            data={LEAD_STATUS}
            defaultValue={lead?.status}
            required
          />
          <SelectField
            name="interestedField"
            label="Interested Field"
            data={INTERESTED_FIELDS}
            defaultValue={lead?.interestedField}
          />
          <SelectField
            name="englishTest"
            label="English Test"
            data={ENGLISH_TESTS}
            defaultValue={lead?.englishTest}
          />
          <div className="md:col-span-2 xl:col-span-3">
            <Field label="Purpose">
              <textarea
                name="purpose"
                defaultValue={lead?.purpose ?? ""}
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
          render={<Link href="/crm/lead" />}
        >
          Cancel
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
