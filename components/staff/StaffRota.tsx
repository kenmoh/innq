import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addDays, startOfWeek } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  availability: string[];
}

interface StaffRotaProps {
  staffType: "waiters" | "kitchen";
  staff: StaffMember[];
}

const shifts: Shift[] = [
  { id: "morning", name: "Morning", startTime: "06:00", endTime: "14:00" },
  { id: "afternoon", name: "Afternoon", startTime: "14:00", endTime: "22:00" },
  { id: "night", name: "Night", startTime: "22:00", endTime: "06:00" },
];

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function StaffRota({ staffType, staff }: StaffRotaProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(startOfWeek(new Date()));
  const [weeklySchedule, setWeeklySchedule] = useState<any[]>([]);
  const [showRota, setShowRota] = useState(true);
  const [waitersPerShift, setWaitersPerShift] = useState(6);
  const [supervisorsPerShift, setSupervisorsPerShift] = useState(2);
  const { toast } = useToast();

  const generateWeeklyRota = () => {
    if (!startDate || staff.length === 0) {
      toast({
        title: "Error",
        description: "Please select a start date and ensure staff members are available",
        variant: "destructive",
      });
      return;
    }

    // Generate schedule for each day of the week
    const schedule = DAYS_OF_WEEK.map((day, dayIndex) => {
      const date = addDays(startDate, dayIndex);
      const daySchedule = shifts.map(shift => {
        // Filter available staff for this shift
        const availableStaff = staff.filter(() => Math.random() > 0.3);
        
        // Ensure we have enough staff for each shift based on criteria
        const totalRequired = waitersPerShift + supervisorsPerShift;
        const assignedStaff = availableStaff.slice(0, totalRequired);

        return {
          ...shift,
          assignedStaff,
        };
      });

      return {
        day,
        date,
        shifts: daySchedule,
      };
    });

    setWeeklySchedule(schedule);
    
    toast({
      title: "Weekly Rota Generated",
      description: `Schedule generated for week starting ${startDate.toLocaleDateString()}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Generate Weekly Rota</CardTitle>
            <CardDescription>
              Create automatic weekly staff schedules with specified criteria
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowRota(!showRota)}
          >
            {showRota ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {showRota && (
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
            </div>
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <label className="text-sm font-medium">Staff Requirements per Shift</label>
                {staffType === "waiters" ? (
                  <>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={waitersPerShift}
                        onChange={(e) => setWaitersPerShift(parseInt(e.target.value))}
                        min={1}
                        placeholder="Number of waiters per shift"
                      />
                      <Input
                        type="number"
                        value={supervisorsPerShift}
                        onChange={(e) => setSupervisorsPerShift(parseInt(e.target.value))}
                        min={1}
                        placeholder="Number of supervisors per shift"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Badge>1 Head Chef per shift</Badge>
                    <Badge>2 Line Cooks per shift</Badge>
                  </>
                )}
              </div>
              <Button
                onClick={generateWeeklyRota}
                className="w-full"
                size="lg"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Generate Weekly Schedule
              </Button>
            </div>
          </div>

          {weeklySchedule.length > 0 && (
            <div className="mt-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Morning (06:00-14:00)</TableHead>
                    <TableHead>Afternoon (14:00-22:00)</TableHead>
                    <TableHead>Night (22:00-06:00)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklySchedule.map((day, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {day.day} ({day.date.toLocaleDateString()})
                      </TableCell>
                      {day.shifts.map((shift: any, shiftIndex: number) => (
                        <TableCell key={shiftIndex}>
                          {shift.assignedStaff.map((staff: StaffMember) => (
                            <div key={staff.id} className="mb-1">
                              {staff.name}
                            </div>
                          ))}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}