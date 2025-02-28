import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Reservation {
  id: number;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  children: number;
  tableNumber: number;
  status: "pending" | "completed" | "cancelled";
}

interface ReservationCardProps {
  reservation: Reservation;
  onUpdateStatus: (id: number, status: "completed" | "cancelled") => void;
}

export function ReservationCard({ reservation, onUpdateStatus }: ReservationCardProps) {
  return (
    <Card className="shadow-none rounded-md border-[0.25px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{reservation.customerName}</CardTitle>
          <Badge
            variant={
              reservation.status === "completed"
                ? "default"
                : reservation.status === "cancelled"
                  ? "destructive"
                  : "secondary"
            }
          >
            {reservation.status === "pending" && `Table ${reservation.tableNumber}`}
            {reservation.status === "completed" && "Completed"}
            {reservation.status === "cancelled" && "Cancelled"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p>{reservation.date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time</p>
            <p>{reservation.time}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Adults</p>
            <p>{reservation.guests}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Children</p>
            <p>{reservation.children}</p>
          </div>
        </div>
        {reservation.status === "pending" && (
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="w-full"
              onClick={() => onUpdateStatus(reservation.id, "completed")}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="w-full"
              onClick={() => onUpdateStatus(reservation.id, "cancelled")}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}