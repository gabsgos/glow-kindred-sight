# Proximo update - integracao FisioBot web

Criado em: 2026-05-25 09:26 -03:00 America/Sao_Paulo

## URGENTE - 2026-06-20 - coerencia financeira, agenda real e duracao padrao

Status em 2026-06-20:
- Implementacao iniciada na interface vanilla (`src/vanilla/main.ts`), que e a interface publica atual.
- Concluido no frontend vanilla: botao `WhatsApp` trocado por `Agendar`, pre-preenchimento por `patient_id`, valor padrao do paciente/profissional, calculo automatico de hora final por duracao padrao, remocao do mock visual de registrar atendimento, POST real para `/api/web/agenda`, exibicao `Valor nao definido` quando nao houver valor e modal de `Registrar pagamento` na tela Financeiro.
- Pendente de backend/validacao remota: garantir endpoint avulso `/api/web/pagamentos` ou contrato equivalente, persistencia transacional de pagamento sem atendimento vinculado, recalculo dos agregados no backend e teste ponta a ponta com Flask real.

### URGENTE - tipos de atendimento configuraveis e modelo financeiro correto

Adicionar ao proximo update como requisito de produto e banco, antes de vender o fluxo financeiro:

Status em 2026-06-20:
- Implementado localmente no backend de teste `tablet_backend/local_web_backend.py`:
  - migracao/criacao de `appointment_types`, `patient_billing_profiles`, `charges`, `payments`, `payment_allocations`, `package_definitions`, `patient_packages` e `package_movements`;
  - seed de 13 tipos de atendimento;
  - endpoint `/api/web/appointment-types`;
  - criacao de agendamento com `appointment_type_id`, snapshot do tipo e `billing_snapshot`;
  - cobranca em centavos, desconto percentual/fixo, isencao, status financeiro novo e alocacao de pagamento em `charges/payments/payment_allocations`;
  - pagamento vinculado ao agendamento atualiza `charge` para `PAID/PARTIALLY_PAID/OVERPAID`.
- Implementado na interface vanilla:
  - onboarding passou a usar lista ampliada de tipos de atendimento;
  - drawer de novo agendamento ganhou `Tipo de atendimento`, `Modelo de cobranca`, desconto e tipo de isencao;
  - mudanca do tipo recalcula servico, duracao/fim e valor sugerido;
  - aba financeira do detalhe do atendimento mostra modelo, valor-base, valor final, recebido e saldo.
- Ainda pendente para producao/remoto:
  - portar as migracoes para o backend Flask real do tablet;
  - ligar comandos WhatsApp/parser a `charges/payments/packages`;
  - telas completas de venda/consumo/estorno de pacote;
  - relatorios separados por valor de tabela, desconto, isencao, recebido, pacote e contas a receber.

1. Tipos de atendimento devem ser entidade/configuracao propria, nao texto solto.
   - Tipos pre-configurados obrigatorios no onboarding/sign up:
     - `Presencial`;
     - `Grupo`;
     - `Domiciliar`;
     - `Online`.
   - Tipos adicionais sugeridos conforme profissao/rotina do usuario:
     - `Avaliacao`;
     - `Retorno`;
     - `Reavaliacao`;
     - `Teleatendimento`;
     - `Hospitalar`;
     - `Academia ou studio`;
     - `Evento/externo`;
     - `Orientacao familiar/cuidador`;
     - `Outro`.
   - No sign up/onboarding, carregar lista inicial por profissao e permitir marcar quais tipos usa.
   - Cada tipo deve permitir configuracao de:
     - ativo/inativo;
     - duracao padrao;
     - valor padrao opcional;
     - cor/identificador visual na agenda;
     - presencialidade/local padrao quando aplicavel;
     - se aceita grupo e limite de participantes quando aplicavel.
   - No card/drawer de agendamento do paciente, `Tipo de atendimento` deve ser selecionavel e editar automaticamente:
     - duracao sugerida;
     - valor sugerido;
     - exibicao do card na agenda;
     - regra financeira inicial quando houver configuracao por tipo.
   - Precedencia do valor no agendamento:
     1. valor manual do atendimento;
     2. valor individual do paciente;
     3. valor padrao do tipo de atendimento;
     4. valor padrao do profissional;
     5. sem valor definido.
   - O atendimento deve guardar `appointment_type_id` e snapshot textual/numerico do tipo usado, para historico nao mudar se a configuracao for alterada depois.

2. Modelo financeiro do anexo deve entrar como urgente.
   - Principio central: `Pacote`, `Individual`, `Isento` e `Desconto` nao sao formas de pagamento; sao modelo de cobranca/modificadores.
   - Formas oficiais de pagamento continuam separadas:
     - `PIX`;
     - `Dinheiro`;
     - `Debito`;
     - `Cartao de credito`;
     - `Transferencia`;
     - `Outro`.
   - Nunca usar somente `Credito` como forma de pagamento. Separar:
     - `Cartao de credito`;
     - `Credito do paciente`/saldo monetario interno;
     - sessoes de pacote.
   - Todo atendimento deve gerar/ter um `billing_snapshot` imutavel com:
     - `billing_model`: `INDIVIDUAL`, `PACKAGE` ou `EXEMPT`;
     - `base_amount_cents`;
     - `discount_type`: `NONE`, `PERCENTAGE` ou `FIXED_AMOUNT`;
     - `discount_value`;
     - `discount_amount_cents`;
     - `exemption_type` e `exemption_reason`, quando aplicavel;
     - `final_amount_cents`;
     - `price_source`: `appointment_override`, `patient_default`, `service_default`, `professional_default` ou `manual_override`;
     - `package_id`/`patient_package_id` quando aplicavel.
   - Valores monetarios devem ser persistidos em centavos inteiros, nao float.
   - Estados financeiros precisam ser mais claros que `pendente`:
     - `UNBILLED`;
     - `OPEN`;
     - `PARTIALLY_PAID`;
     - `PAID`;
     - `OVERPAID`;
     - `EXEMPT`;
     - `CANCELLED`;
     - `REFUNDED`.
   - `R$ 0,00 pago` nao deve ser exibido para isencao, pacote consumido ou sem valor definido.
     - Isento: mostrar `ISENTO` + motivo + valor de referencia.
     - Pacote: mostrar `1 sessao do pacote utilizada` + valor de referencia, sem duplicar caixa.
     - Sem valor: mostrar `Valor nao definido`.

3. Estrutura de dados financeira a implementar no proximo update.
   - Criar/migrar tabelas:
     - `appointment_types`;
     - `patient_billing_profiles`;
     - `charges`;
     - `payments`;
     - `payment_allocations`;
     - `package_definitions`;
     - `patient_packages`;
     - `package_movements`.
   - `charges` representa a cobranca gerada por atendimento, compra de pacote, ajuste manual ou falta.
   - `payments` representa dinheiro que entrou.
   - `payment_allocations` liga um pagamento a uma ou mais cobrancas.
   - `package_movements` registra compra, consumo, estorno, expiracao e ajustes; nunca apenas decrementar saldo sem movimento.
   - Toda linha deve carregar `internal_user_id`.
   - Alterar regra do paciente/tipo/profissional nao altera snapshots antigos.

4. Fluxo financeiro no drawer de atendimento/agendamento.
   - Aba financeira deve perguntar `Como este atendimento sera cobrado?`
     - `Individual`;
     - `Usar pacote`;
     - `Isento`.
   - Individual:
     - mostrar valor-base, origem do valor, desconto, valor final, pago e saldo.
     - permitir `Receber agora` ou `Deixar a receber`.
   - Pacote:
     - listar pacote ativo, sessoes restantes, validade e valor de referencia;
     - consumir somente quando atendimento for marcado como realizado e cobranca como pacote for confirmada;
     - se houver mais de um pacote, sugerir o que vence primeiro e permitir troca;
     - se pacote vencido, perguntar prorrogar, cobrar individualmente, consumir excepcionalmente ou cancelar.
   - Isento:
     - selecionar tipo: `VIP`, `CORTESIA`, `PRO_BONO`, `FAMILIAR`, `PARCERIA`, `FUNCIONARIO`, `PERMUTA`, `GARANTIA_RETORNO`, `AJUSTE_COMERCIAL`, `OUTRO`;
     - preservar valor de referencia;
     - exigir motivo quando aplicavel;
     - permitir aplicar somente neste atendimento ou tornar padrao do paciente com validade opcional.

5. Comandos do WhatsApp/modelo de linguagem para o proximo update.
   - `Michelle paga 200 por atendimento` deve configurar modelo individual/valor padrao do paciente apos confirmacao.
   - `Michelle tem 10% de desconto` deve perguntar se aplica no proximo atendimento ou como padrao da paciente.
   - `Da 30 reais de desconto na sessao de hoje da Michelle` deve criar desconto pontual com valor-base preservado.
   - `Michelle comprou pacote de 10 sessoes por 1500 no pix` deve criar pacote + pagamento externo unico.
   - `Usa uma sessao do pacote da Michelle hoje` deve consumir movimento de pacote, nao registrar novo recebimento.
   - `Michelle e VIP e nao paga` deve perguntar se a isencao e pontual ou padrao recorrente.
   - O parser deve retornar camadas separadas:
     - modelo de cobranca;
     - forma de pagamento;
     - desconto/isencao;
     - pacote/sessoes;
     - pagamento externo;
     - credito monetario interno.

6. Relatorios e tela financeira devem separar:
   - valor de tabela;
   - descontos concedidos;
   - isencoes concedidas;
   - valor efetivamente cobrado;
   - valor recebido;
   - consumo de pacotes;
   - contas a receber;
   - credito monetario do paciente.

### Discrepancias verificadas nos prints

- Paciente Michelle Rossini:
  - Card/resumo mostra `Atendimentos 0`, `Pendente R$ 0,00`, `Evolucoes 0`, mas lista `Ultimas datas` com 4 datas: `21/06/2026 11:00`, `18/06/2026 19:00`, `15/06/2026 12:00`, `13/06/2026 19:00`.
  - Agenda semanal mostra card de `Michelle Rossini` em `18/06/2026 19:00-20:00`, financeiro `R$ 0,00 - pendente`.
  - Financeiro individual mostra `Recebido R$ 1.500,00`, `Credito do paciente R$ 8.229,00`, historico `16/06/2026 - outros`, mas o resumo do paciente segue com `Pendente R$ 0,00` e `Atendimentos 0`.
  - Valor padrao do atendimento no card: `R$ 192,00`, mas novo agendamento pre-preenchido da agenda abre com `Valor R$ 0,00`.
- Paciente Luiza Schchohc:
  - Card/resumo mostra `Atendimentos 0`, `Pendente R$ 0,00`, `Evolucoes 0`, mas `Ultimas datas` lista `20/06/2026 08:00` e `16/06/2026 15:00`.
  - Valor padrao aparece como `R$ 167,66`; qualquer novo agendamento deve herdar esse valor quando o paciente for escolhido.
- Agenda:
  - Contadores mostram `Futuros: 3`, `Retroativos: 6`, `Pend. faturamento: 8`, enquanto cards individuais podem mostrar atendimento 0/pendente 0. Unificar a origem dos agregados.
  - Drawer de detalhe mostra `Financeiro R$ 0,00 - pendente`, enquanto ficha financeira pode indicar recebimentos/credito do paciente; precisa ligar no mesmo contrato de billing.
- Registrar atendimento:
  - Modal ainda exibe texto de mock: `Interface pronta. O salvamento sera ligado ao endpoint de criacao de atendimento no proximo passo.`
  - Isso deve deixar de ser mock e salvar no backend real.
- Duracao:
  - Novo agendamento e registrar atendimento abrem com `Inicio 08:00` e `Fim 09:00` ou `14:00` e `15:00` fixos.
  - O fim deve obedecer automaticamente a duracao padrao configurada pelo usuario/profissional, e nao um mock de 60 minutos quando a configuracao for diferente.

### Regras obrigatorias do proximo update

1. Substituir o botao `WhatsApp` no card/drawer do paciente por `Agendar`.
   - Ao clicar em `Agendar`, abrir o drawer/modal de novo agendamento.
   - O formulario deve vir pre-preenchido com:
     - `patient_id`;
     - nome do paciente;
     - valor padrao do paciente;
     - data inicial sugerida;
     - hora inicial sugerida;
     - hora final calculada pela duracao padrao do usuario/profissional.
   - Nao deve depender de texto livre para reencontrar o paciente.

2. Ligar o card de agendamento pre-preenchido ao backend real.
   - `Salvar agendamento` deve chamar endpoint real e persistir em `calendar_events`.
   - Valor previsto deve usar `valorPadraoAtendimento` do paciente ou default profissional.
   - Se o paciente tiver valor proprio, ele vence o default global/profissional.
   - Se nao houver valor do paciente, usar valor padrao da sessao do profissional.

3. Registrar atendimento deve deixar de ser mock.
   - Remover texto `Interface pronta...`.
   - `Salvar atendimento` deve criar/atualizar atendimento real no backend.
   - Deve ligar atendimento a paciente, agenda, evolucao e financeiro quando aplicavel.
   - Se for atendimento retroativo/futuro, respeitar data/hora informadas.

4. Duracao final automatica em todos os fluxos de agenda/atendimento.
   - Novo agendamento, reagendamento e registrar atendimento devem recalcular `Fim` quando `Inicio` mudar.
   - Duracao deve vir da configuracao do usuario/profissional criada no onboarding.
   - Fallback permitido somente quando nao houver configuracao: `60 min`.
   - Alterar manualmente o fim deve ser possivel, mas mudar o inicio depois deve preservar a duracao definida ou a duracao manual mais recente, conforme regra escolhida.

5. Implementar menu de registrar pagamento no modulo Financeiro.
   - Tela Financeiro deve listar todos os pagamentos registrados previamente, com filtro por paciente, data, forma de pagamento e status.
   - Deve haver acao `Registrar pagamento` para novo pagamento.
   - O formulario deve aceitar:
     - paciente;
     - valor;
     - data;
     - forma de pagamento oficial: PIX, dinheiro, debito, cartao credito, transferencia, outro;
     - opcao separada de `credito do paciente`, quando aplicavel;
     - observacoes;
     - vinculo opcional a atendimento/agendamento pendente.
   - Pagamento novo deve atualizar ficha do paciente, caixa/financeiro e historico.

6. Corrigir fonte de verdade dos valores e contadores.
   - Card/resumo do paciente, agenda, detalhe do agendamento e financeiro individual devem consumir a mesma origem de dados.
   - `Atendimentos`, `pendente`, `evolucoes`, `ultimas datas`, `pendencias de faturamento`, `recebido`, `credito do paciente` e historico financeiro precisam bater entre telas.
   - Quando houver agendamento sem atendimento realizado, ele nao deve contar como atendimento realizado, mas deve aparecer como agenda futura/retroativa conforme status.
   - Quando houver pagamento avulso/credito, deve aparecer no financeiro sem inflar atendimentos.

7. Testes obrigatorios antes de deploy.
   - Abrir paciente Michelle Rossini, clicar `Agendar`, verificar paciente e valor `R$ 192,00` preenchidos.
   - Abrir paciente Luiza Schchohc, clicar `Agendar`, verificar valor `R$ 167,66` preenchido.
   - Trocar inicio de `14:00` para outro horario e confirmar fim recalculado conforme duracao configurada.
   - Criar agendamento real e confirmar card novo na agenda.
   - Registrar atendimento real e confirmar que nao aparece texto de mock.
   - Registrar pagamento pelo Financeiro e confirmar:
     - aparece no historico financeiro do paciente;
     - aparece no caixa;
     - atualiza pendente/recebido sem duplicidade.
   - Conferir que agenda, card do paciente e financeiro exibem os mesmos valores agregados.

## Prioridade adicionada em 2026-06-16 - melhoria do modelo de linguagem

- Tratar a melhoria de linguagem como prioridade do proximo update do bot, antes de novas telas nao criticas.
- Manter o backend/SQLite como fonte da verdade: o modelo de linguagem nunca deve decidir ownership, pagamento, agenda ou paciente sem validacao deterministica contra `internal_user_id` e cadastro real.
- Separar o pipeline em camadas claras:
  - normalizacao UTF-8 e correcao de mojibake apenas na entrada/log, preservando resposta final em portugues legivel;
  - classificador local rapido para intents comuns;
  - resolvedor deterministico de paciente por nome completo, tokens, aliases e score de ambiguidade;
  - parser temporal com modo explicito `passado`, `futuro` ou `ambiguo`;
  - extrator financeiro separado para valores, forma de pagamento e quantidade de atendimentos;
  - segmentador multi-intent para mensagens com atendimento + evolucao + pagamento;
  - LLM/Qwen apenas como apoio quando a regra local nao atingir confianca suficiente.
- Implementar contrato unico de saida do parser antes de executar qualquer acao:
  - `intent`;
  - `confidence`;
  - `patient_id`/`patient_name`/`patient_resolution_status`;
  - `temporal_mode`;
  - `timestamp_atendimento`;
  - `evolucao`;
  - `pagamento.valor`;
  - `agenda.conflict_status`;
  - `requires_confirmation`;
  - `pending_payload`.
- Reforcar pendencias para preservar todos os campos extraidos da mensagem original:
  - paciente;
  - data/hora;
  - evolucao/conduta;
  - valor e forma de pagamento;
  - conflito de agenda;
  - texto original;
  - acao sugerida.
- Ao receber `sim`, `confirmar`, `confirmar conflito`, `sobrepor` ou equivalente, continuar a pendencia existente sem reclassificar do zero nem perder paciente/data/evolucao.
- Melhorar perguntas simples de linguagem natural:
  - `Paciente Bernardo esta cadastrado?`;
  - `Buscar bernardo matsuoka`;
  - `Michelle tem pagamento pendente?`;
  - `Qual o proximo horario da Iara?`;
  - resposta deve consultar dados reais do usuario logado e retornar resumo curto, com ambiguidade tratada por confirmacao.
- Regras obrigatorias de seguranca:
  - nao criar atendimento/evolucao/pagamento quando paciente estiver ambiguo;
  - nao criar pagamento se valor estiver ilegivel, como `400,pp`, sem pedir correcao;
  - nao criar atendimento retroativo sem data/hora confirmada quando a frase nao trouxer referencia temporal suficiente;
  - nao usar WhatsApp ID, Telegram ID, telefone ou CPF como dono operacional no parser; sempre resolver canal para `internal_user_id`.
- Criar bateria de regressao para o modelo de linguagem com entradas reais e snapshot do JSON intermediario do parser, alem da resposta final ao usuario.
- Casos minimos da bateria:
  - `Atendi bernardo matsuoka hoje 11:00, treinamento funcional na academia do predio` deve preservar evolucao apos confirmacao;
  - `Atendi hj 15:00 Michelle Rossini, fizemos braco na academia; pagou 1000,00 reais` deve extrair atendimento, evolucao e pagamento na mesma mensagem;
  - `Agenda rubens dos Santos amanha 08:00` com conflito deve aceitar `sim` e `confirmar conflito`;
  - `Rubens dos Santos pagou 400,pp` deve pedir correcao do valor;
  - `Paciente Bernardo esta cadastrado?` deve retornar ficha/resumo do paciente correto ou perguntar confirmacao se houver homonimo.
- Meta de performance do parser:
  - caminho local deterministico abaixo de 300 ms;
  - chamada ao LLM somente quando necessaria;
  - registrar `parser_local_ms`, `intent_resolution_ms`, `qwen_ms`, decisao final e motivo da decisao no log de auditoria.
- Validacao antes de deploy:
  - rodar testes locais do parser com payloads Telegram/WhatsApp;
  - testar manualmente no canal real com um usuario autenticado;
  - confirmar que logs permanecem em UTF-8;
  - confirmar que nao houve regressao em cadastro, agenda, pagamento e evolucao.

## Prioridade adicionada em 2026-06-11

- Adicionar opcoes administrativas de limpeza na pagina Usuarios/Admin:
  - `Backup agora`;
  - `Limpar logs`;
  - `Limpar dados operacionais`;
  - `Reset financeiro`;
  - `Reindexar / reparar ownership`;
  - `Verificar integridade`;
  - `Reset total`.
- Separar claramente o escopo de cada limpeza:
  - logs: somente logs tecnicos/cache;
  - dados operacionais: pacientes, agenda, atendimentos, evolucoes, avaliacoes, pendencias e logs operacionais, preservando auth/vinculos/configuracoes;
  - financeiro: cobrancas, pagamentos, contas a receber, pacotes/creditos e caixa;
  - reset total: tudo, incluindo usuarios e vinculos.
- `Reset total` deve ficar em area de perigo, exigir confirmacao forte e senha fixa `@Gabs.Fisio21`.
- A senha de `Reset total` nao pode ser alterada pela interface e deve ser validada no backend.
- Toda acao destrutiva deve gerar backup automatico antes, exibir contagens afetadas, registrar em log e validar integridade apos execucao.
- Evoluir `operacional.db` para suportar prontuario operacional escalavel:
  - manter pacientes, agenda operacional, atendimentos, evolucoes, financeiro individual, pacotes/creditos e anexos leves no `operacional.db`;
  - nao migrar agora para `clinical.db`; reservar `clinical.db` para uma fase futura caso o prontuario cresca com anexos pesados, escalas clinicas, body chart, relatatorios extensos e auditoria clinica detalhada;
  - modelar tabelas separadas em vez de guardar multiplos inputs em JSON/colunas soltas: `web_patients`, `web_patient_profiles`, `web_attendances`, `web_evolutions`, `web_billing`, `web_payments`, `web_patient_notes`, `web_patient_files`, `web_packages`, `web_credit_transactions`;
  - preparar o banco para pelo menos 10.000 pacientes totais, cada um com multiplos atendimentos, evolucoes, pagamentos, anexos leves e historico de alteracoes;
  - adicionar indices obrigatorios por `internal_user_id`, `cpf`, `patient_id`, `attendance_id`, datas, status financeiro, status clinico e campos de busca normalizados;
  - manter `internal_user_id` como chave tecnica de ownership e CPF profissional como fallback/auditoria de reconciliacao;
  - aplicar paginacao e busca por indice em todas as listagens, evitando carregar todos os pacientes/registros na abertura da interface;
  - usar soft delete onde houver historico financeiro/clinico; exclusao definitiva deve ser acao administrativa explicita;
  - definir meta de performance: listar/search de pacientes em menos de 300 ms com 10.000 pacientes e abrir ficha individual carregando dados sob demanda por abas.
- Ajustar dashboard vanilla para seguir o layout inicial aprovado da SPA React:
  - substituir a agenda semanal grande da tela inicial por resumo operacional;
  - manter no Inicio: cards de indicadores, Agenda de hoje compacta, Pendencias, Pacientes ativos e Ultimas acoes;
  - manter botoes superiores `Agendar`, `Novo Cadastro` e `Abrir agenda`;
  - deixar a grade semanal completa apenas na pagina Agenda;
  - manter identidade visual atual do vanilla, com roxo como acento e fundo claro.
- Corrigir UX do drawer do paciente:
  - ao trocar abas internas do perfil do paciente, nao recriar nem reanimar backdrop/blur;
  - manter o overlay estavel enquanto o drawer ja estiver aberto;
  - executar blur/deslize apenas na abertura inicial por card, agenda ou link direto.
- Corrigir ownership dos dados por CPF:
  - CPF do usuario/profissional deve ser obrigatorio e unico em `auth_users`;
  - `internal_user_id` continua sendo a chave tecnica principal;
  - dados operacionais devem gravar `internal_user_id`, mas a reconciliacao apos exclusao/recriacao do usuario deve conseguir localizar o dono pelo CPF;
  - criar rotina de migracao/reparacao para pacientes, agenda, evolucoes, financeiro, convites e cadastros vindos de links, religando registros ao usuario correto quando o CPF do profissional for o mesmo;
  - links de cadastro/convidar cliente devem carregar o `internal_user_id` do criador e tambem o CPF do profissional como fallback de auditoria/reconciliacao;
  - evitar que dados financeiros sumam da web quando um usuario for recriado com novo `internal_user_id`.
- Ajustar fluxo de cadastro/autenticacao:
  - remover/evitar a tela intermediaria "Vincular dispositivo" no fluxo de primeiro acesso quando o cadastro for concluido;
  - apos cadastro profissional concluido, redirecionar para `https://walk-gaming-magazine.ngrok-free.dev/dashboard`;
  - manter retorno ao bot apenas em fluxos explicitamente iniciados para vincular canal, sem prender o usuario na tela de auth.

## Escopo aprovado

- Manter a pagina inicial `/dashboard` visivel.
- Ocultar da navegacao, sem apagar estrutura/rotas:
  - grupo Dashboards e subpaginas;
  - grupo CRM e subpaginas;
  - guia Operacao inteira;
  - Agenda > Ocupacao;
  - Financeiro > Comissao;
  - Financeiro > Contas a pagar;
  - Financeiro > Contas a receber;
  - Financeiro > Contas financeiras;
  - Financeiro > Vendas.
- WhatsApp/WPP nao deve ser conectado diretamente ao frontend.
- Backend e bancos SQLite devem ser intermediarios entre frontend, WhatsApp/Baileys e dados.

## Pipeline de implementacao

1. Consolidar a navegacao visivel apenas com os modulos liberados no momento:
   - Inicio;
   - Pacientes;
   - Agenda;
   - Agenda > Grades de horarios;
   - Evolucoes;
   - Financeiro > Caixa;
   - Relatorios;
   - Sistema.

2. Criar camada HTTP no backend Flask do FisioBot para o frontend:
   - proteger endpoints por sessao/autenticacao;
   - manter React sem acesso direto aos arquivos SQLite;
   - retornar JSON no formato mais proximo possivel de `src/lib/types.ts`.

3. Mapear DBs atuais para telas:
   - `operacional.db:web_patients` -> pacientes;
   - `operacional.db:web_attendances` -> evolucoes/atendimentos;
   - `operacional.db:web_billing` -> financeiro basico;
   - `agenda.db:calendar_events` -> agenda;
   - `brain.db:auth_users`, `trusted_devices`, `auth_session_cache` -> autenticacao/sessao;
   - `brain.db:active_pending` e `operacional.db:web_pending` -> pendencias futuras;
   - `audit.db:local_audit` e `operacional.db:web_logs` -> historico/auditoria futura.

4. Substituir mocks gradualmente em `src/lib/api.ts`:
   - fase 1: leituras de pacientes, agenda e evolucoes;
   - fase 2: criacao/edicao de pacientes;
   - fase 3: registro de evolucoes e conclusao/cancelamento de agenda;
   - fase 4: financeiro real e relatorios agregados.

5. Integracao WhatsApp/WPP via backend:
   - frontend chama endpoints Flask;
   - backend consulta DB e aciona Baileys quando necessario;
   - usar funcoes existentes como `send_whatsapp_text`;
   - frontend recebe somente status operacional: `enviado`, `erro`, `fila`, `sem_sessao_whatsapp`.
   - notificar WhatsApp e Telegram sempre que um novo usuario for cadastrado;
   - payload minimo da notificacao de novo usuario: nome completo, telefone e usuario/login;
   - confirmar recebimento de audio no WhatsApp antes de processar transcricao/Whisper.

6. Agenda web ligada ao DB:
   - exibir atendimentos futuros e retroativos vindos de `agenda.db:calendar_events`;
   - enriquecer cada atendimento com dados de `operacional.db:web_attendances` e `operacional.db:web_billing`;
   - usar cards coloridos por status do paciente/atendimento;
   - abrir detalhes do atendimento ao clicar no card, incluindo pendencia de faturamento, valor, evolucao e paciente;
   - permitir cancelar e reagendar somente quando o atendimento ainda nao tiver evolucao registrada;
   - manter fluxo parecido com Google Agenda: navegacao por semana, lista de atendimentos e detalhes operacionais.

7. Testes por fase:
   - build/lint frontend;
   - teste local no navegador;
   - teste backend com SQLite real;
   - teste integrado local;
   - teste remoto curto apos deploy.

8. Login temporario fora da SPA:
   - manter paginas HTML simples para login/autenticacao, sem depender do bundle React;
   - apos autenticacao temporaria concluida, retornar para WhatsApp em vez de abrir `/dashboard`;
   - tentar deep link `whatsapp://` quando o navegador permitir;
   - manter fallback `https://wa.me/...` e botao visivel "Voltar ao WhatsApp";
   - nao iniciar carregamento da SPA React nesse fluxo de link temporario.

9. Estrategia de DB sob demanda:
   - nao carregar todos os DBs na abertura da SPA;
   - carregar dados somente conforme clique/navegacao real do usuario;
   - antes de consultar SQLite, verificar se o dataset ja esta atualizado em cache;
   - evitar segunda leitura do mesmo DB quando a tela ou componente montar duas vezes;
   - usar chave de cache por modulo, filtros e janela de datas;
   - invalidar cache somente apos escrita, sync manual, troca de usuario ou expiracao curta;
   - adicionar endpoint leve de versao/updated_at por modulo para decidir se precisa recarregar.

10. Hardening da SPA antes de reconectar DBs:
   - remover busca automatica por letra nos campos que consultarem backend real;
   - usar Enter, botao, debounce e minimo de caracteres para busca remota;
   - substituir cargas completas por paginacao/limite por endpoint;
   - trocar `Promise.all` critico por `Promise.allSettled` quando uma falha nao deve quebrar a pagina inteira;
   - adicionar estado de loading/erro por bloco, nao apenas por pagina;
   - bloquear ou redirecionar rotas ocultas mesmo quando acessadas por URL direta;
   - limitar listas grandes no frontend e evitar selects com todos os pacientes/profissionais;
   - registrar log de chamadas API com rota, endpoint, duracao, status e erro resumido;
   - manter modo mock/local como fallback ate cada modulo ser validado contra DB real.

11. Pre-flight obrigatorio antes de mexer no tablet vanilla:
   - antes do proximo update que tocar `src/vanilla/main.ts`, recuperar a versao limpa do branch principal/remoto e sobrepor o arquivo local se houver suspeita de corrupcao;
   - comando base previsto: `git fetch` seguido de restauracao direcionada de `src/vanilla/main.ts` a partir do branch main/origin correspondente;
   - depois reaplicar somente as alteracoes intencionais do update e rodar `npm run build:tablet`;
   - nao usar restauracao ampla do repo, para nao apagar alteracoes locais nao relacionadas.

12. Polimento profissional da UI vanilla:
   - reduzir aparencia de prototipo/amador nas telas Inicio, Agenda, Pacientes e Evolucoes;
   - remover o card lateral fixo de "Proximo atendimento" no Inicio;
   - transformar o Inicio em cockpit operacional do dia, com metricas discretas, tabela/lista "Agenda de hoje", pendencias clinicas/financeiras e acoes rapidas compactas;
   - remover o card lateral fixo de detalhes da Agenda;
   - manter a Agenda quase full-width, com grade semanal limpa, topo compacto e eventos pequenos/legiveis;
   - abrir detalhes do atendimento apenas por clique no agendamento, usando drawer/modal temporario com paciente, horario, status, financeiro, evolucao e acoes;
   - evitar blocos roxos grandes: usar roxo apenas como acento, borda esquerda, estado ativo ou acao primaria;
   - refinar cards/listas de Pacientes para visual master-detail profissional: selecionado com borda/acento discreto, hover neutro e badges pequenos;
   - compactar formularios: labels menores, inputs mais baixos, grid alinhado, botoes principais no rodape da ficha e acoes destrutivas em area separada;
   - refinar topbar como barra de sistema: busca global discreta/alinhada, status Backend/WhatsApp menores, usuario no canto direito e botao sair menos dominante.
   - remover o botao `Sair` fixo da topbar; logout deve ficar dentro do menu do usuario ou fluxo equivalente, sem ocupar espaco permanente.
   - posicionar o botao de notificacoes imediatamente a esquerda do botao/menu do usuario.
   - reduzir aproximadamente 20% da largura atual do botao/menu do usuario para liberar area horizontal no tablet/mobile.
   - substituir o identificador tecnico/login exibido no botao do usuario por nome e sobrenome do cadastro; se nome/sobrenome nao estiverem disponiveis, usar `Usuario`.
   - manter o texto do usuario com truncamento limpo e sem quebrar layout em zoom/mobile.

13. Reorganizacao Cadastros:
   - substituir a pagina/menu `Evolucoes` por `Cadastros` no proximo update;
   - concentrar dentro de `Cadastros`: Pacientes, Evolucoes por paciente e Financeiro individual;
   - usar layout de ficha clinica master-detail com lista de pacientes e abas `Resumo`, `Cadastro`, `Agenda`, `Evolucoes` e `Financeiro`;
   - manter a rota/estrutura antiga desacoplada o suficiente para fallback, mas a navegacao principal deve apontar para o novo modulo Cadastros.

14. Linguagem humana, recuperacao de acesso e seguranca de cadastro:
   - adicionar intents de linguagem natural para perguntas simples no WhatsApp, Telegram e/ou web, como `Paciente Bernardo esta cadastrado?`;
   - resposta esperada deve consultar o cadastro real do usuario autenticado, aceitar variacoes de nome e retornar resumo curto: encontrado/nao encontrado, status ativo/inativo, telefone e ultima data relevante quando existir;
   - tratar ambiguidade com pergunta de confirmacao quando houver mais de um paciente parecido;
   - adicionar fluxo para perda/troca de celular: permitir editar o numero vinculado pela web com confirmacao de senha e registro em auditoria;
   - implementar menu do usuario na topbar com entrada `Configuracoes` e `Editar perfil`;
   - em `Editar perfil`, permitir edicao do cadastro do usuario logado, incluindo nome, e-mail, telefone/numero vinculado e dados operacionais permitidos;
   - em `Editar perfil`, bloquear edicao de CPF diretamente pela interface comum; CPF deve ficar somente leitura ou exigir fluxo administrativo separado;
   - ao trocar numero, invalidar/atualizar vinculos antigos de WhatsApp/Telegram conforme regra definida e enviar notificacao ao numero antigo quando ainda acessivel;
   - implementar `Recuperar senha` na tela de login com pagina simples fora da SPA, usando codigo por WhatsApp/Telegram/e-mail conforme cadastro disponivel;
   - nao permitir dois usuarios com o mesmo login, usuario, e-mail normalizado ou telefone normalizado;
   - login deve aceitar e-mail, telefone ou nome de usuario no mesmo campo, resolvendo para um unico usuario;
   - cadastro e login devem ter botao para mostrar/ocultar senha digitada, mantendo o input como `password` por padrao e alternando visibilidade apenas enquanto o usuario solicitar;
   - cadastro de usuario deve validar senha minima, confirmacao de senha e unicidade antes de gravar;
   - permitir excluir/inativar paciente pela interface web com confirmacao de senha do usuario logado;
   - permitir excluir/inativar paciente via WhatsApp com confirmacao explicita em duas etapas, por exemplo: `excluir paciente Bernardo` -> resumo -> `confirmar excluir Bernardo`;
   - exclusao de paciente deve ser logica por padrao, preservando historico financeiro/evolucoes para auditoria, salvo se for criado fluxo separado de purga administrativa;
   - respostas de exclusao devem informar claramente se o paciente foi inativado, se nao foi encontrado ou se havia ambiguidade.

15. Cadastros premium, ficha completa do paciente e agenda anual:
   - adicionar visualizacao anual na Agenda, alem de semana e mes;
   - na visualizacao anual, exibir uma grade de 12 meses com contadores por mes: atendimentos executados, abertos e cancelados;
   - manter a visualizacao anual como leitura agregada e leve, carregando somente estatisticas por periodo em vez de todos os eventos do ano;
   - criar ou adaptar endpoint backend para resumo anual: `GET /api/web/agenda/resumo-anual?ano=YYYY`, retornando por mes `{executados, abertos, cancelados, total}`;
   - mapear status da agenda de forma defensiva: executados/concluidos, abertos/futuros/em aberto, cancelados; status desconhecido entra em total e deve ser logado para ajuste posterior;
   - adicionar valor padrao dos atendimentos nas configuracoes do usuario/profissional;
   - valor padrao em configuracoes sera usado como default para novos pacientes e novos atendimentos quando o paciente nao tiver valor especifico;
   - permitir que o valor do atendimento seja sobrescrito por paciente, mantendo `valorPadraoAtendimento` na ficha do paciente;
   - exibir e editar o valor padrao/especifico do atendimento tambem na tela de cadastro do paciente, dentro da aba `Cadastro` ou bloco administrativo/financeiro da ficha;
   - na UI, deixar claro quando o paciente esta usando o valor global das configuracoes e quando possui valor proprio sobrescrito;
   - expandir o cadastro do paciente mantendo todos os campos opcionais neste momento, exceto nome completo;
   - dados demograficos e pessoais: nome completo, nome social, data de nascimento, idade calculada, genero/sexo, estado civil, naturalidade, nacionalidade, profissao/ocupacao atual e escolaridade;
   - contatos e endereco: endereco completo, CEP, municipio, telefone residencial, celular, telefone comercial, e-mail, contato de emergencia e telefone do contato de emergencia;
   - acompanhamento administrativo: profissional/avaliador, numero de registro profissional/CREFITO, data da avaliacao, convenio/plano de saude, numero da carteirinha, encaminhamento, profissional solicitante e CID quando aplicavel;
   - incluir upload de foto do paciente na ficha; implementar inicialmente como campo visual/preview e preparar backend para arquivo local seguro, sem bloquear o restante do cadastro se foto nao existir;
   - pipeline de foto do paciente:
     - aceitar upload original de ate 12 MB no frontend;
     - validar extensoes/tipos de imagem comuns (`image/jpeg`, `image/png`, `image/webp`, e quando suportado `image/heic`);
     - mostrar preview imediato no cadastro antes de salvar;
     - converter automaticamente no navegador para imagem quadrada otimizada antes do envio;
     - usar crop central quadrado para avatar/ficha;
     - gerar versao media de ate 480x480 px com compressao WebP quando suportado, fallback JPEG;
     - qualidade sugerida: WebP/JPEG entre 0.72 e 0.80, visando arquivo final abaixo de aproximadamente 120 KB a 200 KB por paciente;
     - nao salvar base64 no SQLite; enviar arquivo via `FormData`;
     - backend deve validar sessao, dono do paciente, MIME/tamanho e extensao real antes de gravar;
     - salvar arquivo otimizado fora do DB, por exemplo `tablet_pipeline/uploads/pacientes/<patient_id>.webp`;
     - gravar no DB apenas caminho/URL controlada em `web_patients.foto_url`;
     - servir foto por rota autenticada/controlada, por exemplo `/api/web/pacientes/<patient_id>/foto`;
     - usar a foto nos cards laterais e no cabecalho da ficha; fallback continua sendo a inicial do nome quando nao houver foto;
     - evitar carregar imagens grandes na lista de pacientes; lista deve usar a versao otimizada/cacheavel;
     - remover o campo manual de URL temporaria quando o endpoint real de upload estiver ativo;
   - reorganizar a tela `Cadastros` no padrao da referencia NextFit, mantendo as cores atuais do FisioBot e roxo apenas como acento;
   - layout desejado: coluna lateral com cards compactos de pacientes por nome, status e informacao curta; ao clicar no nome, abrir um card/ficha visivel do paciente na area principal;
   - adicionar duas entradas de criacao no topo de Cadastros:
     - `Cliente` ou `Novo cadastro`: cadastro manual feito pelo profissional;
     - `Convidar cliente`: gera link/pagina para o proprio cliente preencher a ficha cadastral;
   - fluxo `Convidar cliente`:
     - backend cria convite com token unico, paciente opcionalmente pre-criado como rascunho e expiracao configuravel;
     - o link/token do convite deve expirar em 24 horas por padrao;
     - profissional pode enviar link por WhatsApp via backend/Baileys ou copiar link;
     - pagina de convite deve ser HTML simples, responsiva e fora da SPA pesada;
     - cliente preenche a ficha cadastral propria com os campos opcionais definidos, exceto campos administrativos internos quando fizer sentido;
     - ao concluir, backend grava/atualiza paciente vinculado ao usuario/profissional dono do convite;
     - convite deve ter estados: pendente, concluido, expirado e cancelado;
     - nunca permitir que o cliente acesse a SPA interna ou outros pacientes pelo link de convite;
     - registrar origem do cadastro como `convite_cliente` para auditoria;
   - evoluir a lista de pacientes para visualizacao em cards no estilo da referencia NextFit:
     - cards em grid/lista com avatar/foto, nome, idade/genero quando disponiveis, status ativo/inativo, indicadores de pendencia e acao `Ver perfil`;
     - manter alternativa `Lista` para visual mais compacto quando necessario;
     - menu de tres pontos por card para acoes rapidas futuras;
   - ao clicar no paciente ou em `Ver perfil`, abrir perfil/ficha do paciente em painel lateral sobreposto, parecido com o drawer da Agenda;
   - o painel de perfil deve aplicar backdrop com desfoque/escurecimento leve, manter contexto da lista ao fundo e poder fechar sem perder a busca/filtro atual;
   - dentro do painel lateral do paciente, manter cabecalho com foto/avatar, nome, idade/genero, status, botoes principais e abas do sistema daquele cliente;
   - abas do painel lateral: `Resumo`, `Cadastro`, `Financeiro`, `Evolucoes`, e posteriormente `Agenda`, `Documentos` e `Observacoes` se forem ligadas;
   - o painel lateral deve carregar dados detalhados sob demanda ao abrir, evitando carregar financeiro/evolucoes de todos os pacientes na lista;
   - em telas largas, o painel pode ocupar 70% a 80% da largura; em mobile/tablet pequeno, ocupar tela inteira;
   - manter a coluna/lista de pacientes ocupando toda a lateral disponivel, sem deixar espaco lateral morto;
   - adicionar barra de busca dentro da coluna de pacientes para localizar paciente por nome, telefone ou CPF, sem buscar no DB a cada tecla; usar Enter/botao ou filtro local da lista ja carregada;
   - nos cards da lista de pacientes, exibir indicadores de pendencia ao lado do nome:
     - `!` vermelho quando houver atendimento aberto sem evolucao registrada;
     - `!` azul quando houver atendimento evoluido, mas com pagamento/faturamento pendente;
     - sem `!` quando nao houver pendencia;
   - na lista/timeline de atendimentos do paciente, manter tambem os atendimentos abertos e nao apenas as evolucoes;
   - sinalizacao por atendimento:
     - `!` vermelho para atendimento aberto e nao evoluido;
     - `!` azul para atendimento evoluido, mas nao faturado/pago;
     - check verde para atendimento evoluido, pago e finalizado;
   - remover a caixa lateral fixa `Registrar evolucao` da aba Evolucoes; acoes de evolucao devem surgir a partir do atendimento selecionado ou botao discreto na linha/card do atendimento;
   - na aba Evolucoes, substituir o layout de dois cards por uma timeline/lista em largura total com evolucoes e atendimentos abertos, deixando formulario de nova evolucao em modal/drawer ou expandido inline somente apos clique;
   - decisao de UI: usar uma unica `linha do tempo operacional` na aba `Evolucoes`, misturando atendimentos e evolucoes em ordem de data;
   - cada item da linha do tempo deve ter acao contextual:
     - atendimento aberto sem evolucao: `Registrar evolucao`;
     - atendimento evoluido com financeiro pendente: `Baixar pagamento`;
     - atendimento evoluido, pago e finalizado: `Visualizar` e/ou `Imprimir`;
   - a linha do tempo deve ser o centro da aba, evitando formulario fixo permanente na lateral;
   - cabecalho da ficha do paciente deve conter foto/avatar, nome, idade quando possivel, status ativo/inativo, telefone principal e acoes principais;
   - abas da ficha: `Resumo`, `Cadastro`, `Financeiro`, `Evolucoes` e, se fizer sentido no mesmo update, `Agenda`;
   - `Resumo`: dados clinicos/administrativos principais, totais de atendimentos, ultimo atendimento, proximo atendimento, pendencias financeiras, pendencias de evolucao e observacoes;
   - `Cadastro`: formulario completo em secoes, parecido com a referencia: dados principais, dados demograficos, contatos/endereco, administrativo, convenio/encaminhamento e observacoes;
   - `Financeiro`: card/tabela individual com debitos, recebidos, pendentes, distribuicao por mes, valor padrao do paciente e acoes futuras para baixar/editar lancamento;
   - `Evolucoes`: historico em timeline/cartoes, botao `Nova evolucao`, filtro por atendimento e bloqueio de edicao quando a evolucao ja estiver vinculada/concluida conforme regra existente;
   - `Agenda` do paciente, se incluida: lista de atendimentos do paciente com status, valor, evolucao pendente/concluida e acao para abrir detalhe;
   - priorizar UI densa e profissional: fundo neutro, cards brancos, bordas leves, labels discretos, tabelas/linhas alinhadas, sem blocos roxos grandes;
   - evitar carregar todos os detalhes de todos os pacientes na abertura: listar cards primeiro e carregar ficha completa sob demanda ao clicar no paciente;
   - manter compatibilidade com os campos atuais (`nomeCompleto`, `telefone`, `cpf`, `endereco`, `observacoes`, `valorPadraoAtendimento`) enquanto os novos campos sao adicionados gradualmente;
   - atualizar contratos de API/DB antes de ligar UI real: criar migracoes defensivas para novos campos em `web_patients` ou tabela complementar de perfil do paciente;
   - se o DB atual nao suportar todos os campos de forma limpa, criar camada de serializacao JSON complementar temporaria, mas expor ao frontend como campos estruturados;
   - testes do update: build tablet, teste local no navegador em Agenda anual e Cadastros, teste de salvar paciente apenas com nome, teste de salvar todos os campos opcionais vazios, teste de valor padrao global e valor especifico por paciente, e teste de carregamento sob demanda da ficha.

## Observacoes tecnicas

- Comissao e Vendas permanecem no codigo/rotas, mas ocultas da navegacao ate existir modelo real nos DBs.
- Contas a pagar, receber e contas financeiras permanecem no codigo/rotas, mas ocultas ate o contrato com backend estar definido.
- Evitar criar dependencia direta do React com Baileys, arquivos `.db` ou scripts locais do tablet.
- O problema de travamento em `onClick`/`onSelect` de campos de texto foi tratado removendo rings de foco dos campos base e substituindo o Select Radix por wrapper nativo no build tablet; manter validacao remota apos cada deploy.

## Ajustes visuais capturados nos prints de 2026-06-05

1. Topbar em tablet/zoom:
   - manter a barra superior em largura util de 100% sem sobra/desalinhamento lateral;
   - garantir que busca, status Backend/WhatsApp, nome do usuario, notificacoes e Sair fiquem alinhados em uma unica faixa;
   - o botao `Sair` nao deve ficar dentro do menu do usuario; deve permanecer como acao separada no canto direito;
   - o icone de notificacoes deve ficar imediatamente ao lado do chip do usuario, com tamanho e alinhamento consistentes no zoom do Samsung Browser.
2. Tela Inicio:
   - remover o card lateral `Proximo atendimento`/detalhe fixo quando nao houver acao ativa, deixando a agenda/visao principal respirar melhor;
   - evitar card lateral amador no dashboard; detalhes de atendimento devem abrir somente sob clique em evento/card, no padrao drawer.
3. Cadastros - estado sem paciente selecionado:
   - remover a ficha/card grande com texto `Selecione um paciente`; manter apenas metricas realmente uteis ou uma area neutra limpa;
   - remover a metrica `Pendente geral` desse topo quando ela nao agregar valor visual;
   - manter uma barra de estatisticas compacta com, no maximo, pacientes cadastrados, ativos e inativos;
   - fazer a coluna/lista de pacientes ocupar 100% da area lateral disponivel, com cards laterais mais largos e bem alinhados.
4. Cadastros - drawer/perfil do paciente:
   - ao clicar em card de paciente, abrir drawer com animacao de deslize lateral vindo da direita;
   - aplicar backdrop com blur/escurecimento gradual sincronizado com a entrada do drawer;
   - aplicar a mesma animacao e blur em PC, tablet e mobile;
   - permitir fechar ao clicar fora do drawer/backdrop, alem do botao `Fechar` no topo;
   - remover/evitar botoes de fechar duplicados ou deslocados na parte inferior/lateral;
   - manter o conteudo do drawer ocupando toda a largura util, sem texto estreito espremido na lateral esquerda.
5. Cadastro do paciente:
   - no bloco de foto, manter foto/avatar e texto de ajuda alinhados horizontalmente quando houver espaco;
   - evitar que o texto de ajuda da foto quebre em coluna estreita; em tablet, deve ocupar linha larga abaixo ou ao lado da foto;
   - manter upload de foto funcional, mas com visual mais profissional do que o input nativo cru quando possivel.
6. Resumo do paciente:
   - o botao `Registrar Atendimento` deve abrir um popup/modal/drawer para registrar atendimento retroativo ou futuro;
   - nao deve redirecionar imediatamente para outra pagina sem contexto;
   - o fluxo deve permitir escolher data, horario, servico, valor e status inicial.
7. Agenda:
   - ao clicar em um agendamento, manter o drawer lateral de detalhe vindo da direita com animacao e blur gradual;
   - aplicar o mesmo comportamento em PC, tablet e mobile;
   - permitir fechar clicando fora do drawer/backdrop;
   - manter botao `Fechar` visivel no topo do drawer;
   - evitar que elementos da topbar aparecam desalinhados ou sobrepostos sob o backdrop;
   - revisar destaque visual do evento selecionado para ficar claro sem pesar a grade.
8. Mobile web - largura e overflow:
   - corrigir a interface mobile para ocupar 100% da largura real do viewport, sem sobras laterais e sem rolagem horizontal no Samsung Browser/Chrome mobile;
   - auditar `width`, `min-width`, `grid-template-columns`, paddings, margins negativos, cards, topbar, calendario, tabs e drawers que possam ultrapassar `100vw`;
   - aplicar regra defensiva global quando necessario: `html`, `body`, `#app`, `.app-shell`, `.main` e principais containers com `max-width: 100%` e `overflow-x: hidden` sem esconder bugs de componentes internos;
   - trocar grids que geram colunas fixas por layouts responsivos com `minmax(0, 1fr)` e quebra vertical abaixo de largura mobile;
   - topbar mobile deve quebrar em linhas controladas, sem empurrar a pagina para a direita;
   - tabs de drawer devem permitir scroll horizontal interno somente na barra de abas, sem criar scroll horizontal no documento inteiro;
   - drawer mobile deve ocupar `100vw`/`100dvw`, abrir da direita com transform, e manter conteudo interno rolando verticalmente;
   - validar em 360px, 390px, 412px e tablet estreito, sempre com zoom 100%.

## Ajustes solicitados em 2026-06-05 - Inicio, Agenda, Cadastros, Bot e Financeiro

1. Renomear acoes de criacao na interface:
   - na tela `Inicio`, trocar `Novo paciente` por `Novo Cliente`;
   - na tela `Cadastros`, trocar `+ Cliente`/`Novo paciente`/`Novo Cadastro` por `Novo Cliente`, mantendo consistencia de texto;
   - na tela `Agenda`, remover `Novo paciente` e substituir por `Novo agendamento`;
   - `Novo agendamento` deve permanecer em mock neste update, abrindo a estrutura visual sem gravar no DB ate o fluxo completo ser definido;
   - manter todos os botoes principais de criacao em roxo, usando a cor principal da interface.
2. Padrao de abertura para `Novo Cliente`:
   - o botao `Novo Cliente` em `Inicio` e em `Cadastros` deve abrir um drawer/modal sobreposto, com blur gradual e deslize lateral vindo da direita;
   - nao usar formulario fixo ocupando a pagina;
   - reaproveitar o mesmo padrao visual do drawer de paciente e do drawer de detalhes da Agenda;
   - o drawer deve iniciar em modo cadastro vazio, com nome obrigatorio e demais campos opcionais;
   - fechar pelo botao `Fechar`, por clique fora no backdrop e por tecla Escape quando disponivel.
3. Padrao de abertura para `Novo agendamento`:
   - o botao `Novo agendamento` da Agenda deve abrir drawer/modal em mock;
   - campos previstos no mock: paciente, data, hora inicial, hora final, servico, valor, status e observacoes;
   - nao gravar no banco ainda;
   - deixar o contrato visual pronto para depois ligar ao backend/DB.
4. Bot - interpretacao temporal de atendimentos e agenda:
   - corrigir o parser para diferenciar passado, futuro e ambiguidades por verbo/contexto;
   - exemplos de passado: `atendi`, `fizemos`, `ultima segunda`, `segunda passada`, `ontem`;
   - exemplos de futuro: `marcar`, `agendar`, `proxima segunda`, `amanha`;
   - quando a frase indicar atendimento ja realizado, resolver datas ambigueas para o passado mais provavel, nao para o horario futuro do dia atual;
   - quando a frase indicar agendamento futuro, resolver para a proxima data valida e registrar como agenda futura;
   - antes de criar novo atendimento retroativo, procurar atendimento pendente existente na agenda pelo nome do paciente e data/hora orientada;
   - se existir atendimento pendente compativel, vincular a evolucao/registro a esse atendimento em vez de criar registro duplicado;
   - quando o usuario informar atendimento sem data/hora explicita, por exemplo `atendi Michelle Rossini, fizemos braco na academia`, o bot deve:
     - identificar o paciente e manter esse paciente como variavel de contexto aberta;
     - verificar primeiro a agenda do dia atual para esse paciente;
     - se houver agendamento do dia compativel, confirmar data/hora do atendimento do dia antes de evoluir e faturar;
     - se a hora informada ou inferida parecer diferente do agendamento, pedir confirmacao/correcao da hora antes de registrar;
     - se nao houver agendamento no dia atual, perguntar ao usuario a data e hora corretas do atendimento;
     - depois que o usuario informar data/hora, verificar novamente se existe agendamento compativel nessa data/hora;
     - se existir agendamento compativel, evoluir/faturar o atendimento existente;
     - se nao existir agendamento compativel, perguntar se o usuario deseja adicionar esse atendimento na agenda antes de registrar;
     - nunca criar atendimento/evolucao/faturamento sem antes verificar agenda e confirmar data/hora quando elas nao foram explicitamente dadas;
   - manter confirmacao humana quando a data ainda estiver ambigua ou conflitar com agenda existente.
5. Inicio - proximo horario:
   - o card `Proximo horario` deve considerar o horario atual em `America/Sao_Paulo`;
   - nao deve exibir atendimento que ja ficou no passado no mesmo dia;
   - se houver atendimento futuro hoje, mostrar o proximo horario e paciente;
   - se nao houver mais atendimento hoje, buscar o proximo atendimento futuro em dias seguintes e mostrar dia/data + horario + paciente;
   - se nao houver nenhum atendimento futuro, mostrar somente `Sem Agendamentos`.
6. Financeiro web - sincronizar com pagamentos registrados pelo bot:
   - verificar por que pagamentos confirmados no WhatsApp aparecem no bot, mas nao aparecem na aba financeira web do paciente;
   - revisar endpoints/API usados pela tela de Cadastros/Financeiro para garantir que retornem valor pago, valor pendente, credito/saldo residual, valor recebido no dia e valor padrao do atendimento;
   - exemplo alvo: pagamento de Iara Noto de R$ 300,00 deve refletir atendimento quitado de R$ 150,00 e credito restante de R$ 150,00;
   - a aba `Financeiro` do paciente deve mostrar distribuicao mensal, recebido, pendente, credito residual e lancamentos recentes;
   - a tela `Inicio` deve refletir corretamente recebido do dia/mes quando o backend disponibilizar esses totais;
   - se o backend retornar dados vazios apesar do DB conter pagamentos, corrigir a camada Flask intermediaria antes de mexer na UI.
   - causa confirmada em 2026-06-05 no tablet: o financeiro da Iara existia em `web_billing`, mas `created_by_user_id` estava vazio; `web_attendances.created_by_user_id` tambem estava vazio; `web_patients.criado_por_user_id` estava com `34321217937660@lid`; o usuario web logado era `internal_user_id=USRZWJNSTX`;
   - corrigir o espelhamento para nunca gravar WhatsApp ID, Telegram ID, telefone ou vazio em campos operacionais `*_user_id`;
   - normalizar todos os registros manipulaveis para o dono tecnico `internal_user_id`: `web_patients.criado_por_user_id`, `web_attendances.created_by_user_id`, `web_billing.created_by_user_id`, `web_pending`, agenda/atendimentos derivados, evolucoes e qualquer tabela operacional futura;
   - CPF deve ser obrigatorio e unico para usuario/profissional em `auth_users`, mas usado como fallback/validacao/recuperacao, nao como chave de join operacional;
   - WhatsApp ID, Telegram ID e telefone devem ficar vinculados ao `internal_user_id` em tabela/estrutura de identidades de canal; no fluxo de mensagem, resolver `canal -> internal_user_id` antes de criar paciente, atendimento, evolucao, agenda, pendencia ou financeiro;
   - adicionar protecao de SQLite/codigo para bloquear ou enfileirar correcao quando `created_by_user_id`/`criado_por_user_id` estiver vazio ou receber identificador de canal no lugar de `internal_user_id`;
   - criar backfill/migracao para registros atuais: trocar `34321217937660@lid` e vazios pelo `internal_user_id` correto quando houver vinculo confiavel, preservando identificadores de canal em campos proprios;
   - revisar endpoints de leitura/escrita que dependem de ownership: listagem/criacao/edicao/exclusao de pacientes, upload/serving de foto, financeiro individual/global, evolucoes, registro de atendimento, conclusao/cancelamento/reagendamento de agenda, pendencias e relatorios;
   - o link de `Convidar cliente` gerado pela web deve persistir automaticamente o `owner_id/internal_user_id` do usuario criador do link; ao cliente concluir a ficha, o paciente criado/atualizado deve herdar esse mesmo `internal_user_id`, sem depender de WhatsApp/Telegram/CPF como dono operacional;
   - adicionar testes especificos: pagamento via WhatsApp aparece na web do mesmo usuario; evolucao via bot aparece na ficha correta; cadastro via convite cria paciente atrelado ao dono do convite; outro usuario nao enxerga financeiro/evolucoes/pacientes alheios.
7. Cadastros - lista de pacientes ocupando area livre:
   - a lista de pacientes nao deve ficar presa em uma coluna estreita quando ha area branca disponivel;
   - em estado sem drawer aberto, os cards de pacientes devem ocupar a area principal em grid responsivo, usando o espaco branco inteiro;
   - manter busca e ordenacao no topo;
   - ao clicar em um card, abrir drawer lateral sobreposto com a ficha do paciente, sem comprimir a grid;
   - em tablet/mobile, a grid deve quebrar para uma coluna ou duas colunas conforme largura, sem rolagem horizontal.
8. Testes esperados para este update:
   - build tablet/local;
   - abrir `Inicio`, `Agenda` e `Cadastros` localmente no navegador;
   - testar clique em `Novo Cliente` pelo `Inicio` e por `Cadastros`;
   - testar clique em `Novo agendamento` na `Agenda` e confirmar que ainda nao grava no DB;
   - testar drawer/blur/deslize em desktop, tablet e mobile;
   - testar `Proximo horario` antes e depois do horario de um atendimento;
   - testar busca/financeiro de paciente com pagamento confirmado via bot;
   - testar frase retroativa no bot com `ultima segunda feira` e frase futura com `proxima segunda feira`.

## Ajustes solicitados em 2026-06-05 20:47 - refinamento mobile do dashboard

1. Topbar mobile:
   - manter a barra de busca centralizada e usando a largura util disponivel;
   - remover os indicadores textuais `Backend Ativo` e `WhatsApp Conectado` da visualizacao mobile do dashboard;
   - remover o botao fixo `Sair` da topbar mobile;
   - manter notificacoes e usuario de forma compacta, alinhada e sem quebrar largura;
   - garantir que a topbar nao gere rolagem horizontal no Samsung Browser.
2. Acoes principais do Inicio:
   - remover `Novo paciente` definitivamente e manter `Novo Cliente`;
   - manter botoes em roxo/acento da interface;
   - organizar `Novo Cliente`, `Minimizar cards` e `Atualizar` em layout responsivo sem empilhar de forma poluida quando houver espaco.
3. Minimizar cards do dashboard:
   - adicionar/aperfeicoar botao de minimizar por card/section, nao apenas modo global;
   - os cards `Agenda da semana`, `Agenda de hoje`, `Ultimas evolucoes`, `Pacientes recentes` e `Acoes rapidas` devem poder ficar recolhidos;
   - lembrar o estado recolhido por card no navegador, usando `localStorage`;
   - quando recolhido, mostrar apenas titulo, contador/resumo curto e icone de expandir.
4. Agenda da semana no Inicio:
   - permitir minimizacao da grade semanal para ocupar menos altura no mobile;
   - se expandida, limitar altura e manter rolagem interna da grade, sem alongar a tela inteira;
   - evitar calendario vazio gigante quando nao houver eventos visiveis.
5. Agenda de hoje no mobile:
   - remover/desnecessarizar a linha de cabecalhos vertical (`HORARIO`, `PACIENTE`, `SERVICO`, `STATUS`, `FINANCEIRO`) no mobile;
   - cada atendimento deve virar um item compacto com: horario, paciente, status clinico e status financeiro;
   - ocultar texto repetitivo como `Atendimento - Nome` quando ja houver paciente/horario visiveis;
   - preservar badges de status, mas em formato mais baixo e menos largo.
6. Cards secundarios:
   - `Ultimas evolucoes`, `Pacientes recentes` e `Acoes rapidas` devem iniciar recolhidos quando o usuario optar por modo compacto;
   - `Pacientes recentes` deve mostrar no maximo um resumo curto quando minimizado;
   - `Acoes rapidas` deve manter apenas as acoes essenciais, com `Novo Cliente` como acao principal.
7. Validacao visual obrigatoria:
   - testar mobile em 360px, 390px e 412px com zoom 100%;
   - confirmar que nao existe rolagem horizontal;
   - confirmar que minimizar/expandir persiste apos reload;
   - confirmar que a tela Inicio fica navegavel sem poluicao visual antes da primeira dobra.

## Ajustes solicitados em 2026-06-07 - metricas de pendencias e financeiro do mes

1. Card `Pendencias` no Inicio:
   - substituir o texto atual `Pendencias clinicas` por um card operacional mais claro, provavelmente `Pendencias`;
   - o numero principal deve ser a soma exata das acoes pendentes:
     - quantidade de atendimentos sem evolucao;
     - quantidade de atendimentos com faturamento/pagamento pendente;
   - se um mesmo atendimento estiver sem evolucao e com pagamento pendente, contar como duas pendencias, porque sao duas acoes independentes;
   - subtitulo recomendado: `2 sem evolucao · 1 pagamento pendente`;
   - quando nao houver pendencia, mostrar `0` e subtitulo `rotina em dia`.
2. Card financeiro do Inicio:
   - substituir `Pendencias financeiras` por `Financeiro do mes`;
   - o valor principal deve ser o total recebido no mes atual;
   - o subtitulo deve mostrar total de atendimentos realizados no mes e valor pendente de pagamento;
   - texto recomendado:
     - titulo: `Financeiro do mes`;
     - valor: `R$ 1.300,00`;
     - subtitulo: `8 atendimentos · R$ 450,00 a receber`;
   - se nao houver pendencias financeiras, usar `R$ 0,00 a receber`;
   - manter formato compacto para mobile, sem quebrar em varias linhas grandes.
3. Backend/API:
   - garantir que o endpoint usado pelo dashboard retorne separadamente:
     - `semEvolucaoCount`;
     - `pagamentoPendenteCount`;
     - `pendenciasOperacionaisTotal`;
     - `recebidoMes`;
     - `atendimentosRealizadosMes`;
     - `valorPendentePagamento`;
   - calcular sempre por `internal_user_id` do usuario logado;
   - considerar timezone `America/Sao_Paulo` para inicio/fim do mes;
   - evitar dupla contagem de valores financeiros, mas permitir dupla contagem de acoes operacionais quando um atendimento exigir evolucao e pagamento.
4. Testes esperados:
   - validar um paciente com atendimento sem evolucao e pagamento pendente;
   - validar um atendimento evoluido, mas ainda nao pago;
   - validar um atendimento evoluido e pago;
   - conferir se a soma do card `Pendencias` bate com a lista de atendimentos;
   - conferir se `Financeiro do mes` bate com os lancamentos retornados por `/api/web/financeiro`;
   - testar dashboard desktop e mobile sem overflow horizontal.

## Ajustes solicitados em 2026-06-07 - linguagem humana do bot e nomes de pacientes

1. Parser de nomes:
   - reforcar reconhecimento de nomes completos ja cadastrados, incluindo `Bernardo Matsuoka`;
   - antes de tratar texto como evolucao livre, tentar resolver entidade de paciente por:
     - match exato normalizado;
     - match case-insensitive;
     - match sem acentos;
     - aliases existentes;
     - tokens parciais quando houver apenas um paciente compativel;
   - se houver match unico com baixa confianca, pedir confirmacao sem perder a frase original;
   - se houver conflito entre pacientes parecidos, listar opcoes curtas para escolha.
2. Frases compostas com atendimento + pagamento:
   - corrigir caso do log: `Atendi hj 15:00 Michelle Rossini, fizemos braco na academia; pagou 1000,00 reais`;
   - o parser deve extrair na mesma mensagem:
     - paciente;
     - data/hora;
     - evolucao/atividade;
     - valor pago;
   - nao deve gerar pendencia `pagamento sem valor` quando o valor estiver claro na segunda parte da frase;
   - se houver atendimento e pagamento na mesma mensagem, confirmar um resumo unico:
     - `registrar atendimento/evolucao em DD/MM HH:MM e pagamento de R$ X?`;
   - ao confirmar, executar as duas acoes de forma atomica ou retornar erro claro do que falhou.
3. Fluxo de confirmacao preservando evolucao:
   - corrigir caso do log em que `Atendi bernardo matsuoka hoje 11:00, treinamento funcional na academia do predio` reconheceu Bernardo, pediu confirmacao, mas depois respondeu `Informe a evolucao do atendimento`;
   - quando a mensagem original ja contem evolucao/conduta, essa evolucao deve ficar armazenada na pendencia;
   - apos `sim`, o sistema deve registrar o atendimento com a evolucao ja extraida, sem pedir a evolucao de novo;
   - se a evolucao estiver curta mas existente, aceitar e registrar; pedir complemento somente se estiver vazia.
4. Conflito de agenda:
   - corrigir caso `Agenda rubens dos Santos amanha 08:00` seguido de `Sim` e depois `Confirmar conflito`;
   - a pendencia de conflito deve preservar paciente, data, hora e acao original;
   - respostas `sim`, `confirmar conflito`, `sobrepor` e equivalentes devem concluir a mesma pendencia sem perder o paciente;
   - nunca retornar `agendamento exige paciente ja cadastrado e identificavel` depois de um conflito que ja havia identificado o paciente.
5. Robustez de valores:
   - aceitar valores com erro de digitacao comum quando possivel, como `400,pp`, mas pedir confirmacao do valor normalizado ou solicitar correcao se ambiguo;
   - manter o texto de erro em portugues simples: `Nao consegui ler o valor. Envie novamente como 400,00.`
6. Mojibake/acentos:
   - revisar origem do texto/log para evitar `braÃ§o`, `amanhÃ£`, `NÃ£o`;
   - garantir UTF-8 ponta a ponta em logs, respostas e parsing;
   - normalizacao sem acento deve ser usada apenas internamente, sem degradar a resposta ao usuario.
7. Testes esperados:
   - `Atendi bernardo matsuoka hoje 11:00, treinamento funcional na academia do predio` deve registrar atendimento/evolucao apos confirmacao;
   - `Atendi hj 15:00 Michelle Rossini, fizemos braco na academia; pagou 1000,00 reais` deve extrair atendimento + pagamento;
   - `Agenda rubens dos Santos amanha 08:00` com conflito deve aceitar `sim` ou `confirmar conflito`;
   - `Rubens dos Santos pagou 400,pp` deve pedir correcao do valor, nao criar pagamento incorreto;
   - `Buscar bernardo matsuoka` deve retornar a ficha correta do paciente cadastrado.

