import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CrmPagination({
  basePath,
  page,
  query,
  totalPages,
}: {
  basePath: string;
  page: number;
  query?: string;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={
              <Link
                href={`${basePath}?${query ? `${query}&` : ""}page=${page - 1}`}
              />
            }
          >
            Previous
          </Button>
        ) : null}
        {page < totalPages ? (
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={
              <Link
                href={`${basePath}?${query ? `${query}&` : ""}page=${page + 1}`}
              />
            }
          >
            Next
          </Button>
        ) : null}
      </div>
    </div>
  );
}
