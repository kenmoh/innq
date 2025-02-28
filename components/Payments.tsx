'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: number;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  method: string;
  orderNumber: string;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    amount: 156.50,
    status: "completed",
    date: "2024-03-20",
    method: "Credit Card",
    orderNumber: "ORD-001",
  },
  {
    id: 2,
    amount: 89.99,
    status: "pending",
    date: "2024-03-20",
    method: "PayPal",
    orderNumber: "ORD-002",
  },
];

export default function Payments() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Payment History</h2>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4 md:grid-cols-3">
          {mockPayments.map((payment) => (
            <Card key={payment.id} className="shadow-none rounded-md border-[0.25px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{payment.orderNumber}</span>
                  <Badge
                    variant={
                      payment.status === "completed"
                        ? "default"
                        : payment.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p>${payment.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p>{payment.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p>{payment.method}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}