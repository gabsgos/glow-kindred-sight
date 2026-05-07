import { Link } from "@tanstack/react-router";
import { Bell, Mic, Search, Sparkles, RefreshCw, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-3">
      <SidebarTrigger />
      <div className="relative flex-1 max-w-2xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Pesquisar pacientes, atendimentos ou comandos..."
          className="pl-9"
        />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link to="/ia">
            <Sparkles className="h-4 w-4" />
            <span className="hidden md:inline">IA</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" title="Gravar áudio">
          <Mic className="h-4 w-4" />
        </Button>
        <Button asChild variant="ghost" size="icon" className="relative" title="Pendências">
          <Link to="/pendencias">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-warning px-1 text-[10px] text-warning-foreground">
              2
            </Badge>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="relative" title="Sincronização">
          <Link to="/sync">
            <RefreshCw className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-destructive" />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="leading-tight">
              <div className="text-sm font-medium">Cayo Uehara Lance</div>
              <div className="text-xs text-muted-foreground">CW Rehab</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/configuracoes">Meu perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/configuracoes">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/login">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}