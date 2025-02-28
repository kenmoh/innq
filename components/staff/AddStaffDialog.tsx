import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { Outlet, Role, Staff } from "@/types/staff";

interface AddStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStaff: (staff: Omit<Staff, "id">) => void;
  outlets: Outlet[];
  roles: Role[]
}

export function AddStaffDialog({
  isOpen,
  onOpenChange,
  onAddStaff,
  outlets,
  roles
}: AddStaffDialogProps) {
  const [newStaff, setNewStaff] = React.useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    outlet: "",
  });
  const { toast } = useToast();

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddStaff(newStaff);
    setNewStaff({ name: "", email: "", role: "", phone: "", outlet: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Full Name"
            value={newStaff.name}
            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={newStaff.email}
            onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            type="tel"
            value={newStaff.phone}
            onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
          />

          <Select
            value={newStaff.role}
            onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={newStaff.outlet}
            onValueChange={(value) => setNewStaff({ ...newStaff, outlet: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {outlets.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddStaff} className="w-full">
            Add Staff
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}