"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  Home,
  Layers3,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const icons = {
  applications: FileText,
  dashboard: Home,
  leads: ClipboardList,
  master: Layers3,
  students: Users,
  visas: ShieldCheck,
};

export function CrmNavLink({
  title,
  href,
  icon,
  exact = false,
}: {
  title: string;
  href: string;
  icon: keyof typeof icons;
  exact?: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/crm" || exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  const Icon = icons[icon];

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} render={<Link href={href} />}>
        <Icon />
        <span>{title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
