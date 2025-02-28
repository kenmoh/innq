import { Home, QrCode, Users, Menu, Settings, ClipboardList, Package, LogOut, AlertTriangle, ChefHat, Calendar, CreditCard, BarChart3, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useRouter } from "next/router";
import Link from "next/link";


const menuItems = [
  {
    title: "Overview",
    icon: Home,
    path: "/dashboard",
    badge: "New",
  },
  {
    title: "QR Codes",
    icon: QrCode,
    path: "/dashboard/qr-codes",
    badge: "12",
  },
  {
    title: "Staff",
    icon: Users,
    path: "/dashboard/staff",
    badge: "8",
    subItems: [
      {
        title: "Waiters",
        path: "/dashboard/staff/waiters",
      },
      {
        title: "Kitchen Staff",
        path: "/dashboard/staff/kitchen",
      },
      {
        title: "Management",
        path: "/dashboard/staff/management",
      },
    ],
  },
  {
    title: "Restaurant Manager",
    icon: ChefHat,
    path: "/dashboard/restaurant-manager",
    badge: "3",
  },
  {
    title: "Menu Items",
    icon: Menu,
    path: "/dashboard/menu-items",
    badge: "45",
  },
  {
    title: "Orders",
    icon: ClipboardList,
    path: "/dashboard/orders",
    badge: "5",
    subItems: [
      {
        title: "Active Orders",
        path: "/dashboard/orders/active",
      },
      {
        title: "Completed Orders",
        path: "/dashboard/orders/completed",
      },
      {
        title: "Cancelled Orders",
        path: "/dashboard/orders/cancelled",
      },
    ],
  },
  {
    title: "Events",
    icon: Calendar,
    path: "/dashboard/events",
    badge: "2",
  },
  {
    title: "Inventory",
    icon: Package,
    path: "/dashboard/inventory",
    badge: "Low",
  },
  {
    title: "Reservations",
    icon: Calendar,
    path: "/dashboard/reservations",
    badge: "15",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/dashboard/analytics",
  },
  {
    title: "Payments",
    icon: CreditCard,
    path: "/dashboard/payments",
    badge: "$2.5k",
  },
  {
    title: "Customer Feedback",
    icon: MessageSquare,
    path: "/dashboard/feedback",
    badge: "3",
  },
  {
    title: "Issues",
    icon: AlertTriangle,
    path: "/dashboard/issues",
    badge: "4",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

export function DashboardSidebar() {
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link href={item.path}>
                      <item.icon />
                      <span>{item.title}</span>
                      {item.badge && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                  {item.subItems && (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={location.pathname === subItem.path}
                          >
                            <Link href={subItem.path}>{subItem.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}