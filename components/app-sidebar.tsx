"use client"

import * as React from "react"
import {

  Bug,
  Calendar,

  Clock,

  CoinsIcon,

  CreditCard,
  Frame,

  Logs,
  Map,
  Menu,
  MessageCircleReply,
  Notebook,
  PieChart,
  QrCode,

  Scale,
  Settings,

  TriangleAlert,

  Users,
  Utensils,
  Warehouse,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Kenmoh",
    email: "kenmoh@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    { title: 'Overview', url: '/dashboard', icon: PieChart },
    { title: 'Staff', url: '/dashboard/staff', icon: Users },
    { title: 'Attendance', url: '/dashboard/attendance', icon: Clock },
    { title: 'Payroll', url: '/dashboard/payroll', icon: CoinsIcon },
    { title: 'Menu Items', url: '/dashboard/menu-items', icon: Menu },
    { title: 'Orders', url: '/dashboard/orders', icon: Logs },
    { title: 'QRCodes', url: '/dashboard/qrcodes', icon: QrCode },
    { title: 'Payment', url: '/dashboard/payments', icon: CreditCard },
    { title: 'Reservations', url: '/dashboard/reservation', icon: Notebook },
    { title: 'Restaurant Manager', url: '/dashboard/restaurant-manager', icon: Utensils },
    { title: 'Inventory', url: '/dashboard/inventory', icon: Warehouse },
    { title: 'Event', url: '/dashboard/event', icon: Calendar },
    { title: 'Feedback', url: '/dashboard/feedback', icon: MessageCircleReply },
    { title: 'Issues', url: '/dashboard/issues', icon: TriangleAlert },
    { title: 'Settings', url: '/dashboard/settings', icon: Settings },
  ],

  // navMain: [
  //   {
  //     title: "Overview",
  //     url: "#",
  //     icon: SquareTerminal,
  //     isActive: true,
  //     // items: [
  //     //   {
  //     //     title: "History",
  //     //     url: "#",
  //     //   },
  //     //   {
  //     //     title: "Starred",
  //     //     url: "#",
  //     //   },
  //     //   {
  //     //     title: "Settings",
  //     //     url: "#",
  //     //   },
  //     // ],
  //   },
  //   {
  //     title: "Models",
  //     url: "#",
  //     icon: Bot,
  //     items: [
  //       {
  //         title: "Genesis",
  //         url: "#",
  //       },
  //       {
  //         title: "Explorer",
  //         url: "#",
  //       },
  //       {
  //         title: "Quantum",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Documentation",
  //     url: "#",
  //     icon: BookOpen,
  //     items: [
  //       {
  //         title: "Introduction",
  //         url: "#",
  //       },
  //       {
  //         title: "Get Started",
  //         url: "#",
  //       },
  //       {
  //         title: "Tutorials",
  //         url: "#",
  //       },
  //       {
  //         title: "Changelog",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: Settings2,
  //     items: [
  //       {
  //         title: "General",
  //         url: "#",
  //       },
  //       {
  //         title: "Team",
  //         url: "#",
  //       },
  //       {
  //         title: "Billing",
  //         url: "#",
  //       },
  //       {
  //         title: "Limits",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>

      <SidebarContent>
        <NavMain items={data.navMain} />

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
