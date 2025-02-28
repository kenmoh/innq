import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Payment {
  id: number;
  customerName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  status: "successful" | "pending" | "failed";
  reference: string;
}

interface PaymentCardProps {
  payment: Payment;
}

export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <Card className="shadow-none rounded-md dark:bg-[#3f3f46] dark:text-white border-[0.25px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{payment.customerName}</CardTitle>
          <Badge
            variant={
              payment.status === "successful"
                ? "default"
                : payment.status === "failed"
                  ? "destructive"
                  : "secondary"
            }
          >
            {payment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-semibold">{formatCurrency(payment.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p>{payment.date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p>{payment.paymentMethod}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reference</p>
            <p className="font-mono text-sm">{payment.reference}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}