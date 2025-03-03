
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
import { Staff, Department, Role } from "@/types/staff";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StaffDetailsProps {
  staff: Staff | null;
  departments: Department[];
  roles: Role[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (staff: Staff) => void;
}


// Define resources
const resources = [
  { id: "orders", name: "Orders" },
  { id: "inventory", name: "Inventory" },
  { id: "stock", name: "Stock" },
  { id: "payment", name: "Payment" },
];

export function StaffDetails({
  staff,
  roles,
  departments,
  open,
  onOpenChange,
  onUpdate,
}: StaffDetailsProps) {
  const [editedStaff, setEditedStaff] = React.useState<Staff | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (staff) {
      // Initialize permissions if they don't exist
      const initialPermissions = {
        orders: { create: false, read: false, update: false, delete: false },
        inventory: { create: false, read: false, update: false, delete: false },
        stock: { create: false, read: false, update: false, delete: false },
        payment: { create: false, read: false, update: false, delete: false },
        ...staff.permissions,
      };

      setEditedStaff({
        ...staff,
        department: staff.department || "",
        permissions: initialPermissions,

      });
    } else {
      setEditedStaff(null);
    }
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





  const handlePermissionChange = (resource: keyof Staff['permissions'], action: 'create' | 'read' | 'update' | 'delete', checked: boolean) => {
    if (!editedStaff) return;

    setEditedStaff({
      ...editedStaff,
      permissions: {
        orders: { create: false, read: false, update: false, delete: false },
        inventory: { create: false, read: false, update: false, delete: false },
        stock: { create: false, read: false, update: false, delete: false },
        payment: { create: false, read: false, update: false, delete: false },
        ...editedStaff.permissions,
        // [resource]: {
        //   ...editedStaff.permissions[resource as keyof typeof editedStaff.permissions],
        //   [action]: checked,
        // },
        [resource]: {
          ...(editedStaff.permissions?.[resource as keyof typeof editedStaff.permissions] ?? {}),
          [action]: checked,
        },
      },
    });
  };






  if (!editedStaff) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Staff Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">

            <Input
              id="edit-name"
              placeholder="Name"
              value={editedStaff.name}
              onChange={(e) =>
                setEditedStaff({ ...editedStaff, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">

            <Input
              id="edit-email"
              placeholder="Email"
              type="email"
              value={editedStaff.email}
              onChange={(e) =>
                setEditedStaff({ ...editedStaff, email: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">

            <Input
              id="edit-phone"
              placeholder="Phone"
              type="tel"
              value={editedStaff.phone || ""}
              onChange={(e) =>
                setEditedStaff({ ...editedStaff, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">

            <Select
              value={editedStaff.department || ""}
              onValueChange={(value) =>
                setEditedStaff({ ...editedStaff, department: value })
              }
            >
              <SelectTrigger id="edit-department">
                <SelectValue placeholder="Select department" />
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
          <div className="space-y-2">

            <Select
              value={editedStaff.department || ""}
              onValueChange={(value) =>
                setEditedStaff({ ...editedStaff, department: value })
              }
            >
              <SelectTrigger id="edit-department">
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
              value={editedStaff.department || ""}
              onValueChange={(value) =>
                setEditedStaff({ ...editedStaff, department: value })
              }
            >
              <SelectTrigger id="edit-outlet">
                <SelectValue placeholder="Select outlet" />
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
                      id={`edit-${resource.id}-create`}
                      checked={editedStaff.permissions?.[resource.id as keyof typeof editedStaff.permissions]?.create || false}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'create', checked as boolean)
                      }
                    />
                    <Label htmlFor={`edit-${resource.id}-create`} className="text-sm">Create</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${resource.id}-read`}
                      checked={editedStaff.permissions?.[resource.id as keyof typeof editedStaff.permissions]?.read || false}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'read', checked as boolean)
                      }
                    />
                    <Label htmlFor={`edit-${resource.id}-read`} className="text-sm">Read</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${resource.id}-update`}
                      checked={editedStaff.permissions?.[resource.id as keyof typeof editedStaff.permissions]?.update || false}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'update', checked as boolean)
                      }
                    />
                    <Label htmlFor={`edit-${resource.id}-update`} className="text-sm">Update</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${resource.id}-delete`}
                      checked={editedStaff.permissions?.[resource.id as keyof typeof editedStaff.permissions]?.delete || false}
                      onCheckedChange={(checked) =>
                        handlePermissionChange(resource.id, 'delete', checked as boolean)
                      }
                    />
                    <Label htmlFor={`edit-${resource.id}-delete`} className="text-sm">Delete</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleUpdate} className="w-full mt-4">
            Update Staff
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// import * as React from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";
// import { Department, Role, Staff } from "@/types/staff";

// interface StaffDetailsProps {
//   staff: Staff | null;
//   departments: Department[];
//   roles: Role[];
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onUpdate: (staff: Staff) => void;
// }

// export function StaffDetails({
//   staff,
//   departments,
//   roles,
//   open,
//   onOpenChange,
//   onUpdate,
// }: StaffDetailsProps) {
//   const [editedStaff, setEditedStaff] = React.useState<Staff | null>(null);
//   const { toast } = useToast();

//   React.useEffect(() => {
//     setEditedStaff(staff);
//   }, [staff]);

//   const handleUpdate = () => {
//     if (!editedStaff) return;
//     onUpdate(editedStaff);
//     toast({
//       title: "Success",
//       description: "Staff details updated successfully",
//     });
//     onOpenChange(false);
//   };

//   if (!editedStaff) return null;

//   return (
//     <Sheet open={open} onOpenChange={onOpenChange}>
//       <SheetContent>
//         <SheetHeader>
//           <SheetTitle>Staff Details</SheetTitle>
//         </SheetHeader>
//         <div className="space-y-4 mt-4">
//           <div>
//             <Input
//               placeholder="Name"
//               value={editedStaff.name}
//               onChange={(e) =>
//                 setEditedStaff({ ...editedStaff, name: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <Input
//               placeholder="Email"
//               type="email"
//               value={editedStaff.email}
//               onChange={(e) =>
//                 setEditedStaff({ ...editedStaff, email: e.target.value })
//               }
//             />
//           </div>
//           <div>
//             <Input
//               placeholder="Phone"
//               type="tel"
//               value={editedStaff.phone || ""}
//               onChange={(e) =>
//                 setEditedStaff({ ...editedStaff, phone: e.target.value })
//               }
//             />
//           </div>

//           <div>
//             <Select
//               value={editedStaff.role}
//               onValueChange={(value) =>
//                 setEditedStaff({ ...editedStaff, role: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select Role" />
//               </SelectTrigger>
//               <SelectContent>
//                 {roles.map((role) => (
//                   <SelectItem key={role.id} value={role.name}>
//                     {role.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Select
//               value={editedStaff.outlet}
//               onValueChange={(value) =>
//                 setEditedStaff({ ...editedStaff, outlet: value })
//               }
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select outlet" />
//               </SelectTrigger>
//               <SelectContent>
//                 {departments.map((department) => (
//                   <SelectItem key={department.id} value={department.id}>
//                     {department.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <Button onClick={handleUpdate} className="w-full">
//             Update Staff
//           </Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }