export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  outlet?: string;
  phone?: string;
}

export interface Outlet {
  id: string;
  name: string;
}
export interface Role {
  id: string;
  name: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  checkInTime: Date;
  checkOutTime: Date | null;
  status: "present" | "late" | "absent" | "on-leave";
  overtime?: number; // Hours of overtime
  nightShift?: boolean; // Whether this was a night shift
}

export interface LeaveApplication {
  id: string;
  staffId: string;
  staffName: string;
  startDate: Date;
  endDate: Date;
  type: "annual" | "sick" | "parental" | "unpaid" | "compassionate";
  status: "pending" | "approved" | "rejected";
  reason: string;
  approvedBy?: string;
  approvedOn?: Date;
  attachments?: string[];
  comments?: string;
  days: number;
  isPaid: boolean;
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  parental: number;
  unpaid: number;
  compassionate: number;
  total: number;
}

export interface StaffPayroll {
  id: string;
  name: string;
  role: string;
  payType: "hourly" | "monthly";
  rate: number;
  hoursWorked?: number;
  daysWorked?: number;
  startDate: Date;
  status: "active" | "inactive";
  attendanceData?: {
    present: number;
    late: number;
    absent: number;
    onLeave: number;
  };
  latePenalty?: number;
  overtimeHours?: number;
  overtimeRate?: number;
  nightShifts?: number;
  nightShiftAllowance?: number;
  leaveData?: {
    approved: number;
    pending: number;
    balance: LeaveBalance;
  };
  calculatedPay?: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface PayrollPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  status: "draft" | "processed" | "paid";
  totalAmount: number;
}

export interface AttendanceAnalytics {
  totalStaff: number;
  presentToday: number;
  lateToday: number;
  absentToday: number;
  onLeaveToday?: number;
  averageCheckInTime: string;
  averageCheckOutTime: string;
  averageWorkHours: number;
  attendanceTrend: {
    day: string;
    present: number;
    late: number;
    absent: number;
    onLeave?: number;
  }[];
  departmentAttendance: {
    department: string;
    present: number;
    late: number;
    absent: number;
    onLeave?: number;
  }[];
}
