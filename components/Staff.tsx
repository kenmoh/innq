'use client'
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Building, Search, Users2, Settings2 } from "lucide-react";
import { AddStaffDialog } from "@/components/staff/AddStaffDialog";
import { StaffDetails } from "@/components/staff/StaffDetails";

import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Staff, Role, Department, Permission, Roletype } from "@/types/staff";
import { GroupPermission } from "./staff/GroupPermission";
import Link from "next/link";
import { AddDepartmentDialog } from "./staff/AddDepartment";
import { AddStaffRoletDialog } from "./staff/AddStaffRole";

// Dummy data for demonstration
// const dummyDepts: Department[] = [
//   { id: "1", name: "HR" },
//   { id: "2", name: "Finance" },
//   { id: "3", name: "Purchasing/Store" },
//   { id: "4", name: "Maintenance" },
//   { id: "5", name: "Management" },
//   { id: "6", name: "Food & Beverages" },
//   { id: "7", name: "Laundry" },
//   { id: "8", name: "Kitchen" },
//   { id: "9", name: "Front Desk" },
//   { id: "10", name: "Sales" },
//   { id: "11", name: "Reservations" },
//   { id: "12", name: "Security" },
// ];
const dummyRoles: Role[] = [
  { id: "5", name: "none" },
  { id: "1", name: "Manager" },
  { id: "2", name: "Laundry" },
  { id: "3", name: "Waiter" },
  { id: "4", name: "Chef" },
];

export default function StaffPage({ roles, departments }: { roles: Roletype[], departments: Department[] }) {
  const [staff, setStaff] = React.useState<Staff[]>([]);
  const [groupPermission, setGroupPermission] = React.useState<Permission[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = React.useState(false);
  const [isAddDepartmentDialogOpen, setIsAddDepartmentDialogOpen] = React.useState(false);
  const [isAddPermDialogOpen, setIsAddPerDialogOpen] = React.useState(false);
  const [selectedStaff, setSelectedStaff] = React.useState<Staff | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { toast } = useToast();

  const handleAddStaff = (newStaff: Omit<Staff, "id">) => {
    const staffMember: Staff = {
      ...newStaff,
      id: Math.random().toString(36).substr(2, 9),
    };
    setStaff((prev) => [...prev, staffMember]);
    toast({
      title: "Success",
      description: "Staff member added successfully",
    });
  };
  const handleAddPermission = (newOermission: Omit<Permission, "id">) => {
    const permission: Permission = {
      ...newOermission,
      id: Math.random().toString(36).substr(2, 9),
    };
    setGroupPermission((prev) => [...prev, permission]);
    toast({
      title: "Success",
      description: "Staff member added successfully",
    });
  };

  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
  };


  const filteredStaff = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return staff.filter((member) => {
      const outletName = departments.find((o) => o.id === member.department)?.name.toLowerCase() || "";
      return (
        member.name.toLowerCase().includes(query) ||
        outletName.includes(query)
      );
    });
  }, [staff, searchQuery]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage your staff members</p>
        </div>
        <div className="flex gap-4">
          <Button variant={'outline'} onClick={() => setIsAddDepartmentDialogOpen(true)}>
            Add Department
          </Button>
          <Button variant={'outline'} onClick={() => setIsAddRoleDialogOpen(true)}>

            Add Role
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
          <Button variant={'outline'} onClick={() => setIsAddPerDialogOpen(true)}>
            <Users2 className="mr-2 h-4 w-4" />
            Add Group Permission
          </Button>

          <Link href="/dashboard/staff/advanced-settings">
            <Button variant="outline">
              <Settings2 className="mr-2 h-4 w-4" />
              Advanced Settings
            </Button>
          </Link>

        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or outlet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {filteredStaff.map((member) => (
          <Card
            key={member.role}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => {
              setSelectedStaff(member);
              setIsDetailsOpen(true);
            }}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex-1">
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Building className="mr-2 h-4 w-4" />
                {departments.find((o) => o.id === member.department)?.name || "No outlet assigned"}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddStaffDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddStaff={handleAddStaff}
        departments={departments}
        roles={roles}
      />
      <AddDepartmentDialog isOpen={isAddDepartmentDialogOpen} onOpenChange={setIsAddDepartmentDialogOpen} />
      <AddStaffRoletDialog isOpen={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen} />

      <StaffDetails
        roles={dummyRoles}
        staff={selectedStaff}
        departments={departments}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onUpdate={handleUpdateStaff}
      />
      <GroupPermission
        isOpen={isAddPermDialogOpen}
        onOpenChange={setIsAddPerDialogOpen}
        onAddSPermission={handleAddPermission}
      />
    </div>
  );
}