
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
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Dummy sidebar routes
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

// Generate more mock groups for testing
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
    const mockGroups = generateMockGroups(20);
    const [groups, setGroups] = React.useState<StaffGroup[]>(mockGroups);
    const [activeGroup, setActiveGroup] = React.useState<string | null>(mockGroups[0].id);
    const [searchQuery, setSearchQuery] = React.useState("");
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
        // In a real app, this would save to the backend
        toast({
            title: "Success",
            description: "Group permissions have been updated",
        });
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
                    <h1 className="text-2xl font-bold">Advanced Settings</h1>
                    <p className="text-muted-foreground">Configure staff groups and permissions</p>
                </div>
                <Button className="bg-pink-600 hover:bg-pink-500" onClick={handleSaveChanges}>Save Changes</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 shadow-none rounded-sm">
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
                    <Card className="md:col-span-2 shadow-none rounded-sm">
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
        </div>
    );
}