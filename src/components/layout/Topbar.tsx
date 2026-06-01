import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Mic, Search, User } from "lucide-react";

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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api";

export function Topbar({ userName }: { userName?: string }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = async () => {
    try {
      await api.auth.logout();
    } finally {
      queryClient.removeQueries({ queryKey: ["auth-session"] });
      navigate({ to: "/app-login" });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background px-3">
      <SidebarTrigger />
      <div className="relative max-w-2xl flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="topbar-search"
          autoComplete="off"
          inputMode="search"
          placeholder="Pesquisar pacientes, atendimentos ou comandos..."
          className="pl-9"
        />
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" title="Gravar audio">
          <Mic className="h-4 w-4" />
        </Button>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          {menuOpen && (
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="leading-tight">
                <div className="text-sm font-medium">{userName || "Usuario"}</div>
                <div className="text-xs text-muted-foreground">FisioBot</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  logout();
                }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
    </header>
  );
}
