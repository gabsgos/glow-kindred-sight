import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlus, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { Paciente } from "@/lib/types";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar cadastro — FisioBot" }] }),
  component: CadastroPage,
});

// Schema compatível com tabela SQLite futura (pacientes)
const schema = z.object({
  nomeCompleto: z.string().trim().min(3, "Mínimo 3 caracteres").max(120),
  telefone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9()+\-\s]*$/, "Use apenas números e ()-+")
    .optional()
    .or(z.literal("")),
  cpf: z
    .string()
    .trim()
    .max(14)
    .regex(/^[0-9.\-]*$/, "Apenas números, . e -")
    .optional()
    .or(z.literal("")),
  dataNascimento: z.string().optional().or(z.literal("")),
  endereco: z.string().trim().max(200).optional().or(z.literal("")),
  valorPadraoAtendimento: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Number(v.replace(",", "."))), "Valor inválido"),
  aliases: z.string().max(200).optional().or(z.literal("")),
  observacoes: z.string().trim().max(500).optional().or(z.literal("")),
  ativo: z.boolean(),
});
type FormData = z.infer<typeof schema>;

const empty: FormData = {
  nomeCompleto: "",
  telefone: "",
  cpf: "",
  dataNascimento: "",
  endereco: "",
  valorPadraoAtendimento: "",
  aliases: "",
  observacoes: "",
  ativo: true,
};

function CadastroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [recentes, setRecentes] = useState<Paciente[]>([]);

  useEffect(() => {
    void api.pacientes.list().then((all) =>
      setRecentes([...all].reverse().slice(0, 5)),
    );
  }, []);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const map: Partial<Record<keyof FormData, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormData;
        if (!map[k]) map[k] = issue.message;
      }
      setErrors(map);
      toast.error("Revise os campos destacados.");
      return;
    }
    setSaving(true);
    try {
      const data = parsed.data;
      const pac = await api.pacientes.create({
        nomeCompleto: data.nomeCompleto,
        telefone: data.telefone || undefined,
        cpf: data.cpf || undefined,
        dataNascimento: data.dataNascimento || undefined,
        endereco: data.endereco || undefined,
        observacoes: data.observacoes || undefined,
        valorPadraoAtendimento: data.valorPadraoAtendimento
          ? Number(data.valorPadraoAtendimento.replace(",", "."))
          : undefined,
        aliases: data.aliases
          ? data.aliases.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        ativo: data.ativo,
      });
      toast.success(`Paciente ${pac.nomeCompleto} cadastrado.`);
      setForm(empty);
      const all = await api.pacientes.list();
      setRecentes([...all].reverse().slice(0, 5));
    } catch {
      toast.error("Falha ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/pacientes" className="inline-flex items-center gap-1 hover:underline">
              <ArrowLeft className="h-3 w-3" /> Pacientes
            </Link>
          </div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <UserPlus className="h-6 w-6" /> Novo cadastro
          </h1>
          <p className="text-sm text-muted-foreground">
            Os campos abaixo seguem o esquema da futura tabela SQLite <code>pacientes</code>.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Dados do paciente</CardTitle>
            <CardDescription>Apenas o nome é obrigatório. Telefone e CPF ajudam a IA a desambiguar.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nome completo *" error={errors.nomeCompleto}>
                  <Input
                    value={form.nomeCompleto}
                    onChange={(e) => set("nomeCompleto", e.target.value)}
                    maxLength={120}
                    placeholder="Ex.: Michelle Rossini"
                  />
                </Field>
                <Field label="Telefone" error={errors.telefone}>
                  <Input
                    value={form.telefone}
                    onChange={(e) => set("telefone", e.target.value)}
                    maxLength={20}
                    placeholder="(11) 98123-0000"
                  />
                </Field>
                <Field label="CPF" error={errors.cpf}>
                  <Input
                    value={form.cpf}
                    onChange={(e) => set("cpf", e.target.value)}
                    maxLength={14}
                    placeholder="000.000.000-00"
                  />
                </Field>
                <Field label="Data de nascimento" error={errors.dataNascimento}>
                  <Input
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) => set("dataNascimento", e.target.value)}
                  />
                </Field>
                <Field label="Endereço" error={errors.endereco} className="md:col-span-2">
                  <Input
                    value={form.endereco}
                    onChange={(e) => set("endereco", e.target.value)}
                    maxLength={200}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </Field>
                <Field label="Valor padrão por atendimento (R$)" error={errors.valorPadraoAtendimento}>
                  <Input
                    inputMode="decimal"
                    value={form.valorPadraoAtendimento}
                    onChange={(e) => set("valorPadraoAtendimento", e.target.value)}
                    placeholder="200,00"
                  />
                </Field>
                <Field label="Apelidos / aliases (separe por vírgula)" error={errors.aliases}>
                  <Input
                    value={form.aliases}
                    onChange={(e) => set("aliases", e.target.value)}
                    placeholder="Mi, Mih, Michelle R."
                  />
                </Field>
              </div>

              <Field label="Observações" error={errors.observacoes}>
                <Textarea
                  value={form.observacoes}
                  onChange={(e) => set("observacoes", e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Notas clínicas iniciais, restrições, preferências..."
                />
              </Field>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label className="text-sm">Cadastro ativo</Label>
                  <p className="text-xs text-muted-foreground">Inativos não aparecem na busca da agenda.</p>
                </div>
                <Switch checked={form.ativo} onCheckedChange={(v) => set("ativo", v)} />
              </div>

              <Separator />

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setForm(empty)} disabled={saving}>
                  Limpar
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate({ to: "/pacientes" })} disabled={saving}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4 mr-1" />
                  {saving ? "Salvando..." : "Salvar paciente"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cadastros recentes</CardTitle>
            <CardDescription>Últimos pacientes salvos nesta sessão.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentes.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum paciente ainda.</p>
            )}
            {recentes.map((p) => (
              <Link
                key={p.id}
                to="/pacientes/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between rounded-md border p-3 hover:bg-accent transition"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {p.nomeCompleto}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.telefone ?? "sem telefone"}
                  </div>
                </div>
                <Badge variant={p.ativo ? "secondary" : "outline"}>
                  {p.ativo ? "ativo" : "inativo"}
                </Badge>
              </Link>
            ))}
            <Separator className="my-2" />
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to="/pacientes">Ver todos os pacientes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
