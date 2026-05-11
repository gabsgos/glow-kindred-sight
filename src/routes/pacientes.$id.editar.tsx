import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Save, Trash2, UserCog } from "lucide-react";

import { api } from "@/lib/api";
import type { Paciente } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export const Route = createFileRoute("/pacientes/$id/editar")({
  head: () => ({ meta: [{ title: "Editar paciente — FisioBot" }] }),
  component: EditarPacientePage,
});

const schema = z.object({
  nomeCompleto: z.string().trim().min(3, "Mínimo 3 caracteres").max(120),
  telefone: z.string().trim().max(20).regex(/^[0-9()+\-\s]*$/, "Use apenas números e ()-+").optional().or(z.literal("")),
  cpf: z.string().trim().max(14).regex(/^[0-9.\-]*$/, "Apenas números, . e -").optional().or(z.literal("")),
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

function toForm(p: Paciente): FormData {
  return {
    nomeCompleto: p.nomeCompleto,
    telefone: p.telefone ?? "",
    cpf: p.cpf ?? "",
    dataNascimento: p.dataNascimento ?? "",
    endereco: p.endereco ?? "",
    valorPadraoAtendimento:
      p.valorPadraoAtendimento != null ? String(p.valorPadraoAtendimento).replace(".", ",") : "",
    aliases: p.aliases?.join(", ") ?? "",
    observacoes: p.observacoes ?? "",
    ativo: p.ativo,
  };
}

function EditarPacientePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    void api.pacientes.get(id).then((p) => {
      setPaciente(p);
      if (p) setForm(toForm(p));
    });
  }, [id]);

  if (!paciente || !form) {
    return <div className="p-6 text-sm text-muted-foreground">Carregando…</div>;
  }

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => (f ? { ...f, [key]: value } : f));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
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
      const d = parsed.data;
      await api.pacientes.update(id, {
        nomeCompleto: d.nomeCompleto,
        telefone: d.telefone || undefined,
        cpf: d.cpf || undefined,
        dataNascimento: d.dataNascimento || undefined,
        endereco: d.endereco || undefined,
        observacoes: d.observacoes || undefined,
        valorPadraoAtendimento: d.valorPadraoAtendimento
          ? Number(d.valorPadraoAtendimento.replace(",", "."))
          : undefined,
        aliases: d.aliases ? d.aliases.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        ativo: d.ativo,
      });
      toast.success("Cadastro atualizado.");
      navigate({ to: "/pacientes/$id", params: { id } });
    } catch {
      toast.error("Falha ao atualizar.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    setConfirmDel(false);
    const r = await api.pacientes.remove(id);
    if (r.ok) {
      toast.success("Paciente removido.");
      navigate({ to: "/pacientes" });
    } else toast.error("Não foi possível remover.");
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <header className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <Link
            to="/pacientes/$id"
            params={{ id }}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar ao paciente
          </Link>
          <h1 className="text-2xl font-semibold flex items-center gap-2 mt-1">
            <UserCog className="h-6 w-6" /> Editar cadastro
          </h1>
          <p className="text-sm text-muted-foreground">{paciente.nomeCompleto}</p>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setConfirmDel(true)}>
          <Trash2 className="h-4 w-4 mr-1" /> Excluir
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados do paciente</CardTitle>
          <CardDescription>Alterações são gravadas no mock e prontas para SQLite.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome completo *" error={errors.nomeCompleto}>
                <Input value={form.nomeCompleto} onChange={(e) => set("nomeCompleto", e.target.value)} maxLength={120} />
              </Field>
              <Field label="Telefone" error={errors.telefone}>
                <Input value={form.telefone} onChange={(e) => set("telefone", e.target.value)} maxLength={20} />
              </Field>
              <Field label="CPF" error={errors.cpf}>
                <Input value={form.cpf} onChange={(e) => set("cpf", e.target.value)} maxLength={14} />
              </Field>
              <Field label="Data de nascimento" error={errors.dataNascimento}>
                <Input type="date" value={form.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)} />
              </Field>
              <Field label="Endereço" error={errors.endereco} className="md:col-span-2">
                <Input value={form.endereco} onChange={(e) => set("endereco", e.target.value)} maxLength={200} />
              </Field>
              <Field label="Valor padrão por atendimento (R$)" error={errors.valorPadraoAtendimento}>
                <Input
                  inputMode="decimal"
                  value={form.valorPadraoAtendimento}
                  onChange={(e) => set("valorPadraoAtendimento", e.target.value)}
                  placeholder="200,00"
                />
              </Field>
              <Field label="Apelidos / aliases" error={errors.aliases}>
                <Input
                  value={form.aliases}
                  onChange={(e) => set("aliases", e.target.value)}
                  placeholder="separe por vírgula"
                />
              </Field>
            </div>

            <Field label="Observações" error={errors.observacoes}>
              <Textarea
                value={form.observacoes}
                onChange={(e) => set("observacoes", e.target.value)}
                maxLength={500}
                rows={3}
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => paciente && setForm(toForm(paciente))}
                disabled={saving}
              >
                Restaurar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: "/pacientes/$id", params: { id } })}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDel}
        onOpenChange={setConfirmDel}
        title="Excluir paciente?"
        description={`Esta ação removerá ${paciente.nomeCompleto} do cadastro local.`}
        confirmLabel="Excluir"
        onConfirm={onDelete}
      />
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