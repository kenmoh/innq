'use client'

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function Orders() {
    const [orders, setOrders] = useState([
        {
            id: "ORD-001",
            table: "Table 1",
            items: [
                { name: "Burger", quantity: 2, price: "15.99" },
                { name: "Fries", quantity: 1, price: "5.99" }
            ],
            total: "45.97",
            status: "In Progress",
            time: "5 mins ago"
        },
        {
            id: "ORD-002",
            table: "Table 4",
            items: [
                { name: "Pizza", quantity: 1, price: "13.99" },
                { name: "Soda", quantity: 1, price: "2.99" }
            ],
            total: "27.98",
            status: "Completed",
            time: "15 mins ago"
        },
        {
            id: "ORD-003",
            table: "Bar Counter",
            items: [
                { name: "Beer", quantity: 1, price: "12.99" }
            ],
            total: "12.99",
            status: "Ready",
            time: "2 mins ago"
        },
        {
            id: "ORD-004",
            table: "Table 2",
            items: [
                { name: "Steak", quantity: 2, price: "25.99" },
                { name: "Salad", quantity: 2, price: "7.99" }
            ],
            total: "67.96",
            status: "New",
            time: "Just now"
        },
    ]);

    const [editingOrder, setEditingOrder] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const { toast } = useToast();

    const getStatusColor = (status: string) => {
        const colors = {
            New: "bg-blue-500",
            "In Progress": "bg-yellow-500",
            Ready: "bg-green-500",
            Completed: "bg-purple-500",
            Cancelled: "bg-red-500",
        };
        return colors[status as keyof typeof colors] || "bg-gray-500";
    };

    const handleStatusChange = (orderId: string, newStatus: string) => {
        setOrders(orders.map(order => {
            if (order.id === orderId) {
                return { ...order, status: newStatus };
            }
            return order;
        }));

        setEditingOrder(null);
        setIsEditDialogOpen(false);
        toast({
            title: "Order Status Updated",
            description: `Order ${orderId} status changed to ${newStatus}`,
        });
    };

    const handleDeleteOrder = (orderId: string) => {
        setOrders(orders.filter(order => order.id !== orderId));
        toast({
            title: "Order Deleted",
            description: `Order ${orderId} has been deleted`,
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Orders</h1>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Select
                            onValueChange={(value) => {
                                if (editingOrder) {
                                    handleStatusChange(editingOrder, value);
                                }
                            }}
                            value={orders.find(order => order.id === editingOrder)?.status}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Ready">Ready</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </DialogContent>
            </Dialog>

            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Order Details - {selectedOrder?.id}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium">Table</h3>
                                <p>{selectedOrder?.table}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Items</h3>
                                <ul className="space-y-2">
                                    {selectedOrder?.items.map((item: any, index: number) => (
                                        <li key={index} className="flex justify-between">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>{item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-medium">Total</h3>
                                <p>{selectedOrder?.total}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Status</h3>
                                <Badge className={`${getStatusColor(selectedOrder?.status)} text-white`}>
                                    {selectedOrder?.status}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="font-medium">Time</h3>
                                <p>{selectedOrder?.time}</p>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <div className="rounded-sm ">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Table</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow
                                key={order.id}
                                className="cursor-pointer"
                                onClick={() => {
                                    setSelectedOrder(order);
                                    setIsDetailsOpen(true);
                                }}
                            >
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.table}</TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell>₦{order.total}</TableCell>
                                <TableCell>
                                    <Badge className={`${getStatusColor(order.status)} text-white`}>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{order.time}</TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setEditingOrder(order.id);
                                                setIsEditDialogOpen(true);
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteOrder(order.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}