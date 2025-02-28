import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, Star, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface WaiterTableProps {
  waiters: Waiter[];
  onToggleStatus: (id: number) => void;
  onStartBreak?: (id: number) => void;
  onEndBreak?: (id: number) => void;
}

export function WaiterTable({ waiters, onToggleStatus, onStartBreak, onEndBreak }: WaiterTableProps) {
  const { toast } = useToast();

  const handleBreak = (waiterId: number, isStarting: boolean) => {
    if (isStarting) {
      onStartBreak?.(waiterId);
      toast({
        title: "Break Started",
        description: "Break time has been logged",
      });
    } else {
      onEndBreak?.(waiterId);
      toast({
        title: "Break Ended",
        description: "Break time has been recorded",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "on-duty":
        return "default";
      case "off-duty":
        return "secondary";
      case "on-break":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatBreakTime = (date: Date | null | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString();
  };

  return (
    <div className="rounded-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Assigned Tables</TableHead>
            <TableHead>Performance</TableHead>
            <TableHead>Break</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {waiters.map((waiter) => (
            <TableRow key={waiter.id}>
              <TableCell className="font-medium">{waiter.name}</TableCell>
              <TableCell>
                <Badge
                  variant={getStatusBadgeVariant(waiter.status)}
                  className="cursor-pointer"
                  onClick={() => onToggleStatus(waiter.id)}
                >
                  {waiter.status === "on-duty" ? "On Duty" :
                    waiter.status === "off-duty" ? "Off Duty" : "On Break"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3 inline" />
                  {waiter.shift}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {waiter.assignedTables.map((table) => (
                    <Badge key={table} variant="secondary">
                      {table}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${index < (waiter.performance || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {waiter.status === "on-break" ? (
                  <Badge variant="warning">
                    <Timer className="mr-1 h-3 w-3 inline" />
                    {formatBreakTime(waiter.breakTime)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBreak(waiter.id, waiter.status !== "on-break")}
                  disabled={waiter.status === "off-duty"}
                >
                  <Coffee className="h-4 w-4 mr-1" />
                  {waiter.status === "on-break" ? "End Break" : "Start Break"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}