import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"


export default function RootLayout({children}: {children: React.ReactNode;}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      suppressHydrationWarning
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
         {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
