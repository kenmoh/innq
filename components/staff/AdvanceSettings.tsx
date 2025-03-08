
'use client'
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StaffGroup } from "@/types/staff";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Edit, Key, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";

;

const sidebarRoutes = [
    { id: "overview", name: "Overview" },
    { id: "qrCodes", name: "QR Codes" },
    { id: "staff", name: "Staff" },
    { id: "attendance", name: "Attendance" },
    { id: "payroll", name: "Payroll" },
    { id: "rota", name: "Rota" },
    { id: "restaurantManager", name: "Restaurant Manager" },
    { id: "menuItems", name: "Menu Items" },
    { id: "orders", name: "Orders" },
    { id: "events", name: "Events" },
    { id: "inventory", name: "Inventory" },
    { id: "reservations", name: "Reservations" },
    { id: "analytics", name: "Analytics" },
    { id: "payments", name: "Payments" },
    { id: "feedback", name: "Customer Feedback" },
    { id: "issues", name: "Issues" },
    { id: "settings", name: "Settings" },
];

const generateMockGroups = (count: number): StaffGroup[] => {
    const baseGroups = [
        {
            id: "1",
            name: "Administrators",
            permissions: {
                orders: { create: true, read: true, update: true, delete: true },
                inventory: { create: true, read: true, update: true, delete: true },
                stock: { create: true, read: true, update: true, delete: true },
            },
            visibleRoutes: {
                overview: true,
                qrCodes: true,
                staff: true,
                attendance: true,
                payroll: true,
                rota: true,
                restaurantManager: true,
                menuItems: true,
                orders: true,
                events: true,
                inventory: true,
                reservations: true,
                analytics: true,
                payments: true,
                feedback: true,
                issues: true,
                settings: true,
            },
        },
        {
            id: "2",
            name: "Kitchen Staff",
            permissions: {
                orders: { create: false, read: true, update: true, delete: false },
                inventory: { create: false, read: true, update: false, delete: false },
                stock: { create: false, read: true, update: false, delete: false },
            },
            visibleRoutes: {
                overview: true,
                qrCodes: false,
                staff: false,
                attendance: true,
                payroll: false,
                rota: true,
                restaurantManager: true,
                menuItems: true,
                orders: true,
                events: false,
                inventory: true,
                reservations: false,
                analytics: false,
                payments: false,
                feedback: false,
                issues: true,
                settings: false,
            },
        },
    ];

    if (count <= 2) return baseGroups;

    const additionalGroups: StaffGroup[] = [];
    for (let i = 3; i <= count; i++) {
        const randVisibleRoutes = sidebarRoutes.reduce((acc, route) => {
            acc[route.id] = Math.random() > 0.4;
            return acc;
        }, {} as Record<string, boolean>);

        additionalGroups.push({
            id: i.toString(),
            name: `Group ${i}`,
            permissions: {
                orders: {
                    create: Math.random() > 0.5,
                    read: Math.random() > 0.3,
                    update: Math.random() > 0.5,
                    delete: Math.random() > 0.7
                },
                inventory: {
                    create: Math.random() > 0.5,
                    read: Math.random() > 0.3,
                    update: Math.random() > 0.5,
                    delete: Math.random() > 0.7
                },
                stock: {
                    create: Math.random() > 0.5,
                    read: Math.random() > 0.3,
                    update: Math.random() > 0.5,
                    delete: Math.random() > 0.7
                },
            },
            visibleRoutes: randVisibleRoutes,
        });
    }

    return [...baseGroups, ...additionalGroups];
};

export default function AdvancedSettings() {
    const router = useRouter()
    const mockGroups = generateMockGroups(20);
    const [groups, setGroups] = React.useState<StaffGroup[]>(mockGroups);
    const [activeGroup, setActiveGroup] = React.useState<string | null>(mockGroups[0].id);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showPermissionsSheet, setShowPermissionsSheet] = React.useState(false);
    const [editingPermissions, setEditingPermissions] = React.useState<{
        resourceName: string;
        permissions: { create: boolean; read: boolean; update: boolean; delete: boolean };
    } | null>(null);
    const { toast } = useToast();

    const handleRouteToggle = (groupId: string, routeId: string, checked: boolean) => {
        setGroups(prev =>
            prev.map(group =>
                group.id === groupId
                    ? {
                        ...group,
                        visibleRoutes: {
                            ...group.visibleRoutes,
                            [routeId]: checked
                        }
                    }
                    : group
            )
        );
    };

    const handleSaveChanges = () => {
        toast({
            title: "Success",
            description: "Group permissions have been updated",
        });
    };

    const handlePermissionChange = (permissionType: 'create' | 'read' | 'update' | 'delete', checked: boolean) => {
        if (!editingPermissions) return;

        setEditingPermissions({
            ...editingPermissions,
            permissions: {
                ...editingPermissions.permissions,
                [permissionType]: checked
            }
        });
    };

    const savePermissionChanges = () => {
        if (!editingPermissions || !activeGroup) return;

        setGroups(prev =>
            prev.map(group =>
                group.id === activeGroup
                    ? {
                        ...group,
                        permissions: {
                            ...group.permissions,
                            [editingPermissions.resourceName]: editingPermissions.permissions
                        }
                    }
                    : group
            )
        );

        setShowPermissionsSheet(false);
        setEditingPermissions(null);

        toast({
            title: "Permission Updated",
            description: `Updated ${editingPermissions.resourceName} permissions for the selected group.`,
        });
    };

    const openPermissionsSheet = (resourceName: string) => {
        const selectedGroup = groups.find(g => g.id === activeGroup);
        if (!selectedGroup) return;

        setEditingPermissions({
            resourceName,
            permissions: selectedGroup.permissions[resourceName as keyof typeof selectedGroup.permissions] || {
                create: false, read: false, update: false, delete: false
            }
        });

        setShowPermissionsSheet(true);
    };

    const filteredGroups = React.useMemo(() => {
        if (!searchQuery) return groups;

        const query = searchQuery.toLowerCase();
        return groups.filter(group =>
            group.name.toLowerCase().includes(query)
        );
    }, [groups, searchQuery]);

    const selectedGroup = activeGroup
        ? groups.find(g => g.id === activeGroup)
        : null;

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Button onClick={() => router.back()} variant={'link'} className="mb-5"> <ArrowLeft /> Back</Button>
                    <h1 className="text-2xl font-bold">Advanced Settings</h1>
                    <p className="text-muted-foreground">Configure staff groups and permissions</p>
                </div>
                <Button onClick={handleSaveChanges}>Save Changes</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 rounded-sm">
                    <CardHeader>
                        <CardTitle>Staff Groups</CardTitle>
                        <div className="mt-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search groups..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px]">
                            <div className="space-y-1">
                                {filteredGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className={`p-2 cursor-pointer rounded-md transition-colors ${activeGroup === group.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                                            }`}
                                        onClick={() => setActiveGroup(group.id)}
                                    >
                                        {group.name}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {selectedGroup && (
                    <Card className="md:col-span-2 rounded-sm">
                        <CardHeader>
                            <CardTitle>{selectedGroup.name} - Visible Dashboard Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[400px] w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Route</TableHead>
                                            <TableHead className="text-center">Visible</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sidebarRoutes.map((route) => (
                                            <TableRow key={route.id}>
                                                <TableCell className="font-medium">{route.name}</TableCell>
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        id={`${selectedGroup.id}-${route.id}`}
                                                        checked={selectedGroup.visibleRoutes[route.id] || false}
                                                        onCheckedChange={(checked) =>
                                                            handleRouteToggle(selectedGroup.id, route.id, checked as boolean)
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                )}
            </div>

            {selectedGroup && (
                <Card className="mt-6 rounded-sm">
                    <CardHeader>
                        <CardTitle>Resource Permissions</CardTitle>
                        <p className="text-sm text-muted-foreground">Click on a resource to edit its permissions</p>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(selectedGroup.permissions).map(([resource, permissions]) => (
                                <Card key={resource} className="cursor-pointer hover:bg-accent/5 rounded-sm" onClick={() => openPermissionsSheet(resource)}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg capitalize">{resource}</CardTitle>
                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <div className={`h-2 w-2 rounded-full ${permissions.create ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span>Create</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`h-2 w-2 rounded-full ${permissions.read ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span>Read</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`h-2 w-2 rounded-full ${permissions.update ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span>Update</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className={`h-2 w-2 rounded-full ${permissions.delete ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <span>Delete</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Sheet open={showPermissionsSheet} onOpenChange={setShowPermissionsSheet}>
                <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            {editingPermissions && (
                                <span className="capitalize">{editingPermissions.resourceName} Permissions</span>
                            )}
                        </SheetTitle>
                        <SheetDescription>
                            Edit permissions for this resource. Changes will be applied when you save.
                        </SheetDescription>
                    </SheetHeader>

                    {editingPermissions && (
                        <div className="mt-6 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3 p-3 border rounded-md">
                                    <Checkbox
                                        id="create-permission"
                                        checked={editingPermissions.permissions.create}
                                        onCheckedChange={(checked) => handlePermissionChange('create', checked as boolean)}
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="create-permission" className="font-medium">Create</Label>
                                        <p className="text-sm text-muted-foreground">Allow users to create new items</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 border rounded-md">
                                    <Checkbox
                                        id="read-permission"
                                        checked={editingPermissions.permissions.read}
                                        onCheckedChange={(checked) => handlePermissionChange('read', checked as boolean)}
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="read-permission" className="font-medium">Read</Label>
                                        <p className="text-sm text-muted-foreground">Allow users to view items</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 border rounded-md">
                                    <Checkbox
                                        id="update-permission"
                                        checked={editingPermissions.permissions.update}
                                        onCheckedChange={(checked) => handlePermissionChange('update', checked as boolean)}
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="update-permission" className="font-medium">Update</Label>
                                        <p className="text-sm text-muted-foreground">Allow users to modify existing items</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3 p-3 border rounded-md">
                                    <Checkbox
                                        id="delete-permission"
                                        checked={editingPermissions.permissions.delete}
                                        onCheckedChange={(checked) => handlePermissionChange('delete', checked as boolean)}
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="delete-permission" className="font-medium">Delete</Label>
                                        <p className="text-sm text-muted-foreground">Allow users to remove items</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowPermissionsSheet(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={savePermissionChanges}>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
