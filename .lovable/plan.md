## Contexto

Analisei o ZIP (print HTML do Next Fit "Início") e o PDF (23 páginas screenshot do **Caixa** + sidebar completa). A estrutura do Next Fit tem muito mais páginas que a nossa atual. Vou mapear o que faz sentido trazer para o **FisioBot** sem inflar o sistema com módulos que não cabem em uma clínica de fisioterapia (ex: Estoque, Loja, Wellhub, GoNutri, Recompensas — descarto).

## Mapeamento Next Fit → FisioBot

| Next Fit | FisioBot atual | Ação |
|---|---|---|
| Início (KPIs + notificações + novidades) | `dashboard.tsx` (existe básico) | **Reformular** no padrão do print |
| Dashboards (CRM/Gerencial/Operacional/Financeiro) | — | **Criar** sub-rotas em `/dashboards/*` |
| Agenda / Grades / Ocupação | `agenda.tsx` | **Adicionar** Grades + Ocupação |
| Caixa | — | **Criar** página completa (foco do PDF) |
| Comissão | — | **Criar** |
| Contas a pagar / Contas a receber / Contas financeiras | `financeiro.tsx` (mistura tudo) | **Quebrar** em sub-rotas |
| Vendas | — | **Criar** (pacotes de sessões) |
| CRM: Leads / Oportunidades / Atividades | — | **Criar** módulo CRM |
| Relatórios | `relatorios.tsx` (já feito) | manter |
| Administrativo: Usuários / Perfis / Métodos pagto / Modalidades / Serviços | `admin.tsx`/`configuracoes.tsx` | **Expandir** em sub-rotas |
| Estoque, Loja, Wellhub, Recompensas, Treino | — | **Descartar** (não é escopo de fisio) |

## Páginas a criar/refatorar

### 1. Reformular `Início` (`/dashboard`)
Padrão do print: saudação + 3 botões rápidos (Nova oportunidade / Novo paciente / Nova venda), KPIs de topo (Pacientes ativos, Novos pacientes, Atendimentos hoje, Pendências), card de **Notificações**, card "Novidades / Avisos da clínica".

### 2. Novo grupo `Dashboards`
- `/dashboards/gerencial` — LTV, Churn, CAC, Inadimplência, gráficos de Vendas/Receita/Receita prevista/Ticket médio
- `/dashboards/operacional` — ocupação de horários, taxa de no-show, evolução de atendimentos
- `/dashboards/crm` — funil de leads, conversão, oportunidades por etapa

### 3. Módulo `Financeiro` (refatorar)
Transformar `financeiro.tsx` em layout com sub-rotas:
- `/financeiro/caixa` — **prioridade alta** (replica fielmente o PDF: painel Situação/Responsável/Conta/Saldo inicial; cards Entradas (Dinheiro, C.Crédito, C.Débito, Cheque, Depósito); cards Saídas; Saldo total; tabela Data/Origem/Método/Tipo/Valor com paginação; botões Fechar caixa, Entrada, Saída, Transferência, Espelho, Listar caixas)
- `/financeiro/contas-receber` — lista de cobranças do paciente (já existe lógica, separar)
- `/financeiro/contas-pagar` — despesas da clínica
- `/financeiro/contas-financeiras` — Caixinha, Banco, Cartão (cadastro de contas)
- `/financeiro/comissao` — comissão dos profissionais por atendimento
- `/financeiro/vendas` — pacotes vendidos (10 sessões etc.)

### 4. Módulo `CRM`
- `/crm/leads` — captação (nome, telefone, origem, status)
- `/crm/oportunidades` — funil Kanban (Contato → Avaliação → Proposta → Fechado)
- `/crm/atividades` — ligações/follow-ups agendados

### 5. Agenda — complementar
- `/agenda/grades` — grades semanais de horários por profissional/serviço
- `/agenda/ocupacao` — heatmap de ocupação por dia/hora

### 6. Administrativo (expandir `admin.tsx`)
Sub-rotas em `/admin/*`:
- `usuarios` / `perfis-acesso` / `metodos-pagamento` / `servicos` / `modalidades` / `categorias-financeiras`

### 7. Sidebar nova
Reorganizar `AppSidebar.tsx` em grupos (visual igual Next Fit — ícone + label, com `keyboard_arrow_down` para grupos colapsáveis):
- **Principal**: Início, Dashboards▾, Pacientes, CRM▾, Agenda▾, Evoluções, Financeiro▾, Relatórios
- **Operação**: IA, Histórico, Pendências, Sincronização
- **Sistema**: Administrativo▾, Configurações, Admin/Debug

## Detalhes técnicos

- Manter stack atual: TanStack Router file-based + shadcn/ui + mocks em `src/lib/api.ts` + tipos em `src/lib/types.ts`
- Novas rotas via arquivos `src/routes/<grupo>.<sub>.tsx` (convenção dot)
- Nova entidade nos mocks: `Caixa` (situação, responsável, contaId, dataAbertura, saldoInicial, lançamentos[]), `LancamentoCaixa` (data, origem, metodo, tipo entrada/saída, valor, descricao), `ContaFinanceira`, `Lead`, `Oportunidade`, `ContaPagar`, `Venda`, `Comissao`
- Componentes reutilizáveis novos: `KpiCard` (já temos parcial), `SectionCard`, `SidePanelCaixa`, `LancamentoModal`, `KanbanBoard` (oportunidades)
- **Ordem de execução sugerida** (entregável por fase):
  1. Sidebar reorganizada + estrutura de pastas/rotas vazias (placeholders)
  2. Caixa completo (fiel ao PDF) — entrega visual mais marcante
  3. Quebra do Financeiro em sub-rotas (contas a receber, pagar, financeiras, vendas, comissão)
  4. Dashboards (gerencial, operacional, crm)
  5. CRM (leads, oportunidades kanban, atividades)
  6. Agenda complementar (grades, ocupação)
  7. Administrativo expandido
  8. Reformulação do Início

## Pergunta antes de implementar

Quer que eu execute **tudo** o que está acima, ou prefere começar pelas fases 1 + 2 (sidebar + Caixa) e depois validar antes de seguir? Caixa sozinho já é uma tela grande e é o que está mais detalhado no PDF.