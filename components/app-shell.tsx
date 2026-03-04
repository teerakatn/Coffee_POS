"use client"

import {
  Coffee,
  LayoutDashboard,
  UtensilsCrossed,
  Package,
  BarChart3,
  Tag,
  Receipt,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { POSScreen } from "@/components/pos-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { MenuManagement } from "@/components/menu-management"
import { InventoryScreen } from "@/components/inventory-screen"
import { ReportsScreen } from "@/components/reports-screen"
import { PromotionsScreen } from "@/components/promotions-screen"
import { ReceiptScreen } from "@/components/receipt-screen"
import { useAppStore, type Page } from "@/lib/app-store"

const navItems: {
  value: Page
  label: string
  icon: React.ElementType
  group: "operations" | "management" | "analytics"
}[] = [
  { value: "pos",        label: "Point of Sale",  icon: Coffee,          group: "operations" },
  { value: "receipt",    label: "Checkout",        icon: Receipt,         group: "operations" },
  { value: "dashboard",  label: "Dashboard",       icon: LayoutDashboard, group: "analytics" },
  { value: "reports",    label: "Reports",         icon: BarChart3,       group: "analytics" },
  { value: "menu",       label: "Menu Items",      icon: UtensilsCrossed, group: "management" },
  { value: "inventory",  label: "Inventory",       icon: Package,         group: "management" },
  { value: "promotions", label: "Promotions",      icon: Tag,             group: "management" },
]

export function AppShell() {
  // ── Global state from Zustand (survives page changes) ────────────────────
  const activePage    = useAppStore((s) => s.activePage)
  const setActivePage = useAppStore((s) => s.setActivePage)

  const operationsItems = navItems.filter((i) => i.group === "operations")
  const analyticsItems  = navItems.filter((i) => i.group === "analytics")
  const managementItems = navItems.filter((i) => i.group === "management")

  const currentPage = navItems.find((i) => i.value === activePage)

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <button
            onClick={() => setActivePage("pos")}
            className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Coffee className="size-4" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">
                BBPOS
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Coffee Shop
              </span>
            </div>
          </button>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {operationsItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      isActive={activePage === item.value}
                      onClick={() => setActivePage(item.value)}
                      tooltip={item.label}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Analytics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analyticsItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      isActive={activePage === item.value}
                      onClick={() => setActivePage(item.value)}
                      tooltip={item.label}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      isActive={activePage === item.value}
                      onClick={() => setActivePage(item.value)}
                      tooltip={item.label}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <Separator className="mb-3 bg-sidebar-border" />
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                SM
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-xs font-medium text-sidebar-foreground">Store Manager</span>
              <span className="text-[11px] text-sidebar-foreground/60">Main Branch</span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b bg-card px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-muted-foreground">
              {currentPage?.group === "operations"
                ? "Operations"
                : currentPage?.group === "analytics"
                ? "Analytics"
                : "Management"}
            </span>
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            <span className="font-medium">{currentPage?.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="h-8 w-56 bg-secondary border-0 pl-8 text-sm"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative size-8">
              <Bell className="size-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </div>
        </header>

        {/* Main content — all screens are always mounted so Zustand state is never lost */}
        <main className="flex-1 overflow-auto">
          <div className={activePage === "pos"        ? "" : "hidden"}><POSScreen /></div>
          <div className={activePage === "dashboard"  ? "" : "hidden"}><DashboardScreen /></div>
          <div className={activePage === "menu"       ? "" : "hidden"}><MenuManagement /></div>
          <div className={activePage === "inventory"  ? "" : "hidden"}><InventoryScreen /></div>
          <div className={activePage === "reports"    ? "" : "hidden"}><ReportsScreen /></div>
          <div className={activePage === "promotions" ? "" : "hidden"}><PromotionsScreen /></div>
          <div className={activePage === "receipt"    ? "" : "hidden"}><ReceiptScreen /></div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}