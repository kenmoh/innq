import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const management = [
  { id: 1, name: "James Wilson", position: "Restaurant Manager", email: "james@example.com", phone: "+1 234-567-8901" },
  { id: 2, name: "Emily Brown", position: "Assistant Manager", email: "emily@example.com", phone: "+1 234-567-8902" },
  { id: 3, name: "David Lee", position: "Operations Manager", email: "david@example.com", phone: "+1 234-567-8903" },
];

export default function Management() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Management Team</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {management.map((manager) => (
          <Card key={manager.id} className="rounded-sm">
            <CardHeader>
              <CardTitle>{manager.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{manager.position}</p>
                <p className="text-sm">{manager.email}</p>
                <p className="text-sm">{manager.phone}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none">
        <CardHeader className="px-0">
          <CardTitle>Organizational Structure</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {management.map((manager) => (
                <TableRow key={manager.id}>
                  <TableCell>{manager.position}</TableCell>
                  <TableCell>{manager.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{manager.email}</div>
                      <div className="text-sm text-muted-foreground">{manager.phone}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}