'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Calculator, Download, FileText, Search, AlertCircle, Moon, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { StaffPayroll, PayrollPeriod, AttendanceRecord } from "@/types/staff";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { PayrollSummary } from "./staff/PayrollSummary";

export default function Payroll() {
  const [staffPayroll, setStaffPayroll] = useState<StaffPayroll[]>([
    {
      id: "1",
      name: "John Smith",
      role: "Waiter",
      payType: "hourly",
      rate: 15,
      hoursWorked: 78,
      daysWorked: 10,
      startDate: new Date(2023, 6, 15),
      status: "active",
      attendanceData: {
        present: 18,
        late: 2,
        absent: 1,
        onLeave: 0
      },
      latePenalty: 50,
      overtimeHours: 12,
      overtimeRate: 22.5,
      nightShifts: 4,
      nightShiftAllowance: 80,
      calculatedPay: {
        daily: 120,
        weekly: 600,
        monthly: 2400
      }
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Waitress",
      payType: "hourly",
      rate: 15,
      hoursWorked: 82,
      daysWorked: 11,
      startDate: new Date(2023, 5, 10),
      status: "active",
      attendanceData: {
        present: 20,
        late: 1,
        absent: 0,
        onLeave: 0
      },
      latePenalty: 25,
      overtimeHours: 8,
      overtimeRate: 22.5,
      nightShifts: 3,
      nightShiftAllowance: 60,
      calculatedPay: {
        daily: 120,
        weekly: 600,
        monthly: 2600
      }
    },
    {
      id: "3",
      name: "Mike Wilson",
      role: "Manager",
      payType: "monthly",
      rate: 4500,
      daysWorked: 21,
      startDate: new Date(2023, 2, 5),
      status: "active",
      attendanceData: {
        present: 19,
        late: 0,
        absent: 0,
        onLeave: 2
      },
      latePenalty: 0,
      overtimeHours: 0,
      overtimeRate: 0,
      nightShifts: 0,
      nightShiftAllowance: 0,
      calculatedPay: {
        daily: 214.29,
        weekly: 1071.43,
        monthly: 4500
      }
    },
    {
      id: "4",
      name: "Emily Davis",
      role: "Chef",
      payType: "monthly",
      rate: 3800,
      daysWorked: 20,
      startDate: new Date(2023, 3, 20),
      status: "active",
      attendanceData: {
        present: 17,
        late: 3,
        absent: 1,
        onLeave: 0
      },
      latePenalty: 150,
      overtimeHours: 15,
      overtimeRate: 25.5,
      nightShifts: 6,
      nightShiftAllowance: 150,
      calculatedPay: {
        daily: 180.95,
        weekly: 904.76,
        monthly: 3650
      }
    },
  ]);

  const [payrollPeriods] = useState<PayrollPeriod[]>([
    {
      id: "1",
      startDate: new Date(2024, 4, 1),
      endDate: new Date(2024, 4, 15),
      status: "paid",
      totalAmount: 12750,
    },
    {
      id: "2",
      startDate: new Date(2024, 3, 16),
      endDate: new Date(2024, 3, 30),
      status: "paid",
      totalAmount: 12580,
    },
    {
      id: "3",
      startDate: new Date(2024, 3, 1),
      endDate: new Date(2024, 3, 15),
      status: "paid",
      totalAmount: 12680,
    },
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [staffId, setStaffId] = useState("");
  const [payType, setPayType] = useState<"hourly" | "monthly">("hourly");
  const [rate, setRate] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [overtimeRate, setOvertimeRate] = useState<string>("");
  const [nightShiftAllowance, setNightShiftAllowance] = useState<string>("");

  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [reportStartDate, setReportStartDate] = useState<Date>(new Date());

  const { toast } = useToast();

  // Calculate total pay for a staff member
  const calculatePay = (staff: StaffPayroll, period: "daily" | "weekly" | "monthly") => {
    // Apply late penalty: $25 per late instance
    const latePenalty = (staff.attendanceData?.late || 0) * 25;

    let basePay = 0;

    if (staff.payType === "hourly") {
      // For hourly workers
      switch (period) {
        case "daily":
          basePay = staff.hoursWorked ? (staff.hoursWorked / staff.daysWorked!) * staff.rate : 0;
          break;
        case "weekly":
          // Assuming 2 weeks period for calculation
          basePay = staff.hoursWorked ? (staff.hoursWorked / 2) * staff.rate : 0;
          break;
        case "monthly":
          basePay = staff.hoursWorked ? staff.hoursWorked * staff.rate : 0;
          break;
      }
    } else {
      // For monthly workers
      switch (period) {
        case "daily":
          basePay = staff.rate / 22; // Assuming 22 working days
          break;
        case "weekly":
          basePay = (staff.rate / 22) * 5; // 5 days in a week
          break;
        case "monthly":
          basePay = staff.rate;
          break;
      }
    }

    // Calculate overtime pay
    let overtimePay = 0;
    if (staff.overtimeHours && staff.overtimeHours > 0) {
      const overtimeRateValue = staff.overtimeRate || staff.rate * 1.5;
      switch (period) {
        case "daily":
          overtimePay = (staff.overtimeHours / 22) * overtimeRateValue;
          break;
        case "weekly":
          overtimePay = (staff.overtimeHours / 4) * overtimeRateValue;
          break;
        case "monthly":
          overtimePay = staff.overtimeHours * overtimeRateValue;
          break;
      }
    }

    // Calculate night shift allowance
    let nightShiftPay = 0;
    if (staff.nightShifts && staff.nightShifts > 0 && staff.nightShiftAllowance) {
      switch (period) {
        case "daily":
          nightShiftPay = (staff.nightShiftAllowance / 22);
          break;
        case "weekly":
          nightShiftPay = (staff.nightShiftAllowance / 4);
          break;
        case "monthly":
          nightShiftPay = staff.nightShiftAllowance;
          break;
      }
    }

    // Apply penalty based on the period
    let periodPenalty = 0;
    switch (period) {
      case "daily":
        periodPenalty = latePenalty / 22;
        break;
      case "weekly":
        periodPenalty = latePenalty / 4;
        break;
      case "monthly":
        periodPenalty = latePenalty;
        break;
    }

    return Math.max(0, basePay + overtimePay + nightShiftPay - periodPenalty);
  };

  // Update staff rate and recalculate pay
  const handleUpdateRate = (staffId: string, newRate: number) => {
    setStaffPayroll((prev) =>
      prev.map((staff) => {
        if (staff.id === staffId) {
          // Recalculate pay with new rate
          const updatedStaff = { ...staff, rate: newRate };

          // Calculate new pay values
          const daily = calculatePay(updatedStaff, "daily");
          const weekly = calculatePay(updatedStaff, "weekly");
          const monthly = calculatePay(updatedStaff, "monthly");

          return {
            ...updatedStaff,
            calculatedPay: {
              daily,
              weekly,
              monthly
            }
          };
        }
        return staff;
      })
    );

    toast({
      title: "Rate Updated",
      description: "The payment rate has been updated successfully",
    });
  };

  // Update overtime rate
  const handleUpdateOvertimeRate = (staffId: string, newRate: number) => {
    setStaffPayroll((prev) =>
      prev.map((staff) => {
        if (staff.id === staffId) {
          // Recalculate pay with new overtime rate
          const updatedStaff = { ...staff, overtimeRate: newRate };

          // Calculate new pay values
          const daily = calculatePay(updatedStaff, "daily");
          const weekly = calculatePay(updatedStaff, "weekly");
          const monthly = calculatePay(updatedStaff, "monthly");

          return {
            ...updatedStaff,
            calculatedPay: {
              daily,
              weekly,
              monthly
            }
          };
        }
        return staff;
      })
    );

    toast({
      title: "Overtime Rate Updated",
      description: "The overtime rate has been updated successfully",
    });
  };

  // Update night shift allowance
  const handleUpdateNightShiftAllowance = (staffId: string, newAllowance: number) => {
    setStaffPayroll((prev) =>
      prev.map((staff) => {
        if (staff.id === staffId) {
          // Recalculate pay with new night shift allowance
          const updatedStaff = { ...staff, nightShiftAllowance: newAllowance };

          // Calculate new pay values
          const daily = calculatePay(updatedStaff, "daily");
          const weekly = calculatePay(updatedStaff, "weekly");
          const monthly = calculatePay(updatedStaff, "monthly");

          return {
            ...updatedStaff,
            calculatedPay: {
              daily,
              weekly,
              monthly
            }
          };
        }
        return staff;
      })
    );

    toast({
      title: "Night Shift Allowance Updated",
      description: "The night shift allowance has been updated successfully",
    });
  };

  // Add new staff to payroll
  const handleAddStaffPayroll = () => {
    if (!staffId || !rate || isNaN(Number(rate)) || Number(rate) <= 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields with valid values",
        variant: "destructive",
      });
      return;
    }

    // Find a sample staff to use (in a real app, we'd get this from the database)
    const sampleStaff = [
      { id: "5", name: "Robert Brown", role: "Bartender" },
      { id: "6", name: "Laura White", role: "Receptionist" },
      { id: "7", name: "James Taylor", role: "Security" },
    ].find(s => s.id === staffId);

    if (!sampleStaff) {
      toast({
        title: "Error",
        description: "Staff not found",
        variant: "destructive",
      });
      return;
    }

    const numericRate = Number(rate);
    const hoursWorked = payType === "hourly" ? 160 : undefined;

    // Process overtime rate and night shift allowance
    const numericOvertimeRate = overtimeRate ? Number(overtimeRate) : (payType === "hourly" ? numericRate * 1.5 : 0);
    const numericNightShiftAllowance = nightShiftAllowance ? Number(nightShiftAllowance) : 0;

    // Mock attendance data
    const attendanceData = {
      present: 15,
      late: 2,
      absent: 1,
      onLeave: 0,
    };

    // Calculate late penalty - $25 per late instance
    const latePenalty = attendanceData.late * 25;

    // Mock overtime and night shift data
    const overtimeHours = payType === "hourly" ? 10 : 0;
    const nightShifts = 2;

    // Calculate pay based on type
    let calculatedPay;
    if (payType === "hourly") {
      // Base pay + overtime - late penalties
      const overtimePay = overtimeHours * numericOvertimeRate;
      calculatedPay = {
        daily: ((hoursWorked! / 22) * numericRate + (overtimePay / 22) + (numericNightShiftAllowance / 22)) - (latePenalty / 22),
        weekly: ((hoursWorked! / 4) * numericRate + (overtimePay / 4) + (numericNightShiftAllowance / 4)) - (latePenalty / 4),
        monthly: (hoursWorked! * numericRate + overtimePay + numericNightShiftAllowance) - latePenalty
      };
    } else {
      // Monthly salary + night shift allowance - late penalties
      calculatedPay = {
        daily: (numericRate / 22 + (numericNightShiftAllowance / 22)) - (latePenalty / 22),
        weekly: ((numericRate / 22) * 5 + (numericNightShiftAllowance / 4)) - (latePenalty / 4),
        monthly: (numericRate + numericNightShiftAllowance) - latePenalty
      };
    }

    const newStaffPayroll: StaffPayroll = {
      id: sampleStaff.id,
      name: sampleStaff.name,
      role: sampleStaff.role,
      payType,
      rate: numericRate,
      hoursWorked,
      daysWorked: 22,
      startDate,
      status: "active",
      attendanceData,
      latePenalty,
      overtimeHours,
      overtimeRate: numericOvertimeRate,
      nightShifts,
      nightShiftAllowance: numericNightShiftAllowance,
      calculatedPay
    };

    setStaffPayroll((prev) => [...prev, newStaffPayroll]);

    // Reset form
    setStaffId("");
    setPayType("hourly");
    setRate("");
    setOvertimeRate("");
    setNightShiftAllowance("");
    setStartDate(new Date());

    toast({
      title: "Staff Added",
      description: "Staff has been added to payroll successfully",
    });
  };

  // Generate payroll report
  const handleGenerateReport = () => {
    // Calculate total payroll for the selected period
    let totalPayroll = 0;
    let totalOvertime = 0;
    let totalNightShift = 0;
    let totalLatePenalties = 0;

    const payrollData = staffPayroll.map(staff => {
      let pay = 0;
      switch (reportType) {
        case "daily":
          pay = staff.calculatedPay?.daily || calculatePay(staff, "daily");
          break;
        case "weekly":
          pay = staff.calculatedPay?.weekly || calculatePay(staff, "weekly");
          break;
        case "monthly":
          pay = staff.calculatedPay?.monthly || calculatePay(staff, "monthly");
          break;
      }

      totalPayroll += pay;

      // Calculate component values
      const overtimeValue = staff.overtimeHours && staff.overtimeRate ?
        (reportType === "daily" ? (staff.overtimeHours * staff.overtimeRate) / 22 :
          reportType === "weekly" ? (staff.overtimeHours * staff.overtimeRate) / 4 :
            staff.overtimeHours * staff.overtimeRate) : 0;

      const nightShiftValue = staff.nightShiftAllowance ?
        (reportType === "daily" ? staff.nightShiftAllowance / 22 :
          reportType === "weekly" ? staff.nightShiftAllowance / 4 :
            staff.nightShiftAllowance) : 0;

      const latePenaltyValue = staff.latePenalty ?
        (reportType === "daily" ? staff.latePenalty / 22 :
          reportType === "weekly" ? staff.latePenalty / 4 :
            staff.latePenalty) : 0;

      totalOvertime += overtimeValue;
      totalNightShift += nightShiftValue;
      totalLatePenalties += latePenaltyValue;

      return {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        payType: staff.payType,
        rate: staff.rate,
        pay,
        overtime: overtimeValue,
        nightShift: nightShiftValue,
        latePenalty: latePenaltyValue,
        attendanceData: staff.attendanceData,
      };
    });

    const reportData = {
      type: reportType,
      date: reportStartDate,
      totalPayroll,
      totalOvertime,
      totalNightShift,
      totalLatePenalties,
      netPayroll: totalPayroll,
      payrollData
    };

    // Log the report data (in a real app, you might send this to an API)
    console.log("Generated payroll report:", reportData);

    toast({
      title: "Report Generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated for ${format(reportStartDate, "PPP")}. Total payroll: $${totalPayroll.toFixed(2)}`,
    });

    // Show download toast after a short delay to simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your payroll report PDF is ready for download",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Downloading report:", reportData);
              toast({
                title: "Download Started",
                description: "Your report is being downloaded"
              });
            }}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        ),
      });
    }, 1500);
  };

  // Calculate pay for staff member
  const handleCalculatePay = (staff: StaffPayroll) => {
    // Recalculate with current data
    const daily = calculatePay(staff, "daily");
    const weekly = calculatePay(staff, "weekly");
    const monthly = calculatePay(staff, "monthly");

    // Update staff with calculated pay
    setStaffPayroll((prev) =>
      prev.map((s) =>
        s.id === staff.id ? {
          ...s,
          calculatedPay: {
            daily,
            weekly,
            monthly
          }
        } : s
      )
    );

    // Calculate the components for monthly pay
    const basePay = staff.payType === "hourly"
      ? (staff.hoursWorked || 0) * staff.rate
      : staff.rate;

    const overtimePay = (staff.overtimeHours || 0) * (staff.overtimeRate || (staff.rate * 1.5));
    const nightShiftPay = staff.nightShiftAllowance || 0;
    const latePenalty = staff.latePenalty || 0;

    // Show calculated pay in toast with breakdown
    toast({
      title: `Pay for ${staff.name}`,
      description: (
        <div className="mt-2 space-y-1 text-sm">
          <div className="grid grid-cols-2">
            <span>Base Pay:</span>
            <span className="text-right">${basePay.toFixed(2)}</span>
          </div>
          {overtimePay > 0 && (
            <div className="grid grid-cols-2">
              <span>Overtime:</span>
              <span className="text-right text-green-600">+${overtimePay.toFixed(2)}</span>
            </div>
          )}
          {nightShiftPay > 0 && (
            <div className="grid grid-cols-2">
              <span>Night Shift:</span>
              <span className="text-right text-green-600">+${nightShiftPay.toFixed(2)}</span>
            </div>
          )}
          {latePenalty > 0 && (
            <div className="grid grid-cols-2">
              <span>Late Penalty:</span>
              <span className="text-right text-red-600">-${latePenalty.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-1 grid grid-cols-2 font-medium">
            <span>Monthly Total:</span>
            <span className="text-right">${monthly.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 text-xs text-muted-foreground">
            <span>Weekly:</span>
            <span className="text-right">${weekly.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 text-xs text-muted-foreground">
            <span>Daily:</span>
            <span className="text-right">${daily.toFixed(2)}</span>
          </div>
        </div>
      ) as any,
    });
  };

  // Department distribution data for chart
  const departmentData = [
    { name: "Service", value: 12 },
    { name: "Kitchen", value: 8 },
    { name: "Management", value: 3 },
    { name: "Housekeeping", value: 7 },
  ];

  // Payroll trend data
  const payrollTrendData = [
    { month: "Jan", amount: 11500, overtime: 850, nightShift: 450 },
    { month: "Feb", amount: 12000, overtime: 920, nightShift: 480 },
    { month: "Mar", amount: 12300, overtime: 980, nightShift: 510 },
    { month: "Apr", amount: 12500, overtime: 1050, nightShift: 520 },
    { month: "May", amount: 12750, overtime: 1100, nightShift: 550 },
    { month: "Jun", amount: 13000, overtime: 1150, nightShift: 580 },
  ];

  // Attendance vs payroll data
  const attendancePayrollData = [
    { name: ">95%", payroll: 8500, staff: 15, efficiency: 98 },
    { name: "90-95%", payroll: 2500, staff: 5, efficiency: 92 },
    { name: "85-90%", payroll: 1500, staff: 3, efficiency: 87 },
    { name: "<85%", payroll: 750, staff: 2, efficiency: 80 },
  ];

  // Pay component breakdown data
  const payComponentData = [
    { name: "Base Salary", value: 10200 },
    { name: "Overtime", value: 1150 },
    { name: "Night Shift", value: 580 },
    { name: "Bonus", value: 800 },
    { name: "Deductions", value: -730 },
  ];

  // Staff performance radar data
  const staffPerformanceData = [
    { subject: 'Attendance', A: 95, B: 90, fullMark: 100 },
    { subject: 'Punctuality', A: 88, B: 85, fullMark: 100 },
    { subject: 'Customer Feedback', A: 92, B: 88, fullMark: 100 },
    { subject: 'Peer Review', A: 85, B: 90, fullMark: 100 },
    { subject: 'Efficiency', A: 90, B: 85, fullMark: 100 },
    { subject: 'Task Completion', A: 93, B: 89, fullMark: 100 },
  ];

  // Chart colors
  const COLORS = ["#8b5cf6", "#ec4899", "#6366f1", "#0284c7"];

  useEffect(() => {
    // Initialize with mock attendance data
    const today = new Date();
    const mockAttendanceRecords: AttendanceRecord[] = [
      {
        id: "1",
        staffId: "1",
        staffName: "John Smith",
        checkInTime: new Date(today.setHours(8, 45)),
        checkOutTime: new Date(today.setHours(17, 30)),
        status: "present",
        overtime: 1.5,
        nightShift: false
      },
      {
        id: "2",
        staffId: "2",
        staffName: "Sarah Johnson",
        checkInTime: new Date(today.setHours(9, 10)),
        checkOutTime: new Date(today.setHours(18, 0)),
        status: "present",
        overtime: 1,
        nightShift: false
      },
      {
        id: "3",
        staffId: "4",
        staffName: "Emily Davis",
        checkInTime: new Date(today.setHours(19, 45)),
        checkOutTime: new Date(today.setHours(4, 0)),
        status: "present",
        overtime: 0,
        nightShift: true
      },
    ];

    setAttendanceRecords(mockAttendanceRecords);

    // Calculate pay for all staff members on initial load
    setStaffPayroll(prev => prev.map(staff => {
      // Only calculate if not already calculated
      if (!staff.calculatedPay) {
        const daily = calculatePay(staff, "daily");
        const weekly = calculatePay(staff, "weekly");
        const monthly = calculatePay(staff, "monthly");

        return {
          ...staff,
          calculatedPay: { daily, weekly, monthly }
        };
      }
      return staff;
    }));
  }, []);

  // Filter staff by search term
  const filteredStaff = staffPayroll.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage staff payment rates and generate payroll reports</p>
        </div>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="staff">Staff Payroll</TabsTrigger>
          <TabsTrigger value="add">Add to Payroll</TabsTrigger>
          <TabsTrigger value="reports">Payroll Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <Card className="rounded-sm shadow-none">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Staff Payment Rates</CardTitle>
                <div className="flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  <Input
                    placeholder="Search staff..."
                    className="w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Pay Type</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Overtime & Night Shift</TableHead>
                    <TableHead>Work Details</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Calculated Pay</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell className="capitalize">{staff.payType}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={staff.rate}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (!isNaN(value) && value > 0) {
                                handleUpdateRate(staff.id, value);
                              }
                            }}
                            className="w-24"
                          />
                          <span>{staff.payType === "hourly" ? "/hr" : "/mo"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Timer className="h-3 w-3 text-blue-500" />
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={staff.overtimeRate || 0}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!isNaN(value) && value >= 0) {
                                    handleUpdateOvertimeRate(staff.id, value);
                                  }
                                }}
                                className="w-20 h-7 text-sm"
                              />
                              <span className="text-xs">/hr ({staff.overtimeHours || 0}h)</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Moon className="h-3 w-3 text-purple-500" />
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={staff.nightShiftAllowance || 0}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (!isNaN(value) && value >= 0) {
                                    handleUpdateNightShiftAllowance(staff.id, value);
                                  }
                                }}
                                className="w-20 h-7 text-sm"
                              />
                              <span className="text-xs">({staff.nightShifts || 0} shifts)</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {staff.payType === "hourly" ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{staff.hoursWorked} hours</span>
                            <span className="text-xs text-muted-foreground">Over {staff.daysWorked} days</span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{staff.daysWorked} days worked</span>
                            <span className="text-xs text-muted-foreground">Month-to-date</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {staff.attendanceData && (
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {staff.attendanceData.present} present
                            </Badge>
                            {staff.attendanceData.late > 0 && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                {staff.attendanceData.late} late
                              </Badge>
                            )}
                            {staff.attendanceData.absent > 0 && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                {staff.attendanceData.absent} absent
                              </Badge>
                            )}
                          </div>
                        )}
                        {staff.latePenalty ? (
                          <div className="mt-1 text-xs text-red-600">
                            ${staff.latePenalty} late penalty
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {staff.calculatedPay ? (
                          <div className="flex flex-col text-sm">
                            <div className="flex justify-between">
                              <span>Daily:</span>
                              <span className="font-medium">${staff.calculatedPay.daily.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Weekly:</span>
                              <span className="font-medium">${staff.calculatedPay.weekly.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Monthly:</span>
                              <span>${staff.calculatedPay.monthly.toFixed(2)}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not calculated</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCalculatePay(staff)}
                        >
                          <Calculator className="h-4 w-4 mr-1" />
                          Calculate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <PayrollSummary staffPayroll={staffPayroll} />
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card className="rounded-sm shadow-none">
            <CardHeader>
              <CardTitle>Add Staff to Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="staff-id">Select Staff</Label>
                    <Select value={staffId} onValueChange={setStaffId}>
                      <SelectTrigger id="staff-id">
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">Robert Brown - Bartender</SelectItem>
                        <SelectItem value="6">Laura White - Receptionist</SelectItem>
                        <SelectItem value="7">James Taylor - Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pay-type">Payment Type</Label>
                    <Select
                      value={payType}
                      onValueChange={(value: "hourly" | "monthly") => setPayType(value)}
                    >
                      <SelectTrigger id="pay-type">
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly Rate</SelectItem>
                        <SelectItem value="monthly">Monthly Salary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pay-rate">
                      {payType === "hourly" ? "Hourly Rate ($)" : "Monthly Salary ($)"}
                    </Label>
                    <Input
                      id="pay-rate"
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      placeholder={payType === "hourly" ? "e.g., 15.00" : "e.g., 3500.00"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => date && setStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="overtime-rate">
                      Overtime Rate ($) {payType === "hourly" ? "(per hour)" : ""}
                    </Label>
                    <Input
                      id="overtime-rate"
                      type="number"
                      value={overtimeRate}
                      onChange={(e) => setOvertimeRate(e.target.value)}
                      placeholder={payType === "hourly" ? `e.g., ${Number(rate) * 1.5 || "22.50"}` : "e.g., 0"}
                    />
                    <p className="text-xs text-muted-foreground">
                      {payType === "hourly" ? "Default is 1.5x hourly rate if left blank" : "Leave blank or set to 0 for no overtime"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="night-shift">
                      Night Shift Allowance ($)
                    </Label>
                    <Input
                      id="night-shift"
                      type="number"
                      value={nightShiftAllowance}
                      onChange={(e) => setNightShiftAllowance(e.target.value)}
                      placeholder="e.g., 50.00"
                    />
                    <p className="text-xs text-muted-foreground">
                      Additional amount paid for night shifts (monthly)
                    </p>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-500" onClick={handleAddStaffPayroll}>
                  Add to Payroll
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm shadow-none">
            <CardHeader>
              <CardTitle>Payroll Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-3">Department Distribution</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Payroll Trend</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={payrollTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="amount" name="Base Pay" stroke="#8b5cf6" strokeWidth={2} />
                        <Line type="monotone" dataKey="overtime" name="Overtime" stroke="#ec4899" strokeWidth={2} />
                        <Line type="monotone" dataKey="nightShift" name="Night Shift" stroke="#0284c7" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-3">Pay Components Breakdown</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={payComponentData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Amount ($)" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                          {payComponentData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.value < 0 ? "#ef4444" : "#8b5cf6"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Staff Performance Metrics</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={staffPerformanceData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Top Performers" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                        <Radar name="Average Performers" dataKey="B" stroke="#0284c7" fill="#0284c7" fillOpacity={0.5} />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Attendance vs Payroll Efficiency</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendancePayrollData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#0284c7" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="payroll" name="Payroll ($)" fill="#8b5cf6" />
                      <Bar yAxisId="right" dataKey="efficiency" name="Efficiency (%)" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Generate Payroll Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select
                      value={reportType}
                      onValueChange={(value: "daily" | "weekly" | "monthly") => setReportType(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Report</SelectItem>
                        <SelectItem value="weekly">Weekly Report</SelectItem>
                        <SelectItem value="monthly">Monthly Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(reportStartDate, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={reportStartDate}
                          onSelect={(date) => date && setReportStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Report Format</Label>
                    <Select defaultValue="pdf">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Report Details</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="cursor-pointer bg-teal-600">
                        ✓ Staff Details
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer bg-teal-600">
                        ✓ Attendance
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer bg-teal-600">
                        ✓ Payment Breakdown
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer bg-teal-600">
                        ✓ Overtime
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer bg-teal-600">
                        ✓ Night Shifts
                      </Badge>
                      <Badge variant="outline" className="cursor-pointer bg-teal-600">
                        ✓ Summary
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600" onClick={handleGenerateReport}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm shadow-none">
              <CardHeader>
                <CardTitle>Previous Payroll Periods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payrollPeriods.map((period) => (
                    <div key={period.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <div className="font-medium">
                          {format(period.startDate, "MMM d")} - {format(period.endDate, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center mt-1">
                          <Badge
                            variant={
                              period.status === "paid"
                                ? "default"
                                : period.status === "processed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {period.status}
                          </Badge>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ${period.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => {
                        toast({
                          title: "Report Downloaded",
                          description: `Payroll report for ${format(period.startDate, "MMM d")} - ${format(period.endDate, "MMM d, yyyy")} downloaded`,
                        });
                      }}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-sm shadow-none">
            <CardHeader>
              <CardTitle>Payroll Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-3 border rounded-md bg-background">
                  <AlertCircle className="h-5 w-5 text-violet-600 mr-3" />
                  <div>
                    <div className="font-medium text-violet-800">Attendance Impact on Payroll</div>
                    <p className="text-sm text-violet-600">Late arrivals have resulted in $225 in penalties this month, affecting overall payroll by approximately 1.75%.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md bg-background">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-blue-800">Overtime Trends</div>
                    <p className="text-sm text-blue-600">Overtime hours have increased by 12% compared to last month, resulting in an additional $270 in overtime payments.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md bg-background">
                  <Moon className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-purple-800">Night Shift Analysis</div>
                    <p className="text-sm text-purple-600">Staff working night shifts are showing 7% higher efficiency but have 5% higher absence rates compared to day shift staff.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md bg-background">
                  <AlertCircle className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-green-800">Payroll Projection</div>
                    <p className="text-sm text-green-600">Based on current rates and attendance, your projected payroll for next month is $13,200 (2.3% increase), with overtime accounting for $1,170 (8.9% of total).</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
