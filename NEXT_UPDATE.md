# Proximo update - integracao FisioBot web

Criado em: 2026-05-25 09:26 -03:00 America/Sao_Paulo

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

11. Correcoes de agendamento WhatsApp para multiplos pacientes/horarios:
   - caso real a reproduzir: `marca Iara Noto e Julio Noto na sexta 12h e 13h`;
   - resposta incorreta observada: criou apenas `Julio Noto` em `29/05/2026 12:00`, ignorando Iara e deslocamento para 13h;
   - ajustar parser para preservar a ordem dos nomes e casar cada nome ao respectivo horario quando a frase trouxer listas paralelas;
   - quando houver ambiguidade de pareamento, pedir confirmacao objetiva antes de gravar agenda;
   - validar conflito individual por paciente/horario antes da escrita e retornar resumo por item: criado, conflito, paciente nao encontrado ou precisa confirmar;
   - otimizar o fluxo com processamento em lote: uma interpretacao da frase, uma busca consolidada de pacientes, uma leitura da janela de agenda e escritas transacionais/isoladas por item;
   - evitar confirmar sucesso parcial como se fosse sucesso completo.

12. Padrao de resposta para agendamento em lote:
   - trocar resposta longa por resumo escaneavel e sem caracteres quebrados;
   - formato sugerido:
     `Agendamentos criados:`
     `1. Iara Noto - sex 29/05/2026, 12:00-13:00 - R$ 150,00`
     `2. Julio Noto - sex 29/05/2026, 13:00-14:00 - R$ 150,00`
   - se houver falha parcial, responder:
     `Criados: ...`
     `Pendentes: ...`
     `Nao alterei os pendentes sem confirmacao.`
   - garantir saida real em UTF-8 correto para acentos do portugues, sem mojibake como `Ã s`.

13. Pre-flight obrigatorio antes de mexer no tablet vanilla:
   - antes do proximo update que tocar `src/vanilla/main.ts`, recuperar a versao limpa do branch principal/remoto e sobrepor o arquivo local se houver suspeita de corrupcao;
   - comando base previsto: `git fetch` seguido de restauracao direcionada de `src/vanilla/main.ts` a partir do branch main/origin correspondente;
   - depois reaplicar somente as alteracoes intencionais do update e rodar `npm run build:tablet`;
   - nao usar restauracao ampla do repo, para nao apagar alteracoes locais nao relacionadas.

## Observacoes tecnicas

- Comissao e Vendas permanecem no codigo/rotas, mas ocultas da navegacao ate existir modelo real nos DBs.
- Contas a pagar, receber e contas financeiras permanecem no codigo/rotas, mas ocultas ate o contrato com backend estar definido.
- Evitar criar dependencia direta do React com Baileys, arquivos `.db` ou scripts locais do tablet.
- O problema de travamento em `onClick`/`onSelect` de campos de texto foi tratado removendo rings de foco dos campos base e substituindo o Select Radix por wrapper nativo no build tablet; manter validacao remota apos cada deploy.
