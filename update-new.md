# Update novo - parser semantico e valor coletivo de atendimentos

Criado em: 2026-06-18 10:38:17 -03:00 America/Sao_Paulo

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
