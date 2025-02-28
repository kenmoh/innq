import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/Toggle"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <SidebarInset>
                    <header className="flex h-16 shrink-0 justify-between pr-8 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4 ">
                            <SidebarTrigger className="-ml-1 " />
                        </div>
                        <ModeToggle />
                    </header>

                    {children}

                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout