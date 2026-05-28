export function asText(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

export function asSearchTerm(value: unknown): string {
  return asText(value)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

export function matchesText(value: unknown, term: unknown): boolean {
  const normalizedTerm = asSearchTerm(term);
  if (!normalizedTerm) return true;
  return asSearchTerm(value).includes(normalizedTerm);
}

export function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value !== "string") return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  const normalized = trimmed
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  const text = asSearchTerm(value);
  if (["1", "true", "sim", "yes", "ativo", "aberto"].includes(text)) return true;
  if (["0", "false", "nao", "no", "inativo", "fechado"].includes(text)) return false;
  return fallback;
}

export function formatCurrency(value: unknown): string {
  return asNumber(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDecimal(value: unknown, digits = 1): string {
  return asNumber(value).toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatDatePt(value: unknown): string {
  const text = asText(value);
  if (!text) return "";

  const date = /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(`${text}T12:00:00`) : new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function safeSlice<T>(value: T[] | null | undefined, max: number): T[] {
  return asArray(value).slice(0, Math.max(0, max));
}
