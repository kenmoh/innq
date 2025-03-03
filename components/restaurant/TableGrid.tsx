import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Coffee, Utensils } from "lucide-react";

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

interface TableGridProps {
  tables: Table[];
  onTableAction: (tableId: string, action: "clean" | "clear" | "reserve" | "finish-cleaning") => void;
}

export function TableGrid({ tables, onTableAction }: TableGridProps) {
  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-blue-500";
      case "reserved":
        return "bg-yellow-500";
      case "cleaning":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => (
        <Card key={table.id} className="relative shadow-none rounded-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">Table {table.id}</h3>
              <Badge className={getStatusColor(table.status)}>
                {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-4 w-4 mr-2" />
                Capacity: {table.capacity}
              </div>

              {table.currentOrder && (
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500">
                    <Utensils className="h-4 w-4 mr-2" />
                    Items: {table.currentOrder.items}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Coffee className="h-4 w-4 mr-2" />
                    Time: {table.currentOrder.timeElapsed}min
                  </div>
                </div>
              )}

              {table.assignedWaiter && (
                <div className="text-sm text-gray-500">
                  Waiter: {table.assignedWaiter}
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              {table.status === "occupied" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTableAction(table.id, "clear")}
                >
                  Clear
                </Button>
              )}
              {table.status === "available" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTableAction(table.id, "reserve")}
                >
                  Reserve
                </Button>
              )}
              {(table.status === "occupied" || table.status === "reserved") && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTableAction(table.id, "clean")}
                >
                  Clean
                </Button>
              )}
              {table.status === "cleaning" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTableAction(table.id, "finish-cleaning")}
                >
                  Finish Cleaning
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}