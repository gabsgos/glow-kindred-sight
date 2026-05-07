
# FisioBot — Interface Web (Pipeline de Execução)

Aplicação React/TypeScript/Tailwind/shadcn rodando sobre TanStack Start, totalmente baseada em mocks tipados e numa camada `apiClient` desacoplada (pronta para apontar para a API local Flask/FastAPI no futuro). Identidade visual: claro, roxo principal, verde concluído, vermelho cancelado, amarelo pendência, azul informativo, cards arredondados, sombras leves — inspirado nos prints do Next Fit, mas com marca FisioBot.

## Arquitetura do frontend

```text
src/
  routes/            (TanStack Start - uma rota por página)
  components/
    layout/          (AppSidebar, Topbar, PageHeader)
    agenda/          (WeekGrid, SlotCard, AppointmentModal, BuscarHorarios)
    pacientes/       (PatientList, PatientForm, PatientHeader, PatientTabs)
    evolucoes/       (EvolutionForm, EvolutionList, AudioRecorder)
    financeiro/      (FinanceTable, PaymentModal)
    pendencias/      (PendingList, PendingCard)
    ia/              (CommandBar, CommandHistory)
    admin/           (StatusCards, DebugButtons)
    common/          (StatusBadge, ConfirmDialog, EmptyState, ErrorState)
  lib/
    api/             (apiClient + endpoints fakes async)
    mocks/           (pacientes, agenda, evolucoes, faturamento, pendencias, admin)
    types/           (Paciente, AgendaSlot, Evolucao, Faturamento, Pendencia, ...)
  hooks/             (useAgendaWeek, usePaciente, useCommand, useAudio)
  styles.css         (tokens roxo FisioBot)
```

Princípios:
- Toda escrita/leitura passa por `lib/api/*` (Promises com `setTimeout` simulando latência).
- Zero regra de negócio no front: pagamentos, créditos, conflitos e classificação de intent ficam como "chamada de API" que devolve mock pronto.
- Tipos TS conforme seção 32 do prompt.
- Estados padrão em toda lista: loading, erro, vazio.

## Identidade visual (tokens)

Atualizar `src/styles.css` (oklch):
- `--primary`: roxo FisioBot (~#6D28D9)
- `--background`: branco
- `--muted`: cinza claro
- Cores semânticas auxiliares: `--success` (verde), `--warning` (amarelo), `--info` (azul), `--destructive` (vermelho)
- Cores de serviço da agenda: roxo (Fisioterapia), verde (Preparação Física), ciano (MED SANTA), teal claro (Fisioterapia Sábado)

## Pipeline de execução (6 fases)

### Fase 1 — Fundação visual e shell
- Tokens de cor, tipografia, sombras e raios.
- `AppSidebar` colapsável (shadcn sidebar) com itens: Início, Agenda, Pacientes, Evoluções, Financeiro, Pendências, IA / Comando, Histórico, Relatórios, Configurações, Admin / Debug.
- `Topbar`: logo FisioBot, busca global, botão IA, botão áudio, badge de pendências, badge de sync, avatar com menu (Perfil / Configurações / Sair).
- Layout em `__root.tsx` com `SidebarProvider` + `Outlet`.
- Páginas placeholder em todas as rotas para a navegação ficar viva desde o início.
- Mock de pacientes (5 nomes da seção 31) e tipos TS prontos.

### Fase 2 — Núcleo operacional (Agenda + Modal)
**Prioridade máxima do projeto.**
- Rota `/` = redireciona para `/agenda` (após login).
- `WeekGrid`: colunas Seg–Dom com data, linhas de hora 05:00–22:00, dia atual destacado, navegação ‹ Hoje ›, seletor Mês/Ano, seletor Dia/Semana/Lista, botões Buscar Horários / Novo Atendimento / Filtros.
- `SlotCard` colorido por serviço, com horário, serviço, profissional, ocupação `x / y` ou `x / ∞`, ícones de pendência/evolução/concluído.
- `AppointmentModal`: cabeçalho (serviço, Alterar, data, horário, Histórico, status, profissional, ocupação), abas Clientes/Leads e Cancelados/Desistentes, botões Adicionar cliente com contrato / Adicionar lead / Adicionar cliente especial, lista de clientes com avatar, link "Adicionar evolução", situação, origem, menu de 3 pontos (Abrir perfil, Remover, Remover e gerar reagendamento, Marcar como desistente, Histórico, Adicionar evolução). Rodapé: Cancelar aula (vermelho) / Fechar / Concluir aula (verde).
- `NovoAtendimentoDialog` e `BuscarHorariosDialog` com formulários da seção 14 e 15.
- Mock de agenda 1 semana com todos os tipos de serviço e ocupações pedidas.

### Fase 3 — Pacientes, Evoluções e IA
- `/pacientes`: lista com busca, filtros (ativo, pendência, crédito, etc.), tabela com colunas da seção 16 e ações por linha.
- `/pacientes/$id`: perfil com cabeçalho de KPIs e abas Resumo / Atendimentos / Evoluções / Financeiro / Documentos / Auditoria + botões rápidos.
- `/pacientes/novo` e `/pacientes/$id/editar`: form completo com validações leves.
- `/evolucoes`: listagem global + form de evolução; `AudioRecorder` (UI dos 7 estados: gravar → gravando → parar → transcrevendo → texto editável → enviar → resultado), sem captura real obrigatória nesta fase (placeholder + Web Audio API se simples).
- `/ia`: `CommandBar` com input grande, botões Enviar / Áudio, histórico recente, cards de resposta, suporte visual a respostas com pendência (mostra opções).

### Fase 4 — Financeiro, Pagamentos e Pendências
- Aba Financeiro do paciente: KPIs + tabela de faturamento (status pendente/pago/cancelado/isento, sem parcial) + botão Registrar pagamento.
- `PaymentModal` com 2 modos (Valor / Quantidade), tela de resumo pós-pagamento (atendimentos quitados, saldo, crédito).
- `/pendencias`: lista central, filtros, ações Confirmar / Cancelar / Escolher opção / Responder / Arquivar; suporte visual aos comandos equivalentes (sim, não, ver 1, etc.).
- `ConfirmDialog` reutilizável para todas as ações destrutivas (cancelar aula, remover paciente, marcar desistente, registrar pagamento, alterar valor padrão, reset).

### Fase 5 — Painéis de apoio
- `/dashboard` (acessível pelo menu Início): cards (atendimentos hoje, pacientes na semana, pendências, pagamentos pendentes, crédito total, fila de sync, status Whisper/LLM/Sheets) + listas resumo + atalhos.
- `/historico`: tabela de auditoria com filtros (paciente, tipo, data, status, origem, usuário).
- `/relatorios`: cards de relatórios mockados, com botões "Em breve" para exportações.
- `/configuracoes`: abas Perfil / Sistema / Integrações / Segurança.
- `/admin`: cards de status + botões `#STATUS`, `#RAM`, `#REFRESH`, `#DEBUG`, `#RESET` (com confirmação forte), Reiniciar Whisper/LLM, Ver logs, Ver fila.
- `/sync`: status de fila, última sync, falhas, botão Sincronizar agora, tabela.

### Fase 6 — Acesso, erros e polimento
- `/login` (seção 9) e `/cadastro` (seção 10) com estados loading/erro/sucesso. Sem auth real — mock que aceita qualquer credencial e leva para `/agenda`.
- Página 404 amigável e `errorComponent` em rotas com loader.
- Estados padrão para backend offline / falhas (mensagem da seção 30).
- Toasts (sonner) para ações simples; `ConfirmDialog` para ações sensíveis.
- Pass de responsividade: tablet horizontal, notebook, desktop, tablet vertical (sidebar recolhe).
- Pass de acessibilidade básica (foco, aria-labels nos botões da agenda).

## Camada de API simulada

`src/lib/api/` exporta funções tipadas que o frontend consome. Cada uma retorna `Promise<T>` lendo dos mocks. Endpoints cobertos (todos do prompt):

```text
auth:        login, signup
agenda:      list(week), getSlot, createSlot, addCliente, concluir,
             cancelar, removerCliente, marcarDesistente, reagendar,
             buscarHorarios
pacientes:   list, get, perfil, create, update, financeiro, evolucoes
evolucoes:   create, audio
ia:          comando, audio
pagamentos:  porValor, porQuantidade
pendencias:  list, get, confirmar, cancelar, responder
auditoria:   list
relatorios:  resumo
config:      get, patch
admin:       status, comando, refresh, reset
sync:        status, refresh
dashboard:   get
```

Trocar mocks por HTTP real depois = alterar só o corpo de cada função (manter assinatura).

## Detalhes técnicos

- TanStack Start com rotas em `src/routes/` (sem `_app/`).
- Cada rota com `head()` próprio (title/description).
- `loader` só para dados públicos; chamadas autenticadas vão pelo componente com TanStack Query.
- Tipos centralizados em `src/lib/types/` (matching seção 32).
- Mocks em `src/lib/mocks/` (arrays exportados, mutáveis em memória para simular escrita durante a sessão).
- shadcn/ui já disponível: Dialog, Sheet, Tabs, Table, Form, Select, Calendar, Sonner, Sidebar, etc.
- Sem dependências novas previstas além do que já está no template.

## O que NÃO será implementado (limites declarados)

- Backend Python, SQLite, Whisper, LLM, n8n, Google Sheets — apenas simulados.
- Regras financeiras reais (quitação, crédito) — devolvidas pelos mocks.
- Captura/transcrição real de áudio em produção — UI completa, com gravação local opcional.
- Persistência entre reloads — estado em memória da sessão.

## Entrega ao final do pipeline

20 páginas navegáveis, modal central de atendimento funcional, mocks ricos, tipos TS prontos, camada API isolada, layout responsivo tablet/desktop, identidade visual FisioBot consolidada — pronto para plugar na API local apenas trocando o corpo das funções em `lib/api/`.
