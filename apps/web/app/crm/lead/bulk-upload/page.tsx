import Link from "next/link";

import { LEAD_STATUS, SOURCES } from "@repo/shared";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { uploadBulkLeads } from "./actions";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function BulkLeadUploadPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Bulk Lead Upload</h2>
          <p className="text-sm text-muted-foreground">
            Upload JSON leads with a shared status and reference
          </p>
        </div>
        <Button
          nativeButton={false}
          variant="outline"
          render={<Link href="/crm/lead" />}
        >
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Leads</CardTitle>
          <CardDescription>
            Leads are created as unallocated records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={uploadBulkLeads} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Input
                name="file"
                type="file"
                accept="application/json,.json"
                required
              />
              <select name="status" required className={selectClassName}>
                <option value="">Select status *</option>
                {Object.values(LEAD_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <select name="source" required className={selectClassName}>
                <option value="">Select reference *</option>
                {Object.values(SOURCES).map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button type="submit">Upload Leads</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
