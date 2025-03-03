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
import { Staff, Role, Department } from "@/types/staff";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface AddStaffDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStaff: (staff: Omit<Staff, "id">) => void;
  departments: Department[];
  roles: Role[];
}


// Define resources
const resources = [
  { id: "orders", name: "Orders" },
  { id: "inventory", name: "Inventory" },
  { id: "stock", name: "Stock" },
  { id: "payment", name: "Payment" },
];

export function AddStaffDialog({
  isOpen,
  onOpenChange,
  onAddStaff,
  departments,
  roles,

}: AddStaffDialogProps) {
  const [newStaff, setNewStaff] = React.useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
    permissions: {
      orders: { create: false, read: false, update: false, delete: false },
      inventory: { create: false, read: false, update: false, delete: false },
      stock: { create: false, read: false, update: false, delete: false },
      payment: { create: false, read: false, update: false, delete: false },
    },
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
    setNewStaff({
      name: "",
      email: "",
      role: "",
      phone: "",
      department: "",
      permissions: {
        orders: { create: false, read: false, update: false, delete: false },
        inventory: { create: false, read: false, update: false, delete: false },
        stock: { create: false, read: false, update: false, delete: false },
        payment: { create: false, read: false, update: false, delete: false },
      },
    });
    onOpenChange(false);
  };

  const handlePermissionChange = (resource: string, action: string, checked: boolean) => {
    setNewStaff({
      ...newStaff,
      permissions: {
        ...newStaff.permissions,
        [resource]: {
          ...newStaff.permissions[resource as keyof typeof newStaff.permissions],
          [action]: checked,
        },
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new staff member with resource permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="Name"
              value={newStaff.name}
              onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">

            <Input
              id="email"
              placeholder="Email"
              type="email"
              value={newStaff.email}
              onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">

            <Input
              id="phone"
              placeholder="Phone"
              type="tel"
              value={newStaff.phone}
              onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Select
              value={newStaff.role}
              onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
            >
              <SelectTrigger id="role">
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
          </div>

          <div className="space-y-2">
            <Select
              value={newStaff.department}
              onValueChange={(value) => setNewStaff({ ...newStaff, department: value })}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <Label>Resource Permissions</Label>

            {resources.map((resource) => (
              <div key={resource.id} className="border rounded-md p-3">
                <h4 className="font-medium mb-2">{resource.name}</h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      className="accent-pink-700 rounded-full border-pink-700 w-6 h-6"
                      id={`${resource.id}-create`}
                      checked={newStaff.permissions[resource.id as keyof typeof newStaff.permissions].create}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'create', checked as boolean)
                      }
                    />
                    <Label htmlFor={`${resource.id}-create`} className="text-sm">CREATE</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      className="accent-pink-700 rounded-full border-pink-700 w-6 h-6"
                      id={`${resource.id}-read`}
                      checked={newStaff.permissions[resource.id as keyof typeof newStaff.permissions].read}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'read', checked as boolean)
                      }
                    />
                    <Label htmlFor={`${resource.id}-read`} className="text-sm">READ</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      className="accent-black rounded-full border-pink-700 w-6 h-6"
                      id={`${resource.id}-update`}
                      checked={newStaff.permissions[resource.id as keyof typeof newStaff.permissions].update}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'update', checked as boolean)
                      }
                    />
                    <Label htmlFor={`${resource.id}-update`} className="text-sm">UPDATE</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      className="accent-pink-700 rounded-full border-pink-700 w-6 h-6"
                      id={`${resource.id}-delete`}
                      checked={newStaff.permissions[resource.id as keyof typeof newStaff.permissions].delete}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'delete', checked as boolean)
                      }
                    />
                    <Label htmlFor={`${resource.id}-delete`} className="text-sm">DELETE</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleAddStaff} className="w-full mt-4">
            Add Staff
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// import { useToast } from "@/hooks/use-toast";
// import { Outlet, Role, Staff } from "@/types/staff";

// interface AddStaffDialogProps {
//   isOpen: boolean;
//   onOpenChange: (open: boolean) => void;
//   onAddStaff: (staff: Omit<Staff, "id">) => void;
//   outlets: Outlet[];
//   roles: Role[]
// }

// export function AddStaffDialog({
//   isOpen,
//   onOpenChange,
//   onAddStaff,
//   outlets,
//   roles
// }: AddStaffDialogProps) {
//   const [newStaff, setNewStaff] = React.useState({
//     name: "",
//     email: "",
//     role: "",
//     department:"",
//     phone: "",
//     outlet: "",
//   });
//   const { toast } = useToast();

//   const handleAddStaff = () => {
//     if (!newStaff.name || !newStaff.email || !newStaff.role) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     onAddStaff(newStaff);
//     setNewStaff({ name: "", email: "", role: "", department:"", phone: "", outlet: "" });
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add New Staff</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <Input
//             placeholder="Full Name"
//             value={newStaff.name}
//             onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
//           />
//           <Input
//             placeholder="Email"
//             type="email"
//             value={newStaff.email}
//             onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
//           />
//           <Input
//             placeholder="Phone"
//             type="tel"
//             value={newStaff.phone}
//             onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
//           />

//           <Select
//             value={newStaff.role}
//             onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select Role" />
//             </SelectTrigger>
//             <SelectContent>
//               {roles.map((role) => (
//                 <SelectItem key={role.id} value={role.id}>
//                   {role.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Select
//             value={newStaff.outlet}
//             onValueChange={(value) => setNewStaff({ ...newStaff, outlet: value })}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Department" />
//             </SelectTrigger>
//             <SelectContent>
//               {outlets.map((outlet) => (
//                 <SelectItem key={outlet.id} value={outlet.id}>
//                   {outlet.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Button onClick={handleAddStaff} className="w-full">
//             Add Staff
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }




