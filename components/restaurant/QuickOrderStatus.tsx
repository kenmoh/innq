import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  table: string;
  status: "pending" | "preparing" | "ready" | "served";
  items: string[];
  timeElapsed: number;
  isUrgent?: boolean;
}

interface QuickOrderStatusProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, newStatus: Order["status"]) => void;
}

export function QuickOrderStatus({ orders, onStatusUpdate }: QuickOrderStatusProps) {
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    onStatusUpdate(orderId, newStatus);
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const getNextStatus = (currentStatus: Order["status"]): Order["status"] | null => {
    const flow: Record<Order["status"], Order["status"] | null> = {
      pending: "preparing",
      preparing: "ready",
      ready: "served",
      served: null,
    };
    return flow[currentStatus];
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors: Record<Order["status"], string> = {
      pending: "bg-yellow-500 rounded-full",
      preparing: "bg-blue-500 rounded-full",
      ready: "bg-green-500 rounded-full",
      served: "bg-gray-500 rounded-full",
    };
    return colors[status];
  };

  return (
    <Card className="border-none">
      <CardHeader className=" px-0">
        <CardTitle >Active Orders</CardTitle>
      </CardHeader>
      <CardContent className=" px-0">
        <div className="gap-4 grid grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border  rounded-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Order #{order.id}</span>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  {order.isUrgent && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="text-sm text-gray-500">Table: {order.table}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {order.timeElapsed} min
                </div>
                <div className="text-sm text-gray-500">
                  Items: {order.items.join(", ")}
                </div>
              </div>

              {getNextStatus(order.status) && (
                <Button
                  size="sm"
                  onClick={() => {
                    const nextStatus = getNextStatus(order.status);
                    if (nextStatus) {
                      handleStatusUpdate(order.id, nextStatus);
                    }
                  }}
                >
                  Mark as {getNextStatus(order.status)}
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}