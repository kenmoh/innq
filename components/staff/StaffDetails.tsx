import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Outlet, Role, Staff } from "@/types/staff";

interface StaffDetailsProps {
  staff: Staff | null;
  outlets: Outlet[];
  roles: Role[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (staff: Staff) => void;
}

export function StaffDetails({
  staff,
  outlets,
  roles,
  open,
  onOpenChange,
  onUpdate,
}: StaffDetailsProps) {
  const [editedStaff, setEditedStaff] = React.useState<Staff | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    setEditedStaff(staff);
  }, [staff]);

  const handleUpdate = () => {
    if (!editedStaff) return;
    onUpdate(editedStaff);
    toast({
      title: "Success",
      description: "Staff details updated successfully",
    });
    onOpenChange(false);
  };

  if (!editedStaff) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Staff Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Input
              placeholder="Name"
              value={editedStaff.name}
              onChange={(e) =>
                setEditedStaff({ ...editedStaff, name: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              placeholder="Email"
              type="email"
              value={editedStaff.email}
              onChange={(e) =>
                setEditedStaff({ ...editedStaff, email: e.target.value })
              }
            />
          </div>
          <div>
            <Input
              placeholder="Phone"
              type="tel"
              value={editedStaff.phone || ""}
              onChange={(e) =>
                setEditedStaff({ ...editedStaff, phone: e.target.value })
              }
            />
          </div>

          <div>
            <Select
              value={editedStaff.role}
              onValueChange={(value) =>
                setEditedStaff({ ...editedStaff, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              value={editedStaff.outlet}
              onValueChange={(value) =>
                setEditedStaff({ ...editedStaff, outlet: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select outlet" />
              </SelectTrigger>
              <SelectContent>
                {outlets.map((outlet) => (
                  <SelectItem key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleUpdate} className="w-full">
            Update Staff
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}