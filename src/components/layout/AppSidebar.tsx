import { Link, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  Home,
  Users,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  Sparkles,
  History,
  BarChart3,
  Settings,
  Wrench,
  Activity,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const principal = [
  { title: "Início", url: "/dashboard", icon: Home },
  { title: "Agenda", url: "/agenda", icon: Calendar },
  { title: "Pacientes", url: "/pacientes", icon: Users },
  { title: "Evoluções", url: "/evolucoes", icon: ClipboardList },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Pendências", url: "/pendencias", icon: AlertTriangle },
];

const operacao = [
  { title: "IA / Comando", url: "/ia", icon: Sparkles },
  { title: "Histórico", url: "/historico", icon: History },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3 },
  { title: "Sincronização", url: "/sync", icon: Activity },
];

const sistema = [
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Admin / Debug", url: "/admin", icon: Wrench },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  const renderItems = (items: typeof principal) => (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild isActive={isActive(item.url)}>
            <Link to={item.url} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/agenda" className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            F
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">FisioBot</div>
              <div className="text-[10px] text-muted-foreground">cockpit clínico</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Operação</SidebarGroupLabel>}
          <SidebarGroupContent>{renderItems(principal)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Apoio</SidebarGroupLabel>}
          <SidebarGroupContent>{renderItems(operacao)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Sistema</SidebarGroupLabel>}
          <SidebarGroupContent>{renderItems(sistema)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}