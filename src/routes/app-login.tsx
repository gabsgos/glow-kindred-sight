import { type CSSProperties, FormEvent, useState } from "react";
import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Activity, CalendarDays, FileText, Lock, ShieldCheck, UserRound, Users } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type LoginSearch = {
  redirect?: string;
};

const fieldStyle = {
  width: "100%",
  height: "44px",
  borderRadius: "6px",
  border: "1px solid #dfe3ee",
  background: "#ffffff",
  padding: "8px 12px 8px 36px",
  fontSize: "16px",
  lineHeight: "24px",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.06)",
  outline: "none",
} satisfies CSSProperties;

const codeFieldStyle = {
  ...fieldStyle,
  paddingLeft: "12px",
} satisfies CSSProperties;

const secretFieldStyle = {
  ...fieldStyle,
  WebkitTextSecurity: "disc",
} as CSSProperties;

export const Route = createFileRoute("/app-login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : "/dashboard",
  }),
  head: () => ({ meta: [{ title: "Entrar - FisioBot" }] }),
  component: FisioBotLogin,
});

export function FisioBotLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useRouterState({ select: (state) => state.location });
  const redirect = typeof location.search.redirect === "string" ? location.search.redirect : "/dashboard";
  const [login, setLogin] = useState("");
  const [secret, setSecret] = useState("");
  const [rememberDevice, setRememberDevice] = useState(true);
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"password" | "code">("password");
  const [pendingLogin, setPendingLogin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const finish = async () => {
    await queryClient.invalidateQueries({ queryKey: ["auth-session"] });
    navigate({ to: redirect });
  };

  const submitPassword = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await api.auth.login({ login, secret, rememberDevice });
      if (response.authenticated) {
        await finish();
        return;
      }
      if (response.next === "code") {
        setPendingLogin(response.login || login);
        setStep("code");
        setMessage(response.message || "Codigo enviado.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel entrar.");
    } finally {
      setLoading(false);
    }
  };

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.auth.loginCode({ login: pendingLogin || login, verificationCode: code });
      if (response.authenticated) await finish();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Codigo invalido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/30 text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(420px,0.85fr)_minmax(520px,1.15fr)]">
        <section className="flex items-center justify-center border-r bg-background px-5 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[430px]">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Activity className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-semibold tracking-tight">FisioBot</h1>
                <p className="text-xs text-muted-foreground">cockpit clinico</p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold tracking-tight">Entrar</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Acesse agenda, pacientes, evolucoes e financeiro com sua conta do FisioBot.
                </p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {message && !error && (
                <Alert className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {step === "password" ? (
                <form className="space-y-4" onSubmit={submitPassword}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="login">
                      Usuario
                    </label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="login"
                        name="fisiobot-login"
                        type="text"
                        value={login}
                        onChange={(event) => setLogin(event.target.value)}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        data-lpignore="true"
                        data-1p-ignore="true"
                        style={fieldStyle}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="secret">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="secret"
                        name="fisiobot-secret"
                        type="text"
                        value={secret}
                        onChange={(event) => setSecret(event.target.value)}
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        style={secretFieldStyle}
                        required
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(event) => setRememberDevice(event.target.checked)}
                      style={{ accentColor: "#7b2ff2" }}
                    />
                    Manter este dispositivo autorizado
                  </label>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar no sistema"}
                  </Button>
                  <a className="block text-center text-sm text-primary hover:underline" href="/recover">
                    Recuperar senha
                  </a>
                </form>
              ) : (
                <form className="space-y-4" onSubmit={submitCode}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="code">
                      Codigo de verificacao
                    </label>
                    <input
                      id="code"
                      name="fisiobot-code"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      inputMode="numeric"
                      autoComplete="off"
                      style={codeFieldStyle}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Confirmando..." : "Confirmar login"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setStep("password")}>
                    Voltar
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="hidden items-center px-12 py-10 lg:flex">
          <div className="w-full max-w-3xl">
            <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-md border bg-background shadow-sm">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight">
              Gestao clinica protegida para a rotina do consultorio.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
              A interface web usa a sessao do backend FisioBot antes de liberar dados de agenda, pacientes,
              evolucoes e financeiro.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              <FeatureStat icon={<CalendarDays className="h-4 w-4" />} title="Agenda" body="Atendimentos e status do dia." />
              <FeatureStat icon={<Users className="h-4 w-4" />} title="Pacientes" body="Cadastro e historico clinico." />
              <FeatureStat icon={<FileText className="h-4 w-4" />} title="Financeiro" body="Caixa e valores pendentes." />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function FeatureStat({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border bg-background p-4 shadow-sm">
      <div className="mb-3 text-primary">{icon}</div>
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
    </div>
  );
}
