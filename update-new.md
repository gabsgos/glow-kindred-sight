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

## Ajuste visual 0.1.139

- Interface do dashboard vanilla ampliada em 20% no desktop, com largura compensada para preservar o encaixe no viewport.

## Ajuste visual 0.1.140

- Navegacao lateral desktop convertida em drawer fixo e recolhivel, sem barra de rolagem propria.
- Dashboard passa a ocupar a largura util restante e agenda vazia nao mostra barra horizontal.

## Ajuste visual 0.1.141

- Drawer desktop permanece fixo enquanto o conteudo usa 100% da largura residual do viewport.
- Agenda recebeu uma trilha temporal horizontal com seis meses anteriores e seis posteriores para navegacao direta.
- A barra horizontal ficou restrita ao calendario quando a grade semanal, mensal ou anual precisar de largura adicional.

## Ajuste visual 0.1.142

- Dashboard usa toda a largura residual do viewport, sem uma coluna vazia a direita.
- Faixa de meses usa rotulos operacionais e um intervalo deslizante de seis meses antes e depois do mes ativo.
- Mini calendario tradicional do mes ativo permite selecionar um dia e carregar diretamente sua semana na agenda.

## Ajuste visual 0.1.143

- Mini calendario passou para a coluna lateral da agenda, preservando uma faixa de meses compacta e rolavel.
- Blocos Cadastro inicial e Seu progresso sao condicionais: aparecem apenas enquanto o onboarding estiver pendente e somem depois de `completedAt`.

## Ajuste visual 0.1.144

- Mini calendario compacto foi posicionado junto da faixa de meses; a grade semanal permanece em largura total.
- Mantida a regra de ocultar os paineis de onboarding depois da conclusao.

## Ajuste visual 0.1.145

- Mini calendario removido por decisao de usabilidade.
- Faixa de meses usa rotulos reduzidos para preservar mais espaco horizontal.

## Ajuste visual 0.1.146

- Dashboard passa a distribuir seis cards operacionais em duas linhas de tres, seguido da agenda do dia em largura total.
- Agenda usa faixa centralizada de nove meses sem ano e seletor mensal em popover ativado por Hoje ou pelo mes vigente.
- Busca foi removida do cabeçalho da agenda e os controles restantes foram alinhados.

## Ajuste visual 0.1.147

- Popover de mes ganhou setas para navegacao entre meses.
- Feriados nacionais e pontos facultativos federais de 2026 foram destacados no popover e nas grades da agenda.

## Ajuste visual 0.1.148

- Interface vanilla restaurada apos a quebra visual da rodada UX/UI anterior, preservando dashboard em duas linhas de tres cards e agenda sem mini calendario permanente.
- Identidade FISIA aplicada como camada visual: verde clinico para operacao e roxo reservado para acentos de inteligencia/assistente.
- Nomenclaturas visiveis principais atualizadas para o novo produto: `FISIA`, `Pacientes`, `Abrir paciente` e `Nao faturado`.
- Reforco de CSS para sidebar fixa, conteudo encaixado na largura util e reducao de conflito com regras roxas legadas.

## Ajuste visual 0.1.149

- Dashboard vanilla refeito no padrao do mock operacional FISIA: proximo atendimento em destaque, tres metricas superiores, agenda do dia e prioridades.
- Logo real removido da interface por decisao visual; sidebar volta a usar apenas o mock `F` como marcador temporario.
- Card lateral `Pergunte a Fisia` mantido como entrada visual de assistente e ligado a rota local de debug/assistente.
- Assets temporarios de logo removidos do pacote para evitar peso e confusao visual.
- Sem git e sem deploy.

## Hotfix 0.1.150

- Corrigido erro de runtime no novo dashboard: `slotsAbertos` agora e calculado dentro de `renderDashboardPro`.
- Dashboard volta a carregar sem cair para a tela de login por excecao JavaScript.
- Sem git e sem deploy.

## Proximo update P0 - modelo de linguagem contextual

Prioridade: extremamente urgente.

O proximo update do modelo deve transformar o chat em um nucleo conversacional formal, nao apenas em uma sequencia de parsers e pendencias. A regra de arquitetura fica:

```text
Contexto sugere.
Workflow coleta.
Confirmacao autoriza.
Banco executa.
```

### Objetivo

- separar intent, escopo, workflow e permissao de execucao;
- impedir que `sim`, numeros curtos, contexto de paciente e consulta global concorram de forma insegura;
- melhorar respostas de WhatsApp para serem operacionais, curtas e acionaveis;
- reduzir chamadas ao Qwen/LLM quando o caminho local for suficiente;
- proteger agenda, financeiro, cancelamentos e alteracoes de valor com confirmacao imutavel e idempotencia.

### Componentes obrigatorios

Implementar ou refatorar:

- `MessageFrame`: texto bruto, normalizado, entidades, datas, horarios, valores, formas de pagamento, referencias e intents candidatas.
- `ScopeResolver`: decide entre entidade explicita, workflow aberto, contexto ativo, standby, consulta global ou escopo desconhecido.
- `WorkflowEngine`: estados `proposed`, `collecting_slots`, `ready_for_confirmation`, `executing`, `completed`, `cancelled`, `expired`, `failed`, `superseded`.
- `RiskPolicy`: baixo risco executa; medio risco confirma quando inferido; alto risco confirma sempre.
- `ResponseFormatter`: monta texto final humano para WhatsApp sem despejar banco cru.

### Estado conversacional

Usar quatro registradores principais:

```text
focus
pending_workflow
query_context
selection_context
```

Complementar com:

```text
recent_entities: maximo 2
last_completed_action
```

### Roteamento prioritario

Ordem de decisao:

1. deduplicacao por `source_message_id`;
2. admin/debug;
3. meta-intents;
4. confirmacao/negacao somente se a mensagem for confirmacao-shaped;
5. selecao numerica valida por `selection_context_id`;
6. entidade ou referencia explicita;
7. comando novo completo;
8. correcao ou preenchimento de workflow;
9. consulta global declarativa;
10. comando curto usando `focus`;
11. retomada de contexto;
12. classificador local;
13. Qwen/LLM fallback;
14. desambiguacao.

### Meta-intents

Adicionar:

- `correct_previous_slot`;
- `cancel_current_workflow`;
- `replace_entity`;
- `undo_last_action`;
- `resume_context`;
- `explain_current_state`.

Exemplos:

```text
nao, segunda
troca para Rafael
cancela essa solicitacao
continua Michelle
o que esta aberto agora?
desfaz ultimo pagamento
```

### Confirmacao e idempotencia

Toda acao sensivel deve gerar snapshot imutavel:

```text
confirmation_id
workflow_id
payload_hash
action
entity_id
entity_name
amount
payment_method
expires_at
state_version
```

Toda escrita deve usar:

```text
source_message_id
workflow_id
action_fingerprint
idempotency_key
```

Fila por conversa:

```text
internal_user_id + channel + chat_id
```

### Regra corrigida para data/hora solta

Data/hora sem nome nao agenda sozinha. Ela so agenda quando houver exatamente um paciente ativo, valido, nao expirado e nao ambiguo.

Exemplo:

```text
Michelle Rossini
amanha 11h
```

Resultado:

```text
propor agendamento de Michelle Rossini amanha as 11h
```

Mas:

```text
agenda amanha
```

continua sendo consulta global de agenda.

### Respostas de WhatsApp

`Busca pacientes` deve abandonar ID interno e tabela tecnica.

Formato alvo:

```text
Encontrei 6 pacientes:

1. Aurea Maria - R$ 167,66 em aberto
2. Rafael Bonfim - R$ 167,66 em aberto
3. Gabrielle Paiva - sem pendencias
4. Iara Noto - sem pendencias
5. Luiza Schchohc - sem atendimentos
6. Michelle Rossini - proximo atendimento em 21/06 as 11h

Responda com o numero ou nome do paciente.
```

`Busca Michelle Rossini` deve virar resumo operacional:

```text
Michelle Rossini

Agenda
- Proximo atendimento: 21/06 as 11h

Financeiro
- Valor por sessao: R$ 192,00
- Credito disponivel: R$ 8.396,66
- Em aberto: R$ 0,00

Atencao
- Pagamentos registrados sem atendimento concluido
- Horarios antigos ainda marcados como agendados

O que deseja fazer?
1. Registrar atendimento
2. Ver agenda
3. Ver financeiro
4. Registrar pagamento
5. Verificar inconsistencias
6. Abrir cadastro
```

Nao exibir por padrao:

- CPF;
- endereco;
- nascimento;
- campos vazios;
- status tecnico;
- todos os pagamentos;
- todos os agendamentos antigos;
- historico completo.

### Formatters a criar

- `build_patient_list_summary(...)`;
- `build_patient_search_summary(...)`;
- `build_financial_summary(...)`;
- `build_agenda_summary(...)`;
- `build_open_state_summary(...)`.

Os formatters devem receber payload operacional estruturado. Nao devem consultar banco diretamente nem chamar LLM.

### Alertas e inconsistencias

Detectar:

- pagamentos sem atendimento correspondente;
- atendimentos sem evolucao;
- agendamentos passados ainda como agendados;
- credito maior que total recebido rastreavel;
- credito negativo;
- pagamento sem forma informada;
- paciente sem telefone;
- valor de atendimento ausente;
- conflito entre pacote, credito do paciente, desconto, isencao e pagamento.

### Otimizacao operacional

- cache curto para pacientes por `internal_user_id`;
- normalizadores e regex compilados no start do worker;
- caminho local antes de Qwen/LLM;
- timeout por camada;
- limpeza periodica de contextos expirados;
- lock curto por workflow sensivel;
- metricas de tempo por etapa;
- logs estruturados, sem dados sensiveis desnecessarios;
- debug de arvore de decisao apenas para admin.

### Testes obrigatorios

Criar bateria stateful:

```text
initial_state + turns -> expected_response + expected_state + expected_action
```

Primeiro corte:

- 50 conversas completas;
- 200 turnos;
- agenda, pagamento, evolucao, atendimento, busca, valor global, cancelamento e correcao.

Casos obrigatorios:

```text
Busca pacientes -> 6
Michelle Rossini -> amanha 11h -> sim
Michelle Rossini -> agenda hoje -> agenda ela hoje -> 11h
pagamento Rafael -> 167,66 pix -> nao, dinheiro -> sim
valor de todos os atendimentos
valor de todos 180 -> sim -> nao
busca Michelle -> 4 -> 200 pix -> sim
cancelar
o que esta aberto agora?
```

### Criterios de aceite

- nenhuma escrita sensivel sem confirmacao vinculada a snapshot;
- `agenda hj` nunca agenda paciente por contexto implicito;
- `agenda ela hj` usa paciente ativo quando unico;
- numero curto so responde ao menu que o gerou;
- `sim` sozinho nao confirma se houver mais de uma pendencia sensivel;
- busca de paciente vira resumo acionavel;
- Qwen/LLM nao executa banco diretamente;
- testes locais passam antes de qualquer deploy.

### Identidade da assistente Fisia

Prioridade: extremamente urgente.

A FISIA e o produto. A Fisia e a inteligencia conversacional dentro dele.

Papel:

```text
secretaria clinica extremamente organizada, rapida e confiavel
```

Definicao:

```text
A Fisia entende o que voce quer fazer, organiza o que falta e executa somente o que estiver seguro e autorizado.
```

Posicionamento:

```text
A Fisia reduz o trabalho de organizar. O profissional continua decidindo.
```

Nao deve parecer:

- chatbot generico;
- robo animado;
- IA medica;
- mascote infantil;
- profissional que decide pela clinica.

Funcoes principais:

- assistente operacional;
- secretaria clinica;
- navegadora do sistema;
- guardia da consistencia;
- facilitadora de registros.

Personalidade:

```text
calor_humano: 6/10
objetividade: 9/10
formalidade: 5/10
proatividade: 8/10
humor_na_operacao: 1/10
humor_no_marketing: 7/10
assertividade: 8/10
verbosidade_padrao: 3/10
```

Ordem da resposta:

1. confirmar o que entendeu;
2. mostrar o dado principal;
3. informar pendencias ou riscos;
4. oferecer a proxima acao.

Padrao WhatsApp:

```text
1 a 5 linhas
```

Detalhes somente sob demanda.

Regras de linguagem:

- usar voz ativa;
- usar `voce`, `seu` e `sua`;
- usar nome completo do paciente na primeira referencia;
- usar primeiro nome depois apenas se nao houver ambiguidade;
- nao usar termos internos como payload, intent, workflow ou entity;
- nao vazar status tecnico como `scheduled`, `unbilled`, `credit_internal`.

Fontes de verdade:

```text
O banco informa.
O contexto orienta.
A memoria ajuda.
A inferencia sugere.
```

Inferencia nunca vira fato sem validacao.

Politica de risco ampliada:

- baixo risco: busca, consulta, saldo, historico e abrir tela;
- medio risco: agendar, reagendar, evolucao e editar cadastro;
- alto risco: pagamento, credito do paciente, cancelamento, alterar valor e pacote;
- muito alto: excluir paciente, apagar evolucao, estornar pagamento, acoes em massa e redefinir financeiro.

Para risco muito alto, exigir confirmacao reforcada:

```text
Digite EXCLUIR para confirmar.
```

Vocabulário oficial:

```text
Paciente
Atendimento
Agendamento
Evolucao
Avaliacao
Pagamento
Recebimento
Em aberto
Credito do paciente
Cartao de credito
Concluido
Nao faturado
```

Frase de controle:

```text
A Fisia nao conversa para parecer inteligente. Ela conversa para fazer a rotina andar.
```

### Contrato pratico do ConversationalKernel

Prioridade: extremamente urgente.

O kernel nao e outro modelo de IA. Ele e a camada central que coordena:

```text
intent_pipeline.py
conversation_workflow.py
contextos
active_pending
banco
formatadores de resposta
```

Definicao:

```text
Uma camada deterministica de orquestracao que transforma mensagem, contexto e workflows abertos em um plano de acao unico, seguro e auditavel.
```

Regra executiva:

```text
Texto sugere.
Estado valida.
Risco decide.
Confirmacao autoriza.
Executor grava.
```

O kernel deve ficar acima do parser e do workflow:

```text
WhatsApp/Telegram/Web
-> ConversationalKernel
   -> IntentPipeline
   -> ContextResolver
   -> WorkflowManager
   -> RiskPolicy
   -> ActionExecutor
   -> ResponseFormatter
```

Criar modulo:

```text
conversational_kernel.py
```

Responsabilidades:

- carregar estado da conversa;
- normalizar e enquadrar a mensagem;
- chamar parser de intent;
- resolver contexto e referencias;
- verificar workflows abertos;
- aplicar politica de risco;
- montar plano de acao;
- executar, responder, pedir slot ou pedir confirmacao;
- atualizar contexto;
- formatar resposta.

O kernel deve responder sempre uma destas decisoes:

```text
ANSWER
REQUEST_SLOT
REQUEST_CONFIRMATION
EXECUTE
```

E retornar `KernelResult`, nao apenas intent:

```text
conversation_key
message_id
interpretation
entities
sources
decision
risk
action_plan
state_changes
response
```

### Multi-intent

Prioridade: extremamente urgente.

Uma mensagem pode gerar varias acoes. O kernel deve montar plano, nao escolher uma intent unica.

Exemplo:

```text
Atendi Michelle hoje, fizemos treino de marcha e ela pagou 200 no pix.
```

Plano:

```text
1. registrar_atendimento
2. registrar_evolucao, dependente do atendimento
3. registrar_pagamento, dependente do atendimento e com confirmacao
```

Classificar relacoes:

- dependentes;
- independentes;
- compartilhadas;
- contraditorias.

Se houver contradicao:

```text
Voce pediu para agendar e cancelar Michelle amanha.

Qual acao deseja realizar?
1. Agendar as 11h
2. Cancelar o atendimento existente
```

Confirmar pacote quando as acoes forem do mesmo evento:

```text
Vou registrar para Michelle Rossini:

- Atendimento hoje
- Evolucao: treino de marcha
- Pagamento de R$ 200,00 via PIX

Confirmar?
```

Quando misturar consulta e escrita sensivel, executar a consulta e deixar a escrita aguardando confirmacao.

Usar transacao quando as acoes forem fortemente ligadas. Para acoes independentes, permitir resultado parcial com status por acao.

### Concorrencia e isolamento

Prioridade: extremamente urgente.

Separar:

```text
Multi-intent = planejamento.
Multiplos usuarios = isolamento e concorrencia.
```

Regra-mestra:

```text
Uma mensagem pode gerar varias acoes.
Uma conversa processa uma mensagem por vez.
Conversas diferentes processam em paralelo.
Recursos compartilhados sao protegidos pelo banco.
Acoes repetidas sao bloqueadas por idempotencia.
```

Usar chave:

```text
tenant_id + internal_user_id + channel + chat_id
```

Regra:

```text
paralelo entre conversas
serial dentro da mesma conversa
```

Nao usar lock global. Usar lock por conversa.

Producao inicial recomendada:

```text
PostgreSQL como fila, lock, estado e outbox.
```

Fluxo:

```text
Webhook recebe mensagem
-> salva em inbound_messages
-> worker pega proxima mensagem
-> adquire lock da conversation_key
-> carrega estado
-> kernel cria plano
-> executor valida e executa
-> atualiza estado
-> salva resposta em outbox
-> commit
-> envia resposta
```

Tabelas minimas:

- `inbound_messages`;
- `conversation_states`;
- `action_plans`;
- `message_outbox`.

Usar `pg_advisory_xact_lock(hashtext(conversation_key))` quando o banco for PostgreSQL.

### Migracao PostgreSQL 100% funcional

Prioridade: extremamente urgente.

A migracao para PostgreSQL passa a ser requisito do proximo update do modelo conversacional. O kernel precisa de concorrencia real, transacoes, idempotencia, fila por conversa, outbox e auditoria. SQLite/local continua aceitavel para debug, mas nao deve ser a base final do fluxo multiusuario com WhatsApp, agenda e financeiro.

#### Motivo tecnico

PostgreSQL resolve os pontos criticos do novo modelo:

- mensagens quase simultaneas do WhatsApp;
- retry do Baileys;
- workflows aguardando confirmacao;
- multi-intent em uma mesma mensagem;
- pagamento duplicado;
- conflito de agenda;
- contexto de conversa persistente;
- outbox transacional;
- auditoria de acoes sensiveis;
- locks por conversa e por recurso compartilhado.

#### Estrategia segura

Nao trocar tudo de uma vez.

Fases obrigatorias:

1. Criar schema PostgreSQL em paralelo.
2. Migrar primeiro estado conversacional, filas, outbox e idempotencia.
3. Migrar agenda, financeiro, pacientes, evolucoes e atendimentos.
4. Criar camada de repositorio para esconder temporariamente SQLite/PostgreSQL.
5. Rodar importador dos bancos atuais.
6. Validar contagens, saldos, agenda, pagamentos, credito do paciente e evolucoes.
7. Rodar bateria local do kernel em PostgreSQL.
8. So apontar producao para PostgreSQL depois de validacao completa.

#### Schema operacional minimo

Criar:

```text
inbound_messages
conversation_states
action_plans
message_outbox
idempotency_keys
audit_events
```

Campos essenciais:

```text
tenant_id
internal_user_id
conversation_key
external_message_id
workflow_id
plan_id
action_fingerprint
idempotency_key
status
payload_json
state_json
created_at
updated_at
expires_at
processed_at
```

Indices obrigatorios:

```sql
UNIQUE (tenant_id, external_message_id)
UNIQUE (tenant_id, idempotency_key)
INDEX (conversation_key, created_at)
INDEX (status, created_at)
INDEX (tenant_id, internal_user_id)
```

#### Schema de dominio

Normalizar ou compatibilizar:

```text
professionals/users
patients
appointments
attendances
evolutions
payments
patient_credits
packages
appointment_audit_events
payment_audit_events
```

Regras:

- toda tabela sensivel precisa de `tenant_id`/`internal_user_id`;
- toda escrita sensivel precisa registrar origem;
- pagamentos precisam de idempotencia;
- agenda precisa bloquear sobreposicao;
- credito do paciente precisa ledger, nao apenas saldo solto;
- pacote, desconto, isencao e forma de pagamento permanecem separados.

#### Fluxo alvo

```text
Webhook recebe mensagem
-> salva em inbound_messages
-> worker pega proxima mensagem pendente
-> adquire lock por conversation_key
-> carrega conversation_state
-> ConversationalKernel monta action_plan
-> RiskPolicy decide confirmacao ou execucao
-> Executor valida regras de banco
-> grava dominio em transacao
-> grava resposta em message_outbox
-> commit
-> sender envia WhatsApp/Telegram
-> marca outbox como sent
```

#### Lock correto

Nao usar lock global.

Usar lock por conversa:

```text
tenant_id + internal_user_id + channel + chat_id
```

Em PostgreSQL:

```sql
SELECT pg_advisory_xact_lock(hashtext(:conversation_key));
```

Para recursos compartilhados, usar protecoes especificas:

- agenda: constraint/lock contra horario sobreposto;
- pagamento: `idempotency_key` unico;
- paciente: versionamento otimista quando houver edicao concorrente;
- credito: ledger transacional;
- outbox: envio somente apos commit.

#### Camada de repositorio

Criar interfaces para separar regra de negocio do banco:

```text
ConversationStateRepository
InboundMessageRepository
OutboxRepository
PatientRepository
AppointmentRepository
AttendanceRepository
PaymentRepository
CreditLedgerRepository
AuditRepository
```

Objetivo:

- permitir migracao faseada;
- facilitar testes locais;
- evitar SQL espalhado no kernel;
- permitir rollback controlado durante a transicao.

#### Importador dos bancos atuais

Criar importador idempotente:

```text
sqlite -> postgres
```

Validacoes obrigatorias:

- quantidade de pacientes por usuario;
- agenda por paciente;
- atendimentos concluidos;
- evolucoes vinculadas;
- pagamentos por paciente;
- saldo de credito do paciente;
- valores em aberto;
- pacotes;
- registros sem dono/tenant;
- registros duplicados;
- datas invalidas;
- formas de pagamento ambíguas.

O importador deve gerar relatorio:

```text
importados
ignorados
corrigidos
duplicados
inconsistentes
pendentes de revisao
```

#### Testes obrigatorios em PostgreSQL

Minimo:

- bateria stateful do kernel;
- multi-intent com transacao;
- pagamento duplicado por retry;
- duas mensagens da mesma conversa chegando juntas;
- duas conversas em paralelo;
- conflito de agenda no mesmo horario;
- outbox nao envia antes do commit;
- confirmacao expirada nao executa;
- rollback de pacote atendimento + evolucao + pagamento;
- importador rodando duas vezes sem duplicar dados.

#### Criterios de aceite

- PostgreSQL sobe localmente com schema completo;
- SQLite nao e mais requisito para o kernel em producao;
- estado conversacional persiste em PostgreSQL;
- inbound/outbox funcionam com idempotencia;
- agenda bloqueia conflito real;
- pagamento duplicado nao grava duas vezes;
- credito do paciente usa ledger;
- importador valida os DBs atuais;
- testes locais passam usando PostgreSQL;
- deploy so ocorre apos backup completo, salvo ordem explicita em contrario.

### Ajustes P0 do kernel antes da implementacao ampla

Prioridade: extremamente urgente.

O kernel novo nao deve coexistir como mais uma camada paralela ao pipeline antigo. Ele precisa absorver, organizar e encapsular as capacidades atuais. O risco principal e criar dois caminhos decisorios:

```text
Caminho A: comandos diretos
Caminho B: kernel/workflow
```

Isso faria mensagens como `sim`, `6`, `amanha 11h`, `cancelar` e `Michelle` terem comportamento diferente dependendo do ponto de entrada.

Regra nova:

```text
Depois de autenticacao e deduplicacao, todo caminho operacional passa pelo ConversationalKernel.
```

Comandos diretos nao desaparecem. Eles viram resolvers prioritarios dentro do kernel:

```text
ConversationalKernel
-> DebugResolver
-> DirectCommandResolver
-> MetaIntentResolver
-> SelectionResolver
-> WorkflowResolver
-> GlobalQueryResolver
-> ContextResolver
-> IntentPipeline
-> ActionPlan
-> Executor
```

#### Fase 1: kernel como fachada

Nao reescrever parser nem executor no primeiro corte.

O kernel deve chamar rotas existentes, receber os resultados e devolver `KernelResult`.

Migrar primeiro:

- selecao numerica;
- resposta de slot;
- confirmacao;
- paciente ativo;
- agenda global;
- comandos diretos que hoje executam antes do workflow.

#### Plano antes de execucao

Separar planejamento de efeito colateral.

Contrato alvo:

```python
frame = kernel.build_frame(message)
plan = kernel.create_plan(frame, state)
execution_result = action_executor.execute(plan)
new_state = kernel.reduce_state(state, plan, execution_result)
```

`KernelPlan` nao escreve no banco:

```json
{
  "decision": "EXECUTE",
  "actions": [],
  "state_effects": [],
  "response_spec": {},
  "expected_state_version": 18
}
```

Beneficios:

- teste sem banco;
- replay seguro;
- auditoria;
- comparacao entre plano e execucao;
- idempotencia;
- menor risco de salvar contexto parcial.

#### Ordem de roteamento corrigida

Ordem P0:

```text
1. Autenticacao e autorizacao
2. Deduplicacao da mensagem
3. Meta-intents: corrigir, cancelar fluxo, trocar paciente, retomar, desfazer
4. Selecao numerica valida
5. Confirmacao/negacao somente se tiver formato compativel
6. Novo comando completo com entidade explicita
7. Resposta ao slot esperado por workflow
8. Consulta global declarativa
9. Comando curto usando paciente em foco
10. Refinamento de query_context
11. Retomada explicita de entidade recente
12. Classificador lexical/vetorial
13. Fallback Qwen/LLM
14. Desambiguacao
```

Novo comando completo deve vencer workflow aberto.

Exemplo:

```text
Workflow aberto: confirmar pagamento da Michelle
Usuario: Rafael pagou 300 no pix
```

Resultado:

```text
novo comando completo para Rafael, nao resposta ao workflow da Michelle
```

#### Origens de slot

Diferenciar contexto vinculado de inferencia fraca.

Criar:

```text
explicit_current_message
workflow_bound
focus_bound
pronoun_resolved
heuristic_inference
llm_suggested
```

`focus_bound` e confiavel quando:

- existe exatamente um paciente ativo;
- contexto nao expirou;
- nao existe workflow incompativel;
- nao existe outro paciente explicito;
- nao existe conflito de agenda.

Politica:

```text
focus_bound + data explicita + hora explicita
-> pode executar agendamento diretamente
```

Caso esperado:

```text
Michelle Rossini
amanha 11h
```

Resposta esperada:

```text
Agendamento criado para Michelle Rossini amanha as 11h.
```

Sem paciente ativo:

```text
amanha 11h
```

Resposta:

```text
Para qual paciente?
```

#### Separacao logica de estados

`active_pending` nao deve virar deposito de toda memoria conversacional.

Separacao minima:

```text
conversation_state
-> focus
-> recent_entities
-> query_context
-> selection_context

active_pending
-> pending_workflow

execution
-> action_plan
-> execution_status
-> idempotency
```

Mesmo que a primeira versao use tabela unica, o codigo deve tratar essas fronteiras.

#### `nao, dinheiro` corrige slot

Negacao com substituicao nao cancela workflow.

Exemplo:

```text
Bot: Registrar R$ 167,66 via PIX para Rafael?
Usuario: nao, dinheiro
```

Transicao:

```text
WAITING_CONFIRMATION
-> patch payment_method = dinheiro
-> gerar novo snapshot
-> WAITING_CONFIRMATION
```

Resposta:

```text
Certo. Registrar R$ 167,66 em dinheiro para Rafael Bonfim?
```

Regra:

```python
if starts_with_denial(message) and has_replacement_value(message):
    return CORRECT_PREVIOUS_SLOT
```

#### Multi-intent com vinculo semantico

Nao vincular pagamento automaticamente ao atendimento apenas por aparecerem na mesma frase.

Classificar relacao:

```text
same_event
settle_open_debt
prepayment
package_purchase
independent
unknown
```

Exemplo:

```text
Atendi Michelle hoje e ela pagou as duas sessoes atrasadas.
```

O pagamento deve ser `settle_open_debt`, nao `same_event`.

Cada acao precisa de `entity_id` proprio.

Exemplo:

```text
Atendi Michelle hoje e Rafael pagou 200.
```

Plano:

```json
{
  "actions": [
    {
      "id": "A1",
      "type": "register_attendance",
      "entity_id": "MICHELLE"
    },
    {
      "id": "A2",
      "type": "register_payment",
      "entity_id": "RAFAEL"
    }
  ]
}
```

#### Grupos transacionais

Evitar atomicidade excessiva.

Usar grupos:

```json
{
  "transaction_groups": [
    {
      "id": "TG1",
      "actions": ["register_attendance", "register_evolution"],
      "atomic": true
    },
    {
      "id": "TG2",
      "actions": ["register_payment"],
      "atomic": true
    }
  ]
}
```

Nao manter transacao aberta enquanto:

- chama Qwen;
- envia WhatsApp;
- consulta API externa;
- aguarda confirmacao.

#### Lock curto

`pg_advisory_xact_lock` deve ser curto.

Fluxo:

```text
1. Mensagem entra em inbound_messages
2. Worker reivindica a proxima mensagem da conversa
3. Carrega snapshot do estado
4. Kernel monta plano
5. Abre transacao curta
6. Trava estado da conversa
7. Revalida versao
8. Executa alteracoes de banco
9. Salva novo estado e outbox
10. Commit
11. Envia resposta fora da transacao
```

Se a versao mudou:

```text
recalcular plano
```

#### Idempotencia em tres niveis

1. Mensagem:

```text
external_message_id UNIQUE
```

2. Workflow:

```text
workflow_id + version
```

3. Acao de dominio:

```text
idempotency_key UNIQUE
```

Isso protege pagamento, agendamento, evolucao, atendimento, estorno e acoes em massa.

#### Undo restrito

`undo_last_action` nao deve apagar registros sensiveis.

Classificar:

```text
reversible_directly
reversible_by_compensation
not_reversible
```

Regras:

- agendamento recente: pode cancelar;
- pagamento: gerar estorno compensatorio;
- evolucao assinada: criar correcao/nova versao;
- exclusao de paciente: normalmente nao reversivel diretamente;
- consulta: nao precisa desfazer.

#### Organizacao documental

Separar futuramente:

```text
docs/conversation/architecture.md
docs/conversation/behavior-spec.md
docs/conversation/migration-plan.md
docs/conversation/changelog.md
```

`architecture.md`: kernel, frame, workflow, executor, outbox e concorrencia.

`behavior-spec.md`: casos conversacionais.

`migration-plan.md`: ordem de substituicao.

`changelog.md`: implementado, testado, nao implantado.

#### Criterios P0 adicionais

- Todo caminho operacional passa pelo kernel.
- Comandos diretos nao executam fora do `ActionPlan`.
- `active_pending` nao e fonte de foco de paciente.
- `focus_bound` nao e inferencia heuristica.
- `Michelle -> amanha 11h` executa diretamente quando contexto for valido.
- `amanha 11h` sem paciente ativo pede paciente.
- Cada acao multi-intent possui `entity_id` proprio.
- Pagamento nao e vinculado automaticamente ao atendimento atual.
- `nao, X` corrige slot antes de cancelar workflow.
- Envio ao WhatsApp ocorre fora da transacao.
- Desfazer pagamento gera estorno, nao exclusao.
- Multi-intent so entra depois de intent unica, contexto, confirmacao e idempotencia estarem estaveis.

Toda escrita deve ter `idempotency_key` no dominio. Exemplo:

```text
payment:tenant_12:patient_M8ABN0T:20000:pix:workflow_WF123
```

Agenda e cadastro precisam de protecao propria no banco:

- agenda: verificar sobreposicao com lock/constraint;
- paciente/cadastro: usar versao otimista;
- se houve alteracao concorrente, recarregar dados antes de continuar.
