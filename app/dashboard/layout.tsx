import { AppSidebar } from "@/components/app-sidebar"
import Logout from "@/components/Logout"
import { ModeToggle } from "@/components/Toggle"

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { getCurrentUser } from "../actions/authActions"


const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrentUser()
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <SidebarInset>
                    <header className="flex h-16 shrink-0 justify-between pr-8 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4 ">
                            <SidebarTrigger className="-ml-1 " />
                        </div>
                        <h1 className="font-bold text-xl">Welcome, {user?.user?.email} </h1>
                        <div className="space-x-5">
                            <ModeToggle />
                            <Logout />

                        </div>
                    </header>

                    {children}

                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout