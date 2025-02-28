import { useState } from "react";
import { WaiterTable } from "@/components/restaurant/WaiterTable";
import { StaffRota } from "@/components/staff/StaffRota";
import { useToast } from "@/hooks/use-toast";

interface Waiter {
  id: number;
  name: string;
  status: "on-duty" | "off-duty" | "on-break";
  assignedTables: string[];
  shift: string;
  performance: number;
  breakTime?: Date | null;
}

const initialWaiters: Waiter[] = [
  {
    id: 1,
    name: "John Smith",
    status: "on-duty",
    assignedTables: ["12", "15", "18"],
    shift: "Morning",
    performance: 4,
    breakTime: null,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    status: "on-break",
    assignedTables: ["21", "23"],
    shift: "Morning",
    performance: 5,
    breakTime: new Date(),
  },
  {
    id: 3,
    name: "Mike Wilson",
    status: "off-duty",
    assignedTables: [],
    shift: "Evening",
    performance: 4,
    breakTime: null,
  },
];

export default function Waiters() {
  const [waiters, setWaiters] = useState<Waiter[]>(initialWaiters);
  const { toast } = useToast();

  const handleToggleStatus = (id: number) => {
    setWaiters(currentWaiters =>
      currentWaiters.map(waiter => {
        if (waiter.id === id) {
          const newStatus = waiter.status === "on-duty" ? "off-duty" : "on-duty";
          return {
            ...waiter,
            status: newStatus,
            breakTime: null,
            assignedTables: newStatus === "off-duty" ? [] : waiter.assignedTables
          };
        }
        return waiter;
      })
    );
  };

  const handleStartBreak = (id: number) => {
    setWaiters(currentWaiters =>
      currentWaiters.map(waiter => {
        if (waiter.id === id) {
          return {
            ...waiter,
            status: "on-break" as const,
            breakTime: new Date()
          };
        }
        return waiter;
      })
    );
  };

  const handleEndBreak = (id: number) => {
    setWaiters(currentWaiters =>
      currentWaiters.map(waiter => {
        if (waiter.id === id) {
          return {
            ...waiter,
            status: "on-duty" as const,
            breakTime: null
          };
        }
        return waiter;
      })
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Waiters Management</h2>
      </div>

      <StaffRota
        staffType="waiters"
        staff={waiters.map(w => ({
          id: w.id.toString(),
          name: w.name,
          role: "Waiter",
          availability: ["morning", "afternoon", "night"],
        }))}
      />

      <WaiterTable
        waiters={waiters}
        onToggleStatus={handleToggleStatus}
        onStartBreak={handleStartBreak}
        onEndBreak={handleEndBreak}
      />
    </div>
  );
}