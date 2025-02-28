"use client"

import { type LucideIcon } from "lucide-react"

import {
  Collapsible,

  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,

  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,

} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean

  }[]
}) {


  const pathname = usePathname()
  return (
    <SidebarGroup className="flex-1 px-0">
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem >
              <CollapsibleTrigger className="h-[45px] w-[100%] rounded-none " asChild>
                <SidebarMenuButton tooltip={item.title}
                  className={pathname === item.url ? 'bg-black/50 text-white' : ''}
                >
                  {item.icon && <item.icon size={35} color={pathname === item.url ? "white" : 'grey'} />}
                  <Link href={item.url} className="font-semibold">{item.title}</Link>

                </SidebarMenuButton>
              </CollapsibleTrigger>

            </SidebarMenuItem>
          </Collapsible>
        ))}

      </SidebarMenu>
    </SidebarGroup>
  )
}
