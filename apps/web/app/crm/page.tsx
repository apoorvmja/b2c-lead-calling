import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  { label: "Total Leads", value: "1,250", note: "Trending up this month" },
  { label: "New Students", value: "184", note: "Admissions pipeline" },
  { label: "Active Calls", value: "46", note: "Follow-ups in progress" },
  { label: "Conversion", value: "12.5%", note: "Last 30 days" },
];

export default function CrmPage() {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Documents</h2>
          <p className="text-sm text-muted-foreground">
            CRM workspace layout placeholder
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

      <Card className="min-h-[320px]">
        <CardHeader>
          <CardTitle>Total Visitors</CardTitle>
          <CardDescription>Total for the last 3 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Chart placeholder
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Work</CardTitle>
          <CardDescription>Table placeholder</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            {["Cover page", "Table of contents", "Visa checklist"].map(
              (item) => (
                <div
                  key={item}
                  className="grid grid-cols-[1fr_auto] rounded-md border p-3"
                >
                  <span>{item}</span>
                  <span className="text-muted-foreground">In progress</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
