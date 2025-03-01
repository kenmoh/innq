'use client'
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, UserCheck, FileDown, BarChart, Calendar, Clock, Clipboard, ScanLine, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffScanner } from "@/components/staff/StaffScanner";
import { AttendanceRecord, AttendanceAnalytics } from "@/types/staff";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie, ResponsiveContainer } from "recharts";

export default function Attendance() {
  const [qrValue, setQrValue] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todayDate, setTodayDate] = useState<string>("");
  const [mockData, setMockData] = useState<{
    analytics: AttendanceAnalytics
  }>({
    analytics: {
      totalStaff: 25,
      presentToday: 18,
      lateToday: 5,
      absentToday: 2,
      onLeaveToday: 0,
      averageCheckInTime: "09:10 AM",
      averageCheckOutTime: "17:45 PM",
      averageWorkHours: 8.35,
      attendanceTrend: [
        { day: "Mon", present: 20, late: 3, absent: 2, onLeave: 20 },
        { day: "Tue", present: 22, late: 1, absent: 2, },
        { day: "Wed", present: 19, late: 3, absent: 3 },
        { day: "Thu", present: 18, late: 5, absent: 2 },
        { day: "Fri", present: 21, late: 2, absent: 2 },
        { day: "Sat", present: 15, late: 3, absent: 7 },
        { day: "Sun", present: 12, late: 2, absent: 11 },
      ],
      departmentAttendance: [
        { department: "Service", present: 8, late: 2, absent: 0 },
        { department: "Kitchen", present: 5, late: 1, absent: 1 },
        { department: "Management", present: 3, late: 0, absent: 0 },
        { department: "Housekeeping", present: 2, late: 2, absent: 1 },
      ]
    }
  });
  const { toast } = useToast();

  // Generate a new QR code for today's attendance
  const generateQrCode = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const secureToken = Math.random().toString(36).substring(2, 15);
    const newQrValue = `attendance-${dateString}-${secureToken}`;
    setQrValue(newQrValue);
    toast({
      title: "QR Code Generated",
      description: "New attendance QR code for today has been generated",
    });
  };

  // Sample staff data
  const sampleStaff = [
    { id: "1", name: "John Smith", role: "Waiter" },
    { id: "2", name: "Sarah Johnson", role: "Waitress" },
    { id: "3", name: "Mike Wilson", role: "Manager" },
    { id: "4", name: "Emily Davis", role: "Chef" },
    { id: "5", name: "Robert Brown", role: "Bartender" },
  ];

  // Simulate a staff member scanning the QR code
  const handleQrScan = (staffId: string) => {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (!staff) return;

    const existingRecord = attendanceRecords.find(
      record => record.staffId === staffId &&
        record.checkInTime.toDateString() === new Date().toDateString()
    );

    if (existingRecord) {
      // Staff already checked in, so this is a checkout
      if (!existingRecord.checkOutTime) {
        setAttendanceRecords(records =>
          records.map(record =>
            record.id === existingRecord.id
              ? { ...record, checkOutTime: new Date() }
              : record
          )
        );
        toast({
          title: "Check Out Successful",
          description: `${staff.name} has checked out at ${new Date().toLocaleTimeString()}`,
        });
      } else {
        toast({
          title: "Already Checked Out",
          description: `${staff.name} has already completed attendance for today`,
          variant: "destructive",
        });
      }
    } else {
      // This is a new check-in
      const now = new Date();
      const isLate = now.getHours() >= 9 && now.getMinutes() > 30; // Assuming work starts at 9:30 AM
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        staffId: staff.id,
        staffName: staff.name,
        checkInTime: now,
        checkOutTime: null,
        status: isLate ? "late" : "present",
      };

      setAttendanceRecords(prev => [...prev, newRecord]);
      toast({
        title: "Check In Successful",
        description: `${staff.name} has checked in at ${now.toLocaleTimeString()}`,
      });
    }
  };

  // Download QR code as PNG image
  const downloadQrCode = () => {
    // In a real implementation, this would convert the SVG to an image for download
    const svg = document.getElementById("attendance-qr-code");
    if (svg) {
      // Canvas approach for real implementation would go here
      toast({
        title: "QR Code Downloaded",
        description: "The attendance QR code has been downloaded successfully",
      });
    }
  };

  // Download today's QR code
  const downloadTodayQrCode = () => {
    if (!qrValue) {
      toast({
        title: "No QR Code Available",
        description: "Please generate a QR code first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Today's QR Code Downloaded",
      description: `QR code for ${todayDate} has been downloaded`,
    });
  };

  // Generate attendance report
  const generateAttendanceReport = () => {
    const presentCount = attendanceRecords.filter(r => r.status === "present").length;
    const lateCount = attendanceRecords.filter(r => r.status === "late").length;
    const totalCount = attendanceRecords.length;

    const reportData = {
      date: new Date(),
      records: attendanceRecords,
      summary: {
        present: presentCount,
        late: lateCount,
        total: totalCount
      }
    };

    // Log the report data (in a real app, you might send this to an API)
    console.log("Generated attendance report:", reportData);

    toast({
      title: "Attendance Report Generated",
      description: `Present: ${presentCount}, Late: ${lateCount}, Total: ${totalCount}`,
    });

    // Show download toast after a short delay to simulate report generation
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your attendance report PDF is ready for download",
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

  useEffect(() => {
    // Set today's date
    const today = new Date();
    setTodayDate(today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));

    // Generate a QR code when the component mounts
    generateQrCode();

    // Populate with sample attendance records
    const sampleRecords: AttendanceRecord[] = [
      {
        id: "1",
        staffId: "1",
        staffName: "John Smith",
        checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 45),
        checkOutTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30),
        status: "present",
      },
      {
        id: "2",
        staffId: "2",
        staffName: "Sarah Johnson",
        checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 10),
        checkOutTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 0),
        status: "present",
      },
      {
        id: "3",
        staffId: "4",
        staffName: "Emily Davis",
        checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 45),
        checkOutTime: null,
        status: "late",
      },
      {
        id: "4",
        staffId: "3",
        staffName: "Mike Wilson",
        checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
        checkOutTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 15),
        status: "present",
      },
      {
        id: "5",
        staffId: "5",
        staffName: "Robert Brown",
        checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 40),
        checkOutTime: null,
        status: "late",
      },
    ];

    setAttendanceRecords(sampleRecords);
  }, []);

  // Chart configuration
  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Time breakdown data
  const timeBreakdownData = [
    { name: "On Time", value: mockData.analytics.presentToday - mockData.analytics.lateToday },
    { name: "Late", value: mockData.analytics.lateToday },
    { name: "Absent", value: mockData.analytics.absentToday },
    { name: "On Leave", value: mockData.analytics.onLeaveToday },
  ];

  // Check-in time breakdown data
  const checkInTimeData = [
    { time: "8:00-8:30", count: 5 },
    { time: "8:31-9:00", count: 7 },
    { time: "9:01-9:30", count: 3 },
    { time: "9:31-10:00", count: 4 },
    { time: ">10:00", count: 1 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Staff Attendance</h1>
          <p className="text-muted-foreground">{todayDate}</p>
        </div>
        <Button onClick={downloadTodayQrCode}>
          <FileDown className="mr-2 h-4 w-4" />
          Download Daily QR Code
        </Button>
      </div>

      <Tabs defaultValue="qrcode" className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="qrcode">Daily QR Code</TabsTrigger>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="analytics">Attendance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="qrcode" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle className="text-center">Today's Attendance QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                {qrValue && (
                  <div className="p-4 bg-white rounded-lg shadow-inner border">
                    <QrCode
                      size={400}
                      color="black"
                    />
                  </div>
                )}

                <div className="text-sm text-center text-muted-foreground mt-2">
                  <p>Valid for: {todayDate}</p>
                  <p>Have staff scan this code to check in/out</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Scan QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <StaffScanner onScan={handleQrScan} staff={sampleStaff} />

                <div className="mt-6 space-y-2">
                  <h3 className="text-sm font-medium">Attendance Summary</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 px-3 py-1">
                      {attendanceRecords.filter(r => r.status === "present").length} Present
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 px-3 py-1">
                      {attendanceRecords.filter(r => r.status === "late").length} Late
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800 px-3 py-1">
                      {Math.max(0, sampleStaff.length - attendanceRecords.length)} Absent
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{attendanceRecords.length}</span> out of <span className="font-medium">{sampleStaff.length}</span> staff checked in
                    </div>
                    <Button variant="outline" size="sm" onClick={generateAttendanceReport}>
                      <Clipboard className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records">
          <Card className="rounded-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Today's Attendance</CardTitle>
                <Button variant="outline" onClick={generateAttendanceReport}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => {
                    const checkInTime = new Date(record.checkInTime);
                    const checkOutTime = record.checkOutTime ? new Date(record.checkOutTime) : null;

                    // Calculate duration
                    let duration = "In progress";
                    if (checkOutTime) {
                      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
                      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                      duration = `${diffHrs}h ${diffMins}m`;
                    }

                    // Status badge variant and configuration
                    let badgeVariant: "default" | "destructive" | "outline" | "secondary" = "default";
                    let badgeStyle = ""; // Additional style classes

                    if (record.status === "present") {
                      badgeVariant = "outline";
                      badgeStyle = "bg-green-100 text-green-800";
                    } else if (record.status === "late") {
                      badgeVariant = "outline";
                      badgeStyle = "bg-yellow-100 text-yellow-800";
                    } else if (record.status === "absent") {
                      badgeVariant = "outline";
                      badgeStyle = "bg-red-100 text-red-800";
                    } else if (record.status === "on-leave") {
                      badgeVariant = "outline";
                      badgeStyle = "bg-blue-100 text-blue-800";
                    }

                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.staffName}</TableCell>
                        <TableCell>{checkInTime.toLocaleTimeString()}</TableCell>
                        <TableCell>
                          {checkOutTime ? checkOutTime.toLocaleTimeString() : "Not checked out"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant} className={badgeStyle}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{duration}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="rounded-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present Today</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.analytics.presentToday}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((mockData.analytics.presentToday / mockData.analytics.totalStaff) * 100)}% of total staff
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.analytics.lateToday}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((mockData.analytics.lateToday / mockData.analytics.totalStaff) * 100)}% of total staff
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Check-in Time</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.analytics.averageCheckInTime}</div>
                <p className="text-xs text-muted-foreground">
                  {mockData.analytics.lateToday > 0 ? `${mockData.analytics.lateToday} staff arrived late` : "All staff on time"}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Working Hours</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.analytics.averageWorkHours.toFixed(1)}h</div>
                <p className="text-xs text-muted-foreground">
                  Based on checked-out staff
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Weekly Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      present: { color: "#10b981" },
                      late: { color: "#f59e0b" },
                      absent: { color: "#ef4444" },
                    }}
                  >
                    <RechartsBarChart data={mockData.analytics.attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="present" fill="#10b981" name="Present" stackId="stack" />
                      <Bar dataKey="late" fill="#f59e0b" name="Late" stackId="stack" />
                      <Bar dataKey="absent" fill="#ef4444" name="Absent" stackId="stack" />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Today's Attendance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      'On Time': { color: "#10b981" },
                      'Late': { color: "#f59e0b" },
                      'Absent': { color: "#ef4444" },
                      'On Leave': { color: "#8b5cf6" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timeBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {timeBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Check-in Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: { color: "#8b5cf6" },
                    }}
                  >
                    <RechartsBarChart data={checkInTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#8b5cf6" />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-sm">
              <CardHeader>
                <CardTitle>Department Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      present: { color: "#10b981" },
                      late: { color: "#f59e0b" },
                      absent: { color: "#ef4444" },
                    }}
                  >
                    <RechartsBarChart data={mockData.analytics.departmentAttendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="present" fill="#10b981" name="Present" />
                      <Bar dataKey="late" fill="#f59e0b" name="Late" />
                      <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                    </RechartsBarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-sm">
            <CardHeader>
              <CardTitle>Attendance Insights</CardTitle>
            </CardHeader>
            <CardContent className="rounded-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center p-3 border rounded-md bg-background">
                  <ScanLine className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <div className="font-medium text-blue-800">Early Birds</div>
                    <p className="text-sm text-blue-600">12 staff members (48%) consistently arrive before 9:00 AM, showing excellent punctuality.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md bg-background">
                  <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <div className="font-medium text-yellow-800">Late Patterns</div>
                    <p className="text-sm text-yellow-600">Thursday has the highest rate of late arrivals (20%). Consider investigating potential causes.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md bg-background">
                  <UserCheck className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <div className="font-medium text-purple-800">Department Analysis</div>
                    <p className="text-sm text-purple-600">The Management department has the best attendance record with 100% on-time rate.</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md bg-background">
                  <BarChart className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <div className="font-medium text-green-800">Long Hours</div>
                    <p className="text-sm text-green-600">5 staff members regularly work more than 9 hours per day. Consider reviewing workload distribution.</p>
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
