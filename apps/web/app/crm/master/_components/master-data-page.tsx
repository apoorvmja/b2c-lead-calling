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

type MasterData = Record<string, string>;

type MasterDataPageProps = {
  title: string;
  description: string;
  data: MasterData;
};

export function MasterDataPage({
  title,
  description,
  data,
}: MasterDataPageProps) {
  const rows = Object.entries(data);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Total records</CardDescription>
          <CardTitle className="text-3xl">{rows.length}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Reference values used in CRM workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {key}
                  </TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
