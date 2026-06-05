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
   - reorganizar a tela `Cadastros` no padrao da referencia NextFit, mantendo as cores atuais do FisioBot e roxo apenas como acento;
   - layout desejado: coluna lateral com cards compactos de pacientes por nome, status e informacao curta; ao clicar no nome, abrir um card/ficha visivel do paciente na area principal;
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

