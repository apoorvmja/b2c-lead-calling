import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Database,
  FileText,
  Home,
  Layers3,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const primaryNav = [
  { title: "Dashboard", icon: Home, href: "/crm", active: true },
  { title: "Analytics", icon: BarChart3, href: "/crm" },
  { title: "Students", icon: Users, href: "/crm/student" },
];

const leadNav = [
  { title: "Lead Details", href: "/crm/lead" },
  { title: "Unallocated Leads", href: "/crm/lead/unallocated" },
];

const documentNav = [
  { title: "Data Library", icon: Database, active: true },
  { title: "Reports", icon: FileText },
  { title: "Knowledge Base", icon: BookOpen },
];

const masterNav = [
  { title: "Users", href: "/crm/master/users" },
  { title: "Countries", href: "/crm/master/countries" },
  { title: "Courses", href: "/crm/master/courses" },
  { title: "Education Levels", href: "/crm/master/education-levels" },
  { title: "English Tests", href: "/crm/master/english-tests" },
  { title: "Inquiry Sources", href: "/crm/master/inquiry-sources" },
  { title: "Intakes", href: "/crm/master/intakes" },
  { title: "Interested Fields", href: "/crm/master/interested-fields" },
  { title: "Status", href: "/crm/master/status" },
];

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border p-3">
            <div className="flex h-9 items-center gap-2 px-1">
              <div className="flex size-7 items-center justify-center rounded-md border border-sidebar-border bg-sidebar-accent">
                <span className="text-xs font-semibold">GG</span>
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">GoGlobal CRM</p>
                <p className="truncate text-xs text-muted-foreground">
                  Lead operations
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Home</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {primaryNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        isActive={item.active}
                        render={<Link href={item.href} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Leads</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {leadNav.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton render={<Link href={item.href} />}>
                        <ClipboardList />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Documents</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {documentNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={item.active}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.active ? (
                        <SidebarMenuAction aria-label="More actions">
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Master</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {masterNav.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton render={<Link href={item.href} />}>
                        <Layers3 />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <h1 className="truncate text-sm font-medium">CRM Dashboard</h1>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Search />
              Search
            </Button>
            <Button size="sm">
              <Plus />
              New
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Settings">
              <Settings2 />
            </Button>
          </header>

          <main className="flex-1 overflow-auto">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
