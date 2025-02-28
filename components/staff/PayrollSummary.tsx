'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Clock, BarChart, AlertCircle, Moon, Timer, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StaffPayroll } from "@/types/staff";

interface PayrollSummaryProps {
  staffPayroll: StaffPayroll[];
}

export function PayrollSummary({ staffPayroll }: PayrollSummaryProps) {
  // Calculate summary statistics
  const totalStaff = staffPayroll.length;

  const hourlyStaff = staffPayroll.filter(staff => staff.payType === "hourly");
  const monthlyStaff = staffPayroll.filter(staff => staff.payType === "monthly");

  const avgHourlyRate = hourlyStaff.length
    ? hourlyStaff.reduce((sum, staff) => sum + staff.rate, 0) / hourlyStaff.length
    : 0;

  const totalMonthlySalaries = monthlyStaff.reduce((sum, staff) => sum + staff.rate, 0);

  // Calculate estimated total monthly payroll
  const estimatedHourlyTotal = hourlyStaff.reduce((sum, staff) => {
    // Assume average of 160 hours per month for hourly workers
    const hours = staff.hoursWorked || 160;
    return sum + (staff.rate * hours);
  }, 0);

  const estimatedMonthlyTotal = totalMonthlySalaries + estimatedHourlyTotal;

  // Calculate additional statistics for enhanced analytics
  const activeStaff = staffPayroll.filter(staff => staff.status === "active").length;
  const inactiveStaff = staffPayroll.filter(staff => staff.status === "inactive").length;

  // Calculate attendance-based statistics
  const totalLateInstances = staffPayroll.reduce((sum, staff) =>
    sum + (staff.attendanceData?.late || 0), 0);

  const avgLatePerStaff = totalStaff ? (totalLateInstances / totalStaff).toFixed(1) : "0";

  const totalLatePenalties = staffPayroll.reduce((sum, staff) =>
    sum + (staff.latePenalty || 0), 0);

  // Calculate overtime statistics
  const totalOvertimeHours = staffPayroll.reduce((sum, staff) =>
    sum + (staff.overtimeHours || 0), 0);

  const totalOvertimePay = staffPayroll.reduce((sum, staff) => {
    const hours = staff.overtimeHours || 0;
    const rate = staff.overtimeRate || (staff.rate * 1.5);
    return sum + (hours * rate);
  }, 0);

  // Calculate night shift statistics
  const totalNightShifts = staffPayroll.reduce((sum, staff) =>
    sum + (staff.nightShifts || 0), 0);

  const totalNightShiftAllowance = staffPayroll.reduce((sum, staff) =>
    sum + (staff.nightShiftAllowance || 0), 0);

  // Calculate leave statistics
  const totalStaffOnLeave = staffPayroll.reduce((sum, staff) =>
    sum + (staff.attendanceData?.onLeave || 0), 0);

  const totalPendingLeaves = staffPayroll.reduce((sum, staff) =>
    sum + (staff.leaveData?.pending || 0), 0);

  const totalApprovedLeaves = staffPayroll.reduce((sum, staff) =>
    sum + (staff.leaveData?.approved || 0), 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {activeStaff} active
              </Badge>
              {inactiveStaff > 0 && (
                <Badge variant="outline" className="bg-gray-100 text-gray-800">
                  {inactiveStaff} inactive
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Hourly Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgHourlyRate.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              For {hourlyStaff.length} hourly staff ({((hourlyStaff.length / totalStaff) * 100).toFixed(0)}% of staff)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Salaries</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlySalaries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              For {monthlyStaff.length} salaried staff ({((monthlyStaff.length / totalStaff) * 100).toFixed(0)}% of staff)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Monthly Payroll</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${estimatedMonthlyTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined hourly & salaried
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Issues</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLateInstances}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                Avg {avgLatePerStaff} late per staff
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
                ${totalLatePenalties.toFixed(2)} in penalties
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {totalOvertimeHours} hours
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                ${totalOvertimePay.toFixed(2)} in payments
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                Avg {totalStaff ? (totalOvertimeHours / totalStaff).toFixed(1) : 0} hours per staff
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Night Shifts</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {totalNightShifts} shifts
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                ${totalNightShiftAllowance.toFixed(2)} in allowances
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                Avg {totalStaff ? (totalNightShifts / totalStaff).toFixed(1) : 0} per staff
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Management</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {totalStaffOnLeave} staff on leave
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                {totalApprovedLeaves} approved leaves
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                {totalPendingLeaves} pending applications
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
