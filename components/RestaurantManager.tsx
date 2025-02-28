'use client'

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddWaiterDialog } from "@/components/restaurant/AddWaiterDialog";
import { AddTableDialog } from "@/components/restaurant/AddTableDialog";
import { WaiterTable } from "@/components/restaurant/WaiterTable";
import { TableGrid } from "@/components/restaurant/TableGrid";
import { QuickOrderStatus } from "@/components/restaurant/QuickOrderStatus";
import { WaiterStats } from "@/components/restaurant/WaiterStats";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Waiter {
  id: number;
  name: string;
  status: "on-duty" | "off-duty" | "on-break";
  assignedTables: string[];
  shift: string;
  performance?: number;
  breakTime?: Date | null;
}

interface Table {
  id: string;
  status: "available" | "occupied" | "reserved" | "cleaning";
  capacity: string;
  currentOrder?: {
    items: number;
    timeElapsed: number;
  };
  assignedWaiter?: string;
}

interface Order {
  id: string;
  table: string;
  status: "pending" | "preparing" | "ready" | "served";
  items: string[];
  timeElapsed: number;
  isUrgent?: boolean;
}

export default function RestaurantManager() {
  const [waiters, setWaiters] = useState<Waiter[]>([
    {
      id: 1,
      name: "John Doe",
      status: "on-duty",
      assignedTables: ["Table 1", "Table 2"],
      shift: "Morning",
      performance: 4
    },
    {
      id: 2,
      name: "Jane Smith",
      status: "on-duty",
      assignedTables: ["Table 3"],
      shift: "Morning",
      performance: 5
    },
  ]);

  const [tables, setTables] = useState<Table[]>([
    {
      id: "1",
      status: "occupied",
      capacity: '4',
      currentOrder: { items: 3, timeElapsed: 15 },
      assignedWaiter: "John Doe"
    },
    {
      id: "2",
      status: "available",
      capacity: '2',
    },
    {
      id: "3",
      status: "reserved",
      capacity: '6',
      assignedWaiter: "Jane Smith"
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      table: "Table 1",
      status: "preparing",
      items: ["Pizza", "Salad", "Coke"],
      timeElapsed: 15,
      isUrgent: true
    },
    {
      id: "2",
      table: "Table 3",
      status: "pending",
      items: ["Burger", "Fries"],
      timeElapsed: 5
    },
  ]);

  const [isWaiterDialogOpen, setIsWaiterDialogOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddWaiter = (newWaiter: { name: string; shift: string; tables: string[] }) => {
    const waiter: Waiter = {
      id: waiters.length + 1,
      name: newWaiter.name,
      status: "off-duty",
      assignedTables: newWaiter.tables,
      shift: newWaiter.shift,
      performance: 0
    };

    setWaiters([...waiters, waiter]);
    toast({
      title: "Waiter Added",
      description: `${newWaiter.name} has been added to the staff`,
    });
  };

  const handleAddTable = (tableName: string, capacity: string) => {
    const newTable: Table = {
      id: tableName.split(" ")[1],
      status: "available",
      capacity,
    };

    setTables([...tables, newTable]);
    toast({
      title: "Table Added",
      description: `${tableName} has been added`,
    });
  };

  const toggleWaiterStatus = (id: number) => {
    setWaiters(waiters.map(waiter => {
      if (waiter.id === id) {
        const newStatus = waiter.status === "on-duty" ? "off-duty" : "on-duty";
        return { ...waiter, status: newStatus };
      }
      return waiter;
    }));
  };

  const handleTableAction = (tableId: string, action: "clean" | "clear" | "reserve" | "finish-cleaning") => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        switch (action) {
          case "clean":
            return { ...table, status: "cleaning" as const };
          case "clear":
            return {
              ...table,
              status: "available" as const,
              currentOrder: undefined,
              assignedWaiter: undefined
            };
          case "reserve":
            return { ...table, status: "reserved" as const };
          case "finish-cleaning":
            return { ...table, status: "available" as const };
          default:
            return table;
        }
      }
      return table;
    }));

    toast({
      title: "Table Updated",
      description: `Table ${tableId} status changed to ${action}`,
    });
  };

  const handleOrderStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  const handleStartBreak = (waiterId: number) => {
    setWaiters(waiters.map(waiter => {
      if (waiter.id === waiterId) {
        return { ...waiter, status: "on-break", breakTime: new Date() };
      }
      return waiter;
    }));
  };

  const handleEndBreak = (waiterId: number) => {
    setWaiters(waiters.map(waiter => {
      if (waiter.id === waiterId) {
        return { ...waiter, status: "on-duty", breakTime: null };
      }
      return waiter;
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Restaurant Manager</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTableDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Table
          </Button>
          <Button onClick={() => setIsWaiterDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Waiter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <WaiterTable
            waiters={waiters}
            onToggleStatus={toggleWaiterStatus}
            onStartBreak={handleStartBreak}
            onEndBreak={handleEndBreak}
          />
        </TabsContent>

        <TabsContent value="tables">
          <TableGrid tables={tables} onTableAction={handleTableAction} />
        </TabsContent>

        <TabsContent value="orders">
          <QuickOrderStatus orders={orders} onStatusUpdate={handleOrderStatusUpdate} />
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4">
            {waiters.map(waiter => (
              <WaiterStats
                key={waiter.id}
                waiterId={waiter.id}
                stats={{
                  ordersCompleted: 25,
                  totalSales: 1250.50,
                  averageServiceTime: 20,
                  customerRating: waiter.performance || 0,
                }}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddWaiterDialog
        isOpen={isWaiterDialogOpen}
        onOpenChange={setIsWaiterDialogOpen}
        onAddWaiter={handleAddWaiter}
        tables={tables.map(t => `Table ${t.id}`)}
      />

      <AddTableDialog
        isOpen={isTableDialogOpen}
        onOpenChange={setIsTableDialogOpen}
        onAddTable={handleAddTable}
      />
    </div>
  );
}
