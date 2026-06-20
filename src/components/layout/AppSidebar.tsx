import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart3,
  Bug,
  Calendar,
  ChevronDown,
  ClipboardList,
  DollarSign,
  Home,
  Keyboard,
  Users,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };
type NavGroup =
  | { kind: "item"; item: NavItem }
  | { kind: "group"; title: string; icon: React.ComponentType<{ className?: string }>; items: NavItem[] };

const principal: NavGroup[] = [
  { kind: "item", item: { title: "Inicio", url: "/dashboard", icon: Home } },
  { kind: "item", item: { title: "Pacientes", url: "/pacientes", icon: Users } },
  {
    kind: "group",
    title: "Agenda",
    icon: Calendar,
    items: [{ title: "Agenda", url: "/agenda", icon: Calendar }],
  },
  { kind: "item", item: { title: "Evolucoes", url: "/evolucoes", icon: ClipboardList } },
  {
    kind: "group",
    title: "Financeiro",
    icon: DollarSign,
    items: [{ title: "Caixa", url: "/financeiro/caixa", icon: Keyboard }],
  },
  { kind: "item", item: { title: "Relatorios", url: "/relatorios", icon: BarChart3 } },
  { kind: "item", item: { title: "Debug intents", url: "/debug-intents", icon: Bug } },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => pathname === url || pathname.startsWith(url + "/");

  const renderGroup = (entry: NavGroup) => {
    if (entry.kind === "item") {
      const item = entry.item;
      return (
        <SidebarMenuItem key={item.url}>
          <SidebarMenuButton asChild isActive={isActive(item.url)}>
            <Link to={item.url} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }
    return (
      <CollapsibleGroup
        key={entry.title}
        title={entry.title}
        icon={entry.icon}
        items={entry.items}
        collapsed={collapsed}
        isActive={isActive}
      />
    );
  };

  const renderItems = (entries: NavGroup[]) => (
    <SidebarMenu>{entries.map(renderGroup)}</SidebarMenu>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/agenda" className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
            F
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">FisioBot</div>
              <div className="text-[10px] text-muted-foreground">cockpit clinico</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Principal</SidebarGroupLabel>}
          <SidebarGroupContent>{renderItems(principal)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function CollapsibleGroup({
  title,
  icon: Icon,
  items,
  collapsed,
  isActive,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
  collapsed: boolean;
  isActive: (url: string) => boolean;
}) {
  const childActive = items.some((i) => isActive(i.url));
  const [open, setOpen] = useState(childActive);

  if (collapsed) {
    return (
      <>
        {items.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
              <Link to={item.url} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen} asChild>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={childActive} className="justify-between">
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{title}</span>
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((item) => (
              <SidebarMenuSubItem key={item.url}>
                <SidebarMenuSubButton asChild isActive={isActive(item.url)}>
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="h-3.5 w-3.5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
