export function PagePlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6 rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        Em construção — esta tela será detalhada nas próximas iterações conforme o pipeline.
      </div>
    </div>
  );
}