'use client'
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Staff, Department, Roletype } from "@/types/staff";
import { useToast } from "@/hooks/use-toast";


interface AddStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStaff: (staff: Omit<Staff, "id">) => void;
  departments: Department[];
  roles: Roletype[];
}


export function AddStaffDialog({
  isOpen,
  onOpenChange,
  departments,
  roles,

}: AddStaffDialogProps) {

  const { toast } = useToast();



  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new staff member.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">

            <Input
              id="name"
              placeholder="Name"
            // value={newStaff.name}
            // onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">

            <Input
              id="email"
              placeholder="Email"
              type="email"
            // value={newStaff.email}
            // onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">

            <Input
              id="phone"
              placeholder="Phone"
              type="tel"
            // value={newStaff.phone}
            // onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Select
            // value={newStaff.role}
            // onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
            >
              <SelectTrigger id="role">
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

          <div className="space-y-2">
            <Select
            // value={newStaff.department}
            // onValueChange={(value) => setNewStaff({ ...newStaff, department: value })}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.name}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          <Button className="w-full mt-4">
            Add Staff
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
