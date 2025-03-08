export interface Permission {
  id: string;
  name: string;
  permissions?: {
    orders: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    inventory: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    stock: { create: boolean; read: boolean; update: boolean; delete: boolean };
    payment: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
}
export interface Staff {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  department?: string;
  permissions?: {
    orders: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    inventory: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    stock: { create: boolean; read: boolean; update: boolean; delete: boolean };
    payment: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
  };
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

export interface StaffGroup {
  id: string;
  name: string;
  permissions: {
    orders: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    inventory: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    stock: { create: boolean; read: boolean; update: boolean; delete: boolean };
  };
  visibleRoutes: {
    [key: string]: boolean;
  };
}

type User = {
  id: string;
  email: string;
  phone: string;
  user_type: string;
  permission_name: string;
  subscription_type: string;
  company_name: string;
  full_name: string;
};

export type UserType = {
  user: User;
};

export type CreateUserType = {
  name: string;
};

export type CreateUserTypeResponse = {
  name: string;
  id: number;
  company_id: string;
};

export type UserRoleResponse = {
  roles: CreateUserTypeResponse;
  error: string | null;
};

export type Roletype = {
  id: number;
  name: string;
  company_id: string;
};

export type Department = {
  id: string;
  name: string;
};
export type DepartmentResponse = {
  departments: Department;
  error: string | null;
};
