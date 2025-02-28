import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StaffRota } from "@/components/staff/StaffRota";

const kitchenStaff = [
  { id: "1", name: "Gordon Smith", role: "Head Chef", shift: "Morning", speciality: "Main Course" },
  { id: "2", name: "Lisa Chen", role: "Sous Chef", shift: "Evening", speciality: "Appetizers" },
  { id: "3", name: "Marco Rodriguez", role: "Line Cook", shift: "Morning", speciality: "Grill" },
];

export default function Kitchen() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kitchen Staff</h2>
      </div>

      <StaffRota
        staffType="kitchen"
        staff={kitchenStaff.map(k => ({
          id: k.id,
          name: k.name,
          role: k.role,
          availability: ["morning", "afternoon", "night"],
        }))}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Morning Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {kitchenStaff.filter(s => s.shift === "Morning").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Evening Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {kitchenStaff.filter(s => s.shift === "Evening").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kitchenStaff.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kitchen Staff List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Speciality</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kitchenStaff.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>
                    <Badge variant={staff.role === "Head Chef" ? "default" : "secondary"}>
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{staff.shift}</TableCell>
                  <TableCell>{staff.speciality}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}