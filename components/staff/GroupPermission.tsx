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
import { Staff, Role, Department, Permission } from "@/types/staff";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";

interface AddStaffDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAddSPermission: (permissions: Omit<Permission, "id">) => void;

}

const resources = [
    { id: "orders", name: "Orders" },
    { id: "inventory", name: "Inventory" },
    { id: "stock", name: "Stock" },
    { id: "payment", name: "Payment" },
];


export function GroupPermission({
    isOpen,
    onOpenChange,
    onAddSPermission,

}: AddStaffDialogProps) {
    const [newPsermission, setNewPsermission] = React.useState({
        name: "",

        permissions: {
            orders: { create: false, read: false, update: false, delete: false },
            inventory: { create: false, read: false, update: false, delete: false },
            stock: { create: false, read: false, update: false, delete: false },
            payment: { create: false, read: false, update: false, delete: false },
        },
    });
    const { toast } = useToast();

    const handleAddStaff = () => {
        if (!newPsermission.name) {
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        onAddSPermission(newPsermission);
        setNewPsermission({
            name: "",
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
        setNewPsermission({
            ...newPsermission,
            permissions: {
                ...newPsermission.permissions,
                [resource]: {
                    ...newPsermission.permissions[resource as keyof typeof newPsermission.permissions],
                    [action]: checked,
                },
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Group Permissions</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new resource permissions.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Input
                            id="name"
                            placeholder="Name"
                            value={newPsermission.name}
                            onChange={(e) => setNewPsermission({ ...newPsermission, name: e.target.value })}
                        />
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
                                            checked={newPsermission.permissions[resource.id as keyof typeof newPsermission.permissions].create}
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
                                            checked={newPsermission.permissions[resource.id as keyof typeof newPsermission.permissions].read}
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
                                            checked={newPsermission.permissions[resource.id as keyof typeof newPsermission.permissions].update}
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
                                            checked={newPsermission.permissions[resource.id as keyof typeof newPsermission.permissions].delete}
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
                        Add Permissions
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}







