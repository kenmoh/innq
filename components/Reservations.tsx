'use client'
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import { CreateReservationDialog } from "@/components/reservations/CreateReservationDialog";

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

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: 1,
      customerName: "Michael Johnson",
      date: "2024-03-21",
      time: "19:00",
      guests: 4,
      children: 2,
      tableNumber: 12,
      status: "pending",
    },
    {
      id: 2,
      customerName: "Sarah Williams",
      date: "2024-03-21",
      time: "20:30",
      guests: 2,
      children: 0,
      tableNumber: 5,
      status: "pending",
    },
  ]);

  const { toast } = useToast();

  const handleAddReservation = (newReservation: Omit<Reservation, "id">) => {
    const reservation: Reservation = {
      id: reservations.length + 1,
      ...newReservation,
    };

    setReservations([...reservations, reservation]);
    toast({
      title: "Reservation Created",
      description: "New reservation has been added successfully",
    });
  };

  const handleUpdateStatus = (id: number, status: "completed" | "cancelled") => {
    setReservations(reservations.map(reservation =>
      reservation.id === id ? { ...reservation, status } : reservation
    ));

    toast({
      title: `Reservation ${status}`,
      description: `Reservation has been marked as ${status}`,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reservations</h1>
          <p className="text-muted-foreground">Manage restaurant reservations</p>
        </div>
        <CreateReservationDialog onCreateReservation={handleAddReservation} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
}