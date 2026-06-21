# Update novo - parser semantico e valor coletivo de atendimentos

Criado em: 2026-06-18 10:38:17 -03:00 America/Sao_Paulo

## Proximo update visual - Design system clinico operacional

Incluido em: 2026-06-20 23:08:00 -03:00 America/Sao_Paulo

### Objetivo

Unificar onboarding e dashboard em uma unica personalidade visual:

```text
visual clinico
estrutura SaaS
densidade operacional
linguagem simples
```

Evitar:

```text
ERP cinza
app roxo neon
fintech
menu tecnico para usuario comum
```

Proporcao visual:

```text
80% neutros
15% roxo
5% cores semanticas
```

### Tokens visuais

Usar Inter como fonte unica do MVP.

Paleta base:

```text
primary-700: #5B21B6
primary-600: #6D28D9
primary-500: #7C3AED
primary-100: #EDE9FE
primary-50:  #F5F3FF
app-bg: #F7F8FC
```

Cores semanticas:

```text
verde: pago, concluido, conectado
amarelo: pendente, atencao, parcial
vermelho: erro, atraso, cancelamento, destrutivo
azul: informacao, agenda aberta, evento futuro
cinza: neutro, inativo, isento, sem dados
```

Componentes:

```text
cards: 14px
inputs: 10px
botoes: 10px
chips: 999px
borda: #E5E7EB
sombra leve
```

### Onboarding

Refatorar para:

```text
coluna esquerda:
- marca
- etapa atual
- progresso
- lista das quatro etapas
- uma dica contextual

coluna direita:
- titulo
- subtitulo curto
- formulario
- acoes
```

Remover excesso de cards laterais.

Ordem dos campos:

```text
Nome completo
Nome de exibicao
CPF
E-mail
WhatsApp
Senha
Consentimento
```

Trocar:

```text
Recomecar
```

por:

```text
Salvar e sair
```

Mover `Recomecar cadastro` para link discreto no rodape.

Consentimento:

```text
Confirmo que os dados sao meus e aceito os Termos de Uso e a Politica de Privacidade.
```

### Dashboard

Separar modo produto e modo administrador.

Modo produto:

```text
Inicio
Agenda
Pacientes
Financeiro
Relatorios
Configuracoes
```

Modo administrador:

```text
Recursos
Usuarios
Debug Intents
```

Hierarquia inicial:

```text
Hoje
Proximo atendimento
Pendencias
Acao
Financeiro
```

Cards superiores devem virar filtros clicaveis:

```text
Atendimentos hoje -> agenda do dia
Pendencias -> painel de pendencias
A receber -> financeiro pendente
Recebido no mes -> financeiro recebido
```

Pendencias devem mostrar composicao:

```text
8 pendencias
4 evolucoes
4 pagamentos
```

Agenda deve ganhar acoes:

```text
Abrir
Evoluir
Receber
```

### Responsividade

Tablet:

```text
sidebar compacta por icones
menu expandido ao toque
```

Mobile:

```text
cards em coluna
agenda em lista
acoes fixas/drawer
sem tabela espremida
```

### Ordem de entrega

Bloco 1:

```text
tokens CSS
Inter
paleta
radius/sombra/bordas
botoes/chips/status
```

Bloco 2:

```text
onboarding
ordem dos campos
validacao inline
acoes
consentimento
```

Bloco 3:

```text
dashboard
modo produto/admin
proximo atendimento
cards-filtro
pendencias
agenda com acoes
```

Bloco 4:

```text
responsividade desktop/tablet/mobile
```

### Documento detalhado

Especificacao completa salva em:

```text
C:/Users/gabri/OneDrive/Desktop/proximo-update-visual-fisiobot.md
```

## Proximo update urgente - Chat contextual por paciente e agenda

Incluido em: 2026-06-20 22:16:41 -03:00 America/Sao_Paulo

### Objetivo

Evoluir o chat do FisioBot para operar com contexto conversacional temporario, permitindo:

- consulta simples de valor sem numero;
- nome de paciente sozinho como busca;
- contexto ativo/standby por paciente;
- comandos curtos dependentes de contexto;
- diferenca entre consulta global de agenda e agendamento contextual;
- multiplos fluxos abertos com TTL e confirmacao por risco.

### Consulta simples de valor

Frases sem valor numerico devem consultar dados, nao abrir pendencia de alteracao.

Exemplos:

```text
valor de todos os atendimentos
preco dos atendimentos?
valor de todos
quanto custa a sessao
valor padrao
```

Intent esperada:

```text
consultar_valor_global_atendimento
```

Frases com valor numerico continuam abrindo alteracao com confirmacao:

```text
valor de todos 180
preco dos atendimentos 167,66
valor da sessao de todos 200 reais
```

Intent esperada:

```text
definir_valor_global_atendimento
```

### Nome de paciente sozinho

Mensagem composta apenas por nome deve executar busca e abrir contexto ativo.

Exemplo:

```text
Michelle Rossini
```

Equivalente operacional:

```text
Busca Michelle Rossini
```

Resposta deve mostrar resumo e opcoes naturais:

```text
Michelle Rossini encontrada.
Valor do atendimento: R$ 192,00
Pendencias: R$ 0,00

Posso agendar, registrar pagamento, evoluir, registrar atendimento ou mostrar financeiro.
```

### Busca de paciente como resumo operacional acionavel

A resposta atual de `busca <paciente>` nao deve imprimir o banco inteiro no WhatsApp.

Substituir por formatter especifico:

```text
build_patient_search_summary(...)
```

Objetivo:

```text
responder qual e a situacao do paciente agora e o que o usuario pode fazer em seguida
```

Busca padrao deve exibir apenas:

```text
nome
proximo atendimento
valor por sessao
credito disponivel com contexto
total recebido
total em aberto
alertas relevantes
menu numerado de acoes
```

Nao exibir por padrao:

```text
CPF
endereco
data de nascimento
campos vazios
historico completo
todos os pagamentos
todos os agendamentos passados
status tecnico em ingles
```

Exemplo de resposta compacta:

```text
Michelle Rossini

Financeiro
- Valor por sessao: R$ 192,00
- Credito disponivel: R$ 8.396,66
- Total recebido: R$ 5.729,00
- Em aberto: R$ 0,00

Proximos horarios
- Dom, 21/06 as 08h
- Dom, 21/06 as 11h
- Dom, 21/06 as 15h

Atencao
Ha 3 agendamentos anteriores ainda marcados como agendados.
Ha pagamentos registrados sem atendimento correspondente.

O que deseja fazer?
1. Ver agenda completa
2. Ver financeiro
3. Registrar atendimento
4. Registrar pagamento
5. Abrir cadastro
6. Verificar inconsistencias
```

Ficha completa fica apenas para:

```text
ver ficha completa da Michelle
```

ou escolha numerica correspondente.

### Payload operacional de busca

Antes de formatar texto, montar payload unico:

```json
{
  "patient": {
    "id": "M8ABN0T",
    "name": "Michelle Rossini",
    "phone": null,
    "profile_incomplete": true
  },
  "schedule": {
    "next_appointment": "2026-06-21T08:00:00",
    "upcoming_count": 3,
    "past_open_count": 3
  },
  "financial": {
    "session_price_cents": 19200,
    "credit_balance_cents": 839666,
    "total_received_cents": 572900,
    "open_balance_cents": 0
  },
  "clinical": {
    "attendance_count": 0,
    "evolution_count": 0
  },
  "alerts": [
    {
      "type": "past_appointments_still_scheduled",
      "count": 3
    },
    {
      "type": "payments_without_attendance",
      "count": 3
    }
  ]
}
```

O formatter decide o que mostrar.

Nao chamar LLM para montar a busca.

### Traducao e formatacao

Traduzir status:

```text
scheduled -> Agendado
completed -> Concluido
cancelled -> Cancelado
paid -> Pago
pending -> Pendente
```

Formatar datas:

```text
2026-06-21 08:00:00 -> 21/06 as 08h
```

Com dia da semana:

```text
Dom, 21/06 as 08h
```

### Alertas obrigatorios

Detectar:

```text
total_atendimentos = 0 e pagamentos > 0
agendamentos passados ainda como scheduled
pagamentos sem forma informada
credito disponivel muito acima do valor de sessao
credito negativo
ficha sem telefone
atendimento sem evolucao
pagamento sem atendimento correspondente
```

### Acoes numeradas apos busca

Integrar ao contexto numerico:

```text
1 -> abrir agenda do paciente
2 -> mostrar financeiro
3 -> iniciar registrar_atendimento
4 -> iniciar registrar_pagamento
5 -> mostrar ficha completa/cadastro
6 -> verificar inconsistencias
```

TTL:

```text
15 minutos
```

### Agenda global versus agenda contextual

Depois de:

```text
Busca Michelle Rossini
```

O comando:

```text
agenda hj
```

deve consultar a agenda global de hoje e manter Michelle em standby.

Nao deve agendar Michelle automaticamente.

O comando:

```text
agenda ela hj
```

deve puxar o contexto da Michelle e abrir workflow de agendamento para ela.

Como falta horario, resposta esperada:

```text
Qual horario para agendar Michelle Rossini hoje?
```

Se o usuario responder:

```text
11h
```

o workflow deve completar:

```text
agendar Michelle Rossini hoje as 11h
```

com confirmacao se a politica de risco medio estiver ativa.

### Marcadores contextuais

Devem puxar o paciente ativo:

```text
ela
ele
esse
essa
este
esta
o paciente
a paciente
o cliente
a cliente
o mesmo
a mesma
dele
dela
pra ele
pra ela
para ele
para ela
com ele
com ela
```

Exemplos:

```text
agenda ela hj
pagamento dela 200 pix
evolui ela dor melhorou
financeiro dela
registrar atendimento dela hoje 14h
```

### Consultas globais que nao devem puxar paciente

Mesmo com paciente em contexto, estas frases continuam globais se nao houver pronome/nome:

```text
agenda hoje
agenda hj
agenda amanha
agenda da semana
pagamentos hoje
pendencias
pacientes
```

### TTL sugerido

```text
contexto de paciente: 30 min
consulta de agenda: 15 min
pagamento/cancelamento/valor: 5 a 10 min
codigo sensivel: 5 min
selecao numerica: 15 min
```

### Prioridade de resolucao contextual

1. Confirmacao sensivel explicita com contexto unico.
2. Referencia explicita por nome/pronome/marcador contextual.
3. Workflow aguardando slot obrigatorio.
4. Consulta global consagrada.
5. Contexto ativo de paciente.
6. Contexto standby de paciente.
7. Parser local/Qwen.

### Autoridade entre contexto e workflow

Separar responsabilidades para evitar fontes concorrentes:

```text
conversation_contexts
= foco conversacional, entidade ativa, standby e retomada

active_pending/workflow
= acao incompleta, slots pendentes e confirmacao sensivel
```

Regra-guia:

```text
Contexto sugere.
Workflow coleta.
Confirmacao autoriza.
Banco executa.
```

Se houver conflito:

1. workflow sensivel aguardando confirmacao vence;
2. workflow aguardando slot vence;
3. referencia explicita vence;
4. consulta global consagrada vence;
5. contexto ativo apenas sugere;
6. contexto standby so sugere se reativado.

### Corte inicial para nao inflar estados

Implementar primeiro com limite controlado:

```text
1 contexto ativo de paciente
1 workflow sensivel ativo
ate 2 contextos standby
1 contexto leve de consulta de agenda
```

Multiplos contextos completos ficam para fase posterior.

### Data/hora solta nao executa direto

Com contexto de paciente:

```text
Michelle Rossini
amanha 11h
```

Nao deve criar agendamento direto.

Resposta segura:

```text
Agendar Michelle Rossini amanha as 11:00?
Responda sim para confirmar ou nao para cancelar.
```

Execucao direta so se ja houver workflow de agendamento aguardando data/hora:

```text
agenda ela amanha
Qual horario para agendar Michelle Rossini amanha?
11h
```

### Consultas globais declarativas

Criar lista/tabela fechada, nao heuristica espalhada:

```text
GLOBAL_QUERY_PATTERNS
- consultar_agenda
- consultar_pagamentos
- listar_pendencias
- listar_pacientes
- consultar_valor_global_atendimento
```

Essas consultas ignoram paciente contextual quando nao houver nome/pronome/marcador contextual.

### Pronome contextual

Nao inferir genero por nome ou cadastro.

Para `ela`, `ele`, `dela`, `dele`, usar apenas entidade ativa mais recente.

Se houver mais de uma candidata plausivel:

```text
Voce quer agendar qual paciente?
1. Michelle Rossini
2. Rafael Bonfim
```

### Ambiguidade

Se houver mais de um paciente contextual possivel e o usuario disser:

```text
agenda ela hj
```

o bot deve perguntar:

```text
Voce quer agendar qual paciente?
1. Michelle Rossini
2. Aurea Maria
```

Nunca confirmar pagamento, cancelamento ou alteracao de valor com `sim` se houver mais de um workflow sensivel aberto.

### Testes obrigatorios

```text
valor de todos os atendimentos
```

Deve consultar valor, nao pedir valor.

```text
Michelle Rossini
```

Deve buscar paciente e abrir contexto.

Resposta deve ser resumo operacional compacto, nao ficha tecnica completa.

```text
busca Michelle Rossini
```

Deve mostrar financeiro essencial, proximos horarios, alertas e menu numerado.

```text
busca Michelle Rossini
2
```

Deve abrir financeiro da Michelle.

```text
busca Michelle Rossini
4
```

Deve iniciar pagamento da Michelle.

```text
Busca Michelle Rossini
agenda hj
```

Deve consultar agenda global.

```text
Busca Michelle Rossini
agenda ela hj
```

Deve pedir horario para agendar Michelle.

```text
Busca Michelle Rossini
agenda ela hj
11h
```

Deve preencher horario no workflow da Michelle.

```text
Busca Michelle Rossini
agenda hj
manha
```

Deve refinar a consulta global da agenda, nao agendar Michelle.

```text
Busca Michelle Rossini
agenda hj
agenda ela hj
```

Primeiro consulta agenda global; depois abre agendamento contextual da Michelle.

```text
Michelle
amanha 11h
```

Deve abrir proposta de agendamento e pedir confirmacao, sem criar direto.

```text
Michelle
financeiro
```

Deve consultar financeiro da Michelle.

```text
Michelle
200 pix
sim
```

Deve criar apenas um workflow de pagamento e confirmar uma unica vez.

```text
Michelle
200 pix
agenda hoje
sim
```

`agenda hoje` deve consultar agenda global sem apagar o workflow financeiro; `sim` deve confirmar pagamento apenas se houver uma unica confirmacao sensivel aberta.

```text
Michelle
cancelar
```

Deve perguntar se o usuario quer cancelar a solicitacao atual ou algum atendimento da Michelle.

### Ordem de entrega

Bloco 1:

```text
1. consulta de valor global;
2. nome solto como busca;
3. formatter build_patient_search_summary;
4. contexto unico de paciente;
5. agenda global versus agenda contextual;
6. resposta curta para workflow aguardando slot;
7. confirmacao segura;
8. expiracao;
9. testes de conversas.
```

Bloco 2:

```text
1. standby;
2. continuar <paciente>;
3. agenda query context;
4. pronome contextual;
5. ambiguidade entre dois pacientes.
```

Bloco 3:

```text
multiplos contextos simultaneos completos.
```

### Documento detalhado

Especificacao completa salva em:

```text
C:/Users/gabri/OneDrive/Desktop/pipeline-chat-contextual-fisiobot.md
```

## Prioridade - valor coletivo de atendimento

- Criar intent operacional `definir_valor_global_atendimento` para frases em que o usuario define um valor coletivo de atendimento, sessao ou consulta para pacientes do profissional logado.
- Esta intent deve entrar no pipeline antes de `definir_valor_paciente`, `registrar_pagamento`, `agendar_atendimento` e fallback LLM/Qwen.
- Nao tratar `todos`, `geral`, `clientes`, `pacientes`, `atendimentos`, `sessoes` ou `consultas` como nome de paciente.
- A acao deve sempre respeitar `internal_user_id`; nunca atualizar pacientes de outro usuario.

## Variantes semanticas aceitas

- Termos de valor:
  - `valor`;
  - `preco`;
  - `preco padrao`;
  - `valor padrao`;
  - `quanto cobra`;
  - `quanto vou cobrar`;
  - `deixar em`;
  - `fica`;
  - `custa`.
- Termos ligados ao atendimento profissional:
  - `atendimento`;
  - `atendimentos`;
  - `sessao`;
  - `sessoes`;
  - `consulta`;
  - `consultas`;
  - `procedimento`;
  - `procedimentos`;
  - `servico`;
  - `servicos`;
  - `aula`;
  - `aulas`;
  - `terapia`;
  - `terapias`.
- Marcadores coletivos:
  - `todos`;
  - `todos os pacientes`;
  - `todos os clientes`;
  - `todos os atendimentos`;
  - `todas as sessoes`;
  - `todas as consultas`;
  - `geral`;
  - `global`;
  - `para todo mundo`;
  - `para todos sem valor`;
  - `pacientes sem valor`;
  - `clientes sem valor`.

## Exemplos que devem cair na nova intent

- `Valor de todos os atendimentos 129,35 reais`
- `Preco de todos 132`
- `Valor do atendimento de todos 129,84`
- `Valor de todas as sessoes 130 reais`
- `Preco das consultas de todos 150`
- `Todos os pacientes sem valor ficam 140`
- `Deixa o atendimento de todo mundo em 129,35`
- `Valor geral da consulta 160`
- `Valor global da sessao 150`
- `Clientes sem valor ficam 120 por atendimento`

## Fluxo de execucao

1. Parser local identifica a intent `definir_valor_global_atendimento`.
2. Extrator financeiro valida o valor informado.
3. Resolvedor semantico confirma que a frase e coletiva e nao contem paciente especifico.
4. Backend lista apenas pacientes do `internal_user_id` do usuario logado.
5. Backend separa os pacientes em dois grupos:
   - sem valor proprio: `Valor Padrao Atendimento` vazio, zero, nulo ou invalido;
   - com valor proprio: `Valor Padrao Atendimento` maior que zero.
6. Antes de alterar qualquer dado, criar pendencia de confirmacao com:
   - intent;
   - valor normalizado;
   - quantidade de pacientes sem valor;
   - quantidade de pacientes com valor proprio;
   - lista resumida dos pacientes afetados;
   - `internal_user_id`;
   - texto original;
   - etapa `confirmar_aplicar_sem_valor`.
7. Responder:
   - `Definir R$ X como valor dos atendimentos para N pacientes sem valor cadastrado? Existem M pacientes que ja possuem valor proprio e nao serao alterados agora. Responda sim para confirmar ou nao para cancelar.`
8. Se o usuario responder `nao`, cancelar sem gravar.
9. Se o usuario responder `sim`, atualizar apenas pacientes sem valor proprio.
10. Depois da primeira atualizacao, se houver pacientes com valor proprio, criar nova pendencia com etapa `confirmar_substituir_valores_existentes`.
11. Responder:
   - `Valor R$ X aplicado a N pacientes sem valor. Existem M pacientes que ja possuem valor definido. Deseja substituir tambem esses valores por R$ X? Responda sim ou nao.`
12. Se o usuario responder `sim` na segunda etapa, atualizar tambem os pacientes com valor proprio.
13. Se o usuario responder `nao` na segunda etapa, manter os valores proprios existentes.
14. Registrar resultado final com contagens:
   - pacientes sem valor atualizados;
   - pacientes com valor proprio atualizados;
   - pacientes preservados;
   - valor aplicado;
   - usuario responsavel.

## Regras de seguranca

- Nunca atualizar sem confirmacao explicita.
- Nunca executar a segunda etapa automaticamente.
- Nunca usar WhatsApp ID, Telegram ID, telefone ou CPF como ownership operacional; resolver sempre para `internal_user_id`.
- Se o valor estiver ilegivel, como `129,pp`, responder:
  - `Nao consegui ler o valor. Envie novamente como 129,35.`
- Se nao houver pacientes sem valor, perguntar diretamente se deseja atualizar pacientes que ja tem valor proprio.
- Se nao houver nenhum paciente cadastrado no escopo do usuario, responder que nao ha pacientes para atualizar.
- Se a frase contiver nome de paciente especifico, preferir `definir_valor_paciente` e nao a intent coletiva.
- Se houver ambiguidade entre coletivo e paciente chamado `Todos` ou semelhante, bloquear e pedir confirmacao clara.
- A intent coletiva nao deve cair em agenda, pagamento ou cadastro.

## Parser semantico

- Adicionar normalizacao semantica para agrupar `atendimento`, `sessao`, `consulta`, `procedimento`, `servico`, `aula` e `terapia` como termos equivalentes de servico profissional.
- Adicionar normalizacao semantica para plural/singular e acentos:
  - `sessao`/`sessao`;
  - `sessoes`;
  - `consulta`/`consultas`;
  - `atendimento`/`atendimentos`.
- O classificador local deve reconhecer a intent quando houver:
  - termo financeiro valido;
  - termo semantico de atendimento profissional;
  - marcador coletivo;
  - valor monetario parseavel.
- O parser deve retornar contrato estruturado:
  - `intent: definir_valor_global_atendimento`;
  - `confidence`;
  - `valor_atendimento`;
  - `scope: pacientes_sem_valor`;
  - `semantic_service_term`;
  - `collective_marker`;
  - `requires_confirmation: true`;
  - `pending_payload`.
- LLM/Qwen pode apoiar apenas quando a regra local nao atingir confianca suficiente, mas nao pode executar nem decidir ownership.

## Testes de regressao obrigatorios

- `Valor de todos os atendimentos 129,35 reais` deve pedir confirmacao para pacientes sem valor.
- `Preco de todos 132` deve reconhecer valor coletivo mesmo sem a palavra atendimento.
- `Valor do atendimento de todos 129,84` deve reconhecer valor coletivo e nao cair em agenda.
- `Valor de todas as sessoes 130 reais` deve reconhecer `sessao` como equivalente de atendimento.
- `Preco das consultas de todos 150` deve reconhecer `consulta` como equivalente de atendimento.
- `Todos os pacientes sem valor ficam 140` deve atualizar somente sem valor apos confirmacao.
- `Valor do atendimento da Michelle Rossini 192 reais` deve continuar usando `definir_valor_paciente`.
- `Michelle Rossini pagou 192 reais` deve continuar usando pagamento, nao valor global.
- `Agenda Michelle Rossini amanha 19h` deve continuar usando agenda.
- `Valor de todos os atendimentos 129,pp` deve pedir correcao do valor.
- Resposta `sim` da primeira etapa deve aplicar somente aos pacientes sem valor.
- Resposta `sim` da segunda etapa deve substituir tambem pacientes com valor proprio.
- Resposta `nao` da segunda etapa deve preservar pacientes com valor proprio.
- Todos os testes devem validar isolamento por `internal_user_id`.

## Validacao antes de deploy

- Rodar testes locais do parser com payloads Telegram/WhatsApp.
- Conferir `intent`, `confidence`, `valor_atendimento`, `scope`, `pending_payload` e resposta final.
- Conferir contagem real de pacientes afetados no SQLite/sheets antes e depois.
- Conferir que logs permanecem em UTF-8.
- Conferir que nao ha regressao em busca de paciente, pagamento, agenda e definicao de valor por paciente.
- Medir tempo do caminho local; meta abaixo de 300 ms sem LLM/Qwen.

## Fora do escopo deste update

- Nao incluir neste update o modo debug por comando, como `#DEBUG-INTENT Valor de todos os atendimentos 129,35`.
- A resposta detalhada com `intent`, `confidence`, caminho local/Qwen, campos extraidos e motivo da decisao fica reservada para update posterior.
- Neste update, a auditoria deve ficar limitada aos logs/testes internos necessarios para validar a intent coletiva sem expor um comando novo ao usuario final.

## Implementado no build 0.1.136 - update visual vanilla e agenda

- Cadastro vanilla ajustado para produto comercial: removida duplicidade de marca no painel lateral, removidos textos tecnicos e mantida acao `Salvar e sair` sem limpar a verificacao de WhatsApp.
- Login e tela de codigo deixam de mencionar React/SPA e passam a usar linguagem de produto.
- Onboarding segue fora do AppShell e sem menu lateral quando aberto pelo fluxo inicial.
- Menu lateral separado por perfil: usuario comum ve operacao e gestao basica; `Recursos`, `Usuarios` e `Debug intents` ficam restritos a admin.
- Dashboard produto ganhou cards superiores clicaveis como filtros para agenda e financeiro.
- Drawer de novo agendamento remove texto de mock e so exibe aviso durante erro/salvamento.
- Novo agendamento e registro de atendimento usam `Tipo de atendimento` como fonte unica; `Servico` duplicado foi removido dos formularios editaveis.
- Horario final continua obedecendo a duracao padrao do usuario/onboarding e e recalculado quando o tipo de atendimento muda.
- Validacao local: `npm run build:tablet` OK.

## Implementado no build 0.1.137 - dashboard clinico vanilla

- Dashboard operacional redesenhado com a referencia visual aprovada: sidebar compacta, topo de saudacao, acao `Nova consulta`, cards de proximo atendimento, pagamentos pendentes e recebido no mes.
- Acoes rapidas conectadas aos fluxos vanilla existentes de pagamento, atendimento, evolucao e relatorios.
- Agenda do dia recebeu tabela operacional com acoes `Abrir`, `Evoluir` e `Receber` ligadas a drawer, cadastro/evolucao e financeiro.
- Bloco de cadastro inicial/progresso incluido no dashboard para manter continuidade da configuracao do profissional.
- Sem alteracao na SPA React e sem deploy.

## Correcao 0.1.138

- Corrigida a formatacao de WhatsApp no dashboard vanilla para usar o helper existente, eliminando o erro de runtime ao abrir a rota `/dashboard`.
