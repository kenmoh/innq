'use client'
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Staff, LeaveApplication } from "@/types/staff";
import { Edit2, Loader2, RefreshCw, FileCheck, Calendar, Users } from "lucide-react";
import Link from "next/link";


type ShiftType = "morning" | "afternoon" | "night" | "off" | "leave";

interface RotaEntry {
  staffId: string;
  staffName: string;
  monday: ShiftType;
  tuesday: ShiftType;
  wednesday: ShiftType;
  thursday: ShiftType;
  friday: ShiftType;
  saturday: ShiftType;
  sunday: ShiftType;
}

interface RotaSettings {
  staffPerShift: number;
  offDaysPerStaff: number;
  preferredOffDays: string[];
}

// Mock data for staff members
const mockStaff: Staff[] = [
  { id: "1", name: "John Smith", email: "john@example.com", role: "Manager", department: "Main Branch", phone: "123-456-7890" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "Waiter", department: "Main Branch", phone: "123-456-7891" },
  { id: "3", name: "Mike Wilson", email: "mike@example.com", role: "Chef", department: "Downtown Branch", phone: "123-456-7892" },
  { id: "4", name: "Emily Davis", email: "emily@example.com", role: "Hostess", department: "Main Branch", phone: "123-456-7893" },
  { id: "5", name: "Robert Brown", email: "robert@example.com", role: "Bartender", department: "Downtown Branch", phone: "123-456-7894" },
  { id: "6", name: "Lisa Garcia", email: "lisa@example.com", role: "Waiter", department: "Main Branch", phone: "123-456-7895" },
  { id: "7", name: "David Martinez", email: "david@example.com", role: "Chef", department: "Downtown Branch", phone: "123-456-7896" },
  { id: "8", name: "Jennifer Taylor", email: "jennifer@example.com", role: "Cashier", department: "Main Branch", phone: "123-456-7897" },
];

// Mock data for leave applications
const mockLeaveApplications: LeaveApplication[] = [
  {
    id: "1",
    staffId: "2",
    staffName: "Sarah Johnson",
    startDate: new Date("2023-11-06"),
    endDate: new Date("2023-11-08"),
    type: "annual",
    status: "approved",
    reason: "Family vacation",
    days: 3,
    isPaid: true
  },
  {
    id: "2",
    staffId: "5",
    staffName: "Robert Brown",
    startDate: new Date("2023-11-10"),
    endDate: new Date("2023-11-10"),
    type: "sick",
    status: "approved",
    reason: "Doctor's appointment",
    days: 1,
    isPaid: true
  },
];

const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function Rota() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(mockLeaveApplications);
  const [rota, setRota] = useState<RotaEntry[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<{
    staffId: string;
    staffName: string;
    day: string;
    shift: ShiftType;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editShift, setEditShift] = useState<ShiftType>("morning");

  // Rota generation settings
  const [settings, setSettings] = useState<RotaSettings>({
    staffPerShift: 3,
    offDaysPerStaff: 2,
    preferredOffDays: ["saturday", "sunday"],
  });

  const handleSettingChange = (key: keyof RotaSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof RotaSettings) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      handleSettingChange(key, value);
    }
  };

  // Calculate shift statistics
  const calculateShiftStats = () => {
    if (rota.length === 0) return null;

    let morningCount = 0;
    let afternoonCount = 0;
    let nightCount = 0;
    let offCount = 0;
    let leaveCount = 0;

    rota.forEach(staffRota => {
      weekdays.forEach(day => {
        const shift = staffRota[day as keyof RotaEntry] as ShiftType;
        if (shift === "morning") morningCount++;
        if (shift === "afternoon") afternoonCount++;
        if (shift === "night") nightCount++;
        if (shift === "off") offCount++;
        if (shift === "leave") leaveCount++;
      });
    });

    return {
      morning: morningCount,
      afternoon: afternoonCount,
      night: nightCount,
      off: offCount,
      leave: leaveCount,
      total: morningCount + afternoonCount + nightCount + offCount + leaveCount
    };
  };

  const generateRota = () => {
    setIsGenerating(true);

    // This would normally be a more complex algorithm
    // For demo purposes, we'll use a simplified approach

    const newRota: RotaEntry[] = [];

    // Create initial rota with all staff working morning shifts
    staff.forEach((staffMember) => {
      const rotaEntry: RotaEntry = {
        staffId: staffMember.id,
        staffName: staffMember.name,
        monday: "morning",
        tuesday: "morning",
        wednesday: "morning",
        thursday: "morning",
        friday: "morning",
        saturday: "morning",
        sunday: "morning",
      };

      // Apply leave days from approved leave applications
      leaveApplications.forEach((leave) => {
        if (leave.staffId === staffMember.id && leave.status === "approved") {
          const startDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);
          const currentDate = new Date(startDate);

          while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            const dayName = weekdays[dayOfWeek === 0 ? 6 : dayOfWeek - 1] as keyof RotaEntry;

            if (dayName in rotaEntry) {
              rotaEntry[dayName] = "leave";
            }

            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });

      // Assign off days based on settings
      const offDaysToAssign = settings.offDaysPerStaff;
      const availableDays = weekdays.filter(day =>
        (rotaEntry[day as keyof RotaEntry] !== "leave")
      );

      // Prioritize preferred off days first
      const preferredAvailableDays = settings.preferredOffDays.filter(
        day => availableDays.includes(day) && rotaEntry[day as keyof RotaEntry] !== "leave"
      );

      // Assign preferred off days first, then random days if needed
      const daysToMakeOff = [
        ...preferredAvailableDays,
        ...availableDays.filter(day => !preferredAvailableDays.includes(day))
      ].slice(0, offDaysToAssign);

      daysToMakeOff.forEach(day => {
        rotaEntry[day as keyof RotaEntry] = "off";
      });

      // Distribute shifts (morning, afternoon, night) among working days
      const shiftTypes: ShiftType[] = ["morning", "afternoon", "night"];
      let shiftIndex = 0;

      weekdays.forEach(day => {
        if (rotaEntry[day as keyof RotaEntry] !== "off" && rotaEntry[day as keyof RotaEntry] !== "leave") {
          rotaEntry[day as keyof RotaEntry] = shiftTypes[shiftIndex % shiftTypes.length];
          shiftIndex++;
        }
      });

      newRota.push(rotaEntry);
    });

    // Balance staff per shift
    // This is a simplified approach - a real implementation would be more complex
    weekdays.forEach(day => {
      const dayKey = day as keyof RotaEntry;

      const morningStaff = newRota.filter(entry => entry[dayKey] === "morning").length;
      const afternoonStaff = newRota.filter(entry => entry[dayKey] === "afternoon").length;
      const nightStaff = newRota.filter(entry => entry[dayKey] === "night").length;

      // Try to balance shifts if possible
      if (morningStaff > settings.staffPerShift && afternoonStaff < settings.staffPerShift) {
        const staffToMove = newRota.find(entry => entry[dayKey] === "morning" && !isLeaveDay(entry.staffId, day));
        if (staffToMove) {
          staffToMove[dayKey] = "afternoon";
        }
      }

      if (morningStaff > settings.staffPerShift && nightStaff < settings.staffPerShift) {
        const staffToMove = newRota.find(entry => entry[dayKey] === "morning" && !isLeaveDay(entry.staffId, day));
        if (staffToMove) {
          staffToMove[dayKey] = "night";
        }
      }

      if (afternoonStaff > settings.staffPerShift && nightStaff < settings.staffPerShift) {
        const staffToMove = newRota.find(entry => entry[dayKey] === "afternoon" && !isLeaveDay(entry.staffId, day));
        if (staffToMove) {
          staffToMove[dayKey] = "night";
        }
      }
    });

    setTimeout(() => {
      setRota(newRota);
      setIsGenerating(false);
      toast({
        title: "Rota Generated",
        description: "The staff rota has been generated successfully.",
      });
    }, 1000); // Simulate loading
  };

  const isLeaveDay = (staffId: string, day: string) => {
    const staffLeaves = leaveApplications.filter(
      leave => leave.staffId === staffId && leave.status === "approved"
    );

    return staffLeaves.some(leave => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        const dayName = weekdays[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

        if (dayName === day) {
          return true;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return false;
    });
  };

  const handleCellClick = (staffId: string, staffName: string, day: string) => {
    const staffRota = rota.find(r => r.staffId === staffId);
    if (staffRota) {
      setSelectedStaff({
        staffId,
        staffName,
        day,
        shift: staffRota[day as keyof RotaEntry] as ShiftType,
      });
      setEditShift(staffRota[day as keyof RotaEntry] as ShiftType);
      setDialogOpen(true);
    }
  };

  const handleUpdateShift = () => {
    if (!selectedStaff) return;

    setRota(currentRota =>
      currentRota.map(entry => {
        if (entry.staffId === selectedStaff.staffId) {
          return {
            ...entry,
            [selectedStaff.day]: editShift,
          };
        }
        return entry;
      })
    );

    toast({
      title: "Shift Updated",
      description: `${selectedStaff.staffName}'s shift for ${selectedStaff.day} has been updated to ${editShift}.`,
    });

    setDialogOpen(false);
  };

  const getShiftBadgeColor = (shift: ShiftType) => {
    switch (shift) {
      case "morning":
        return "bg-blue-900/20 text-blue-800 rounded-full hover:text-white h-8 hover:bg-blue-900 border border-blue-600 border-2";
      case "afternoon":
        return "bg-amber-900/20 text-amber-800 hover:bg-amber-900 border border-amber-600 rounded-full hover:text-white h-8 border-2";
      case "night":
        return "bg-teal-900/20 text-teal-800 hover:bg-teal-900 border border-teal-600 rounded-full hover:text-white h-8 border-2";
      case "off":
        return "bg-gray-900/20 text-gray-800 hover:bg-gray-900 border border-gray-600 rounded-full hover:text-white h-8 border-2";
      case "leave":
        return "bg-red-900/20 text-red-800 hover:bg-red-900 border border-red-600 rounded-full hover:text-white h-8 border-2";
      default:
        return "";
    }
  };

  // Statistics about the generated rota
  const shiftStats = calculateShiftStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Rota Management</h1>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/attendance">
              <FileCheck className="mr-2 h-4 w-4" />
              View Attendance
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/payroll">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Payroll
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-sm shadow-none">
          <CardHeader>
            <CardTitle>Rota Settings</CardTitle>
            <CardDescription>Configure your rota generation parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staffPerShift">Staff Per Shift</Label>
              <Input
                id="staffPerShift"
                type="number"
                value={settings.staffPerShift}
                onChange={(e) => handleNumberInputChange(e, "staffPerShift")}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="offDaysPerStaff">Off Days Per Staff</Label>
              <Input
                id="offDaysPerStaff"
                type="number"
                value={settings.offDaysPerStaff}
                onChange={(e) => handleNumberInputChange(e, "offDaysPerStaff")}
                min={0}
                max={7}
              />
            </div>
            <div className="space-y-2">
              <Label>Preferred Off Days</Label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <Badge
                    key={day}
                    variant={settings.preferredOffDays.includes(day) ? "default" : "outline"}
                    className={`cursor-pointer ${settings.preferredOffDays.includes(day) ? "bg-blue-900/20 rounded-full text-blue-700 hover:bg-blue-800 h-8" : "rounded-full"}`}
                    onClick={() => {
                      if (settings.preferredOffDays.includes(day)) {
                        handleSettingChange(
                          "preferredOffDays",
                          settings.preferredOffDays.filter((d) => d !== day)
                        );
                      } else {
                        handleSettingChange(
                          "preferredOffDays",
                          [...settings.preferredOffDays, day]
                        );
                      }
                    }}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              onClick={generateRota}
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Rota
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-sm shadow-none">
          <CardHeader>
            <CardTitle>Staff on Leave</CardTitle>
            <CardDescription>Currently approved leave applications</CardDescription>
          </CardHeader>
          <CardContent>
            {leaveApplications.filter(leave => leave.status === "approved").length > 0 ? (
              <div className="space-y-4">
                {leaveApplications
                  .filter(leave => leave.status === "approved")
                  .map(leave => (
                    <div key={leave.id} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{leave.staffName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-green-900/10 text-green-700 py-1 rounded-full border-2 border-green-900">{leave.type.toUpperCase()}</Badge>
                    </div>
                  ))
                }
              </div>
            ) : (
              <p className="text-muted-foreground">No staff members currently on leave</p>
            )}
          </CardContent>
        </Card>
      </div>

      {rota.length > 0 && (
        <Card className="rounded-sm shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Rota</CardTitle>
              <CardDescription>Click on a cell to edit a staff member's shift</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Export Rota for Attendance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Staff schedule for the week</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Staff</TableHead>
                    {weekdays.map((day) => (
                      <TableHead key={day} className="text-center">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rota.map((staffRota) => (
                    <TableRow key={staffRota.staffId}>
                      <TableCell className="font-medium">{staffRota.staffName}</TableCell>
                      {weekdays.map((day) => {
                        const shift = staffRota[day as keyof RotaEntry] as ShiftType;
                        return (
                          <TableCell
                            key={day}
                            className="text-center cursor-pointer"
                            onClick={() => handleCellClick(staffRota.staffId, staffRota.staffName, day)}
                          >
                            <Badge className={getShiftBadgeColor(shift)}>
                              {shift.charAt(0).toUpperCase() + shift.slice(1)}
                              <Edit2 className="h-3 w-3 ml-1" />
                            </Badge>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          {shiftStats && (
            <CardFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                <div className="text-sm font-medium">Shift Distribution Statistics</div>
                <div className="grid grid-cols-5 gap-2">
                  <div className="rounded-md p-4 bg-blue-900/5 text-blue-800  border-blue-600 border-2">
                    <div className="text-lg text-muted-foreground">Morning</div>
                    <div className="text-xl font-semibold text-blue-700">{shiftStats.morning}</div>
                    <Badge className="bg-blue-900/50 text-blue-700 text-xl">
                      {Math.round((shiftStats.morning / shiftStats.total) * 100)}%
                    </Badge>
                  </div>
                  <div className="rounded-md p-4 bg-amber-900/5 border-amber-600 border-[0.5px] text-amber-800 ">
                    <div className="text-lg text-muted-foreground">Afternoon</div>
                    <div className="text-lg font-semibold text-amber-700">{shiftStats.afternoon}</div>
                    <Badge className="bg-amber-900/50 text-amber-700 text-xl">
                      {Math.round((shiftStats.afternoon / shiftStats.total) * 100)}%
                    </Badge>
                  </div>
                  <div className="rounded-md p-4 bg-teal-900/5 border-[0.5px] border-teal-600 text-teal-800">
                    <div className="text-lg text-muted-foreground">Night</div>
                    <div className="text-lg font-semibold text-teal-700">{shiftStats.night}</div>
                    <Badge className="bg-teal-900/50 text-teal-700 text-xl">
                      {Math.round((shiftStats.night / shiftStats.total) * 100)}%
                    </Badge>
                  </div>
                  <div className="rounded-md p-4 bg-gray-900/5 border-gray-600 border-[0.5px] text-gray-800">
                    <div className="text-lg text-muted-foreground">Off</div>
                    <div className="text-lg font-semibold text-gray-700">{shiftStats.off}</div>
                    <Badge className="bg-gray-900/50 text-gray-700 text-xl">
                      {Math.round((shiftStats.off / shiftStats.total) * 100)}%
                    </Badge>
                  </div>
                  <div className="rounded-md p-2 bg-red-900/5 border-[0.5px] border-red-600">
                    <div className="text-lg text-muted-foreground">Leave</div>
                    <div className="text-lg font-semibold text-red-700">{shiftStats.leave}</div>
                    <Badge className="bg-red-900/50 text-xl text-red-700">
                      {Math.round((shiftStats.leave / shiftStats.total) * 100)}%
                    </Badge>
                  </div>
                </div>
                <div className="border-t pt-2 text-sm text-muted-foreground">
                  This rota information can be exported to the attendance and payroll systems to ensure accurate tracking of working hours and leave.
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shift</DialogTitle>
            <DialogDescription>
              Update {selectedStaff?.staffName}'s shift for {selectedStaff?.day}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shift">Shift</Label>
              <Select
                value={editShift}
                onValueChange={(value) => setEditShift(value as ShiftType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="night">Night</SelectItem>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateShift}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
