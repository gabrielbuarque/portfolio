---
title: "Um chat por tarefa: de 7 horas para 40 minutos com a mesma IA"
description: "Jogar um PDF enorme numa conversa e seguir perguntando come o contexto da IA. Separar leitura e execução em chats limpos mudou todo o resultado."
date: 2026-10-20
tags: [agentes, contexto, IA, produtividade]
summary:
  - "Um PDF longo pode ocupar quase todo o contexto de uma conversa antes do trabalho começar, e a qualidade cai conforme a janela enche."
  - "O método: uma conversa lê e resume; cada tarefa ganha um chat novo só com o resumo e o que ela precisa."
  - "Uma tarefa travada há 7 horas foi resolvida em 30 a 40 minutos, com a mesma IA, só mudando a forma de organizar o contexto."
noindex: true
---

Uma pessoa próxima estava havia mais de 7 horas tentando preencher o formulário de um edital com ajuda da IA. Com o mesmo modelo e o mesmo documento, terminamos em 30 a 40 minutos. A diferença não foi a ferramenta. Foi o contexto.

O edital era de um programa de investimento em inovação: mais de 70 páginas com regras, prazos, documentos exigidos e critérios de avaliação. Ela fez o que quase todo mundo faz. Anexou o PDF inteiro numa conversa e foi perguntando tudo ali mesmo, uma pergunta atrás da outra. Em algum momento as respostas começaram a piorar, mesmo usando o modelo mais avançado disponível.

```stats
70+ | páginas no edital
7h | tentando numa conversa só
30–40 min | com um chat por tarefa
```

## Janela grande não é memória infinita

Os modelos de ponta já trabalham com janelas de contexto de 1 milhão de tokens ou mais ([Google](https://ai.google.dev/gemini-api/docs/long-context)). Parece muito. Mas quando você joga um PDF gigantesco numa conversa, na minha experiência ele já come algo como 80% a 90% do contexto. E cada pergunta, cada resposta e cada correção que vem depois também ocupa espaço.

![Duas formas de usar a mesma janela de contexto](/blog/media/um-chat-por-tarefa/janela.svg "Na conversa única, o documento ocupa quase tudo. Com um chat por tarefa, cada um começa só com o resumo.")

O que eu percebo no dia a dia é que, quando a conversa passa de 60% a 70% da janela, a qualidade cai bastante. Isso não é só impressão minha:

- O estudo *Lost in the Middle* mostrou que os modelos usam melhor a informação que está no começo ou no fim do contexto, e pior a que fica no meio ([Liu et al., TACL](https://arxiv.org/abs/2307.03172)).
- A Chroma testou 18 modelos e concluiu que eles não mantêm o mesmo desempenho conforme a entrada cresce, mesmo em tarefas simples ([Context Rot](https://www.trychroma.com/research/context-rot)).

Nenhum dos dois define um ponto exato em que a qualidade despenca. Mas os dois apontam para o mesmo lugar: caber na janela não é o mesmo que ser bem usado.

É igual com uma pessoa. Se eu entrego um PDF de 70 páginas para alguém e logo em seguida começo a fazer perguntas sobre pontos diferentes, esperando qualidade perfeita em todas, ninguém consegue. A nossa memória não funciona assim. A gente não lembra de cada momento, lembra das partes importantes. É por isso que tanta gente estuda com flashcards: eles guardam o gatilho, não o livro inteiro.

## O método: uma conversa lê, outras executam

O que eu fiz com ela foi separar a leitura da execução:

```steps
Resumir o edital | Numa conversa, o PDF inteiro entra e sai um resumo com regras, prazos, documentos e critérios.
Listar os documentos | Num chat novo, só com o resumo: quais documentos ela precisa juntar.
Mapear o formulário | Em outro chat, o agente lista os campos que o formulário pede.
Consolidar as respostas | Os campos voltam para o chat do resumo, que monta a melhor resposta para cada um, com base nos documentos dela.
Preencher | Um último chat recebe as respostas prontas e preenche o formulário no site.
```

Em vez de começar cada tarefa com 80% do contexto ocupado, cada chat começa com algo como 5%. **E os 5% que realmente importam.** O resto da janela fica livre para o trabalho.

![Fluxo de um chat por tarefa](/blog/media/um-chat-por-tarefa/fluxo.svg "O resumo é o que viaja entre as conversas. O PDF fica em um lugar só.")

Tem um ganho extra: dá para trabalhar em paralelo. Enquanto um chat separa documentos, outro mapeia o formulário. Com agentes e subagentes, isso vira rotina.

```callout tip Regra prática
Se você está há muito tempo numa tarefa e as respostas começaram a piorar, abra um chat novo levando só o resumo. Se resolver, ótimo. Se não resolver, aí sim o problema é outro, e vale testar outra abordagem.
```

## Diga como a IA confere se acertou

Separar conversas resolve metade. A outra metade é o pedido. Se a IA não sabe qual é o resultado esperado, ela não tem como conferir se chegou lá.

Por isso cada chat recebeu um objetivo verificável: "liste os documentos exigidos", "liste os campos do formulário", "para cada campo, diga a resposta e de onde ela saiu". Outro detalhe que ajudou: em vez de digitar, ela falou o que queria no microfone. Eu uso muito o Wispr Flow para ditar. Falando, a gente explica melhor o que quer do que escrevendo um prompt curto.

A revisão também se beneficia de começar limpa. Em um estudo com 150 erros inseridos em textos e código, uma segunda revisão feita na mesma conversa achou menos erros do que uma revisão feita numa sessão nova, sem o histórico (F1 de 21,7% contra 28,6%). É um preprint, com um modelo só, mas vai na mesma direção ([Song, Cross-Context Review](https://arxiv.org/abs/2603.12123)).

## O que eu aprendi vendo de fora

Para mim isso já é hábito. Eu abro uma conversa, depois outra, e outra, o dia todo, no trabalho na Volanos e na IndiqAI. Ver alguém perder 7 horas com isso me fez perceber que muita coisa que eu considero simples não é óbvia para os outros. Não por falta de capacidade, e sim porque ninguém mostrou que dava para fazer diferente.

> Na era dos agentes, ainda tem muita gente usando o ChatGPT e o Claude como se fossem só geradores de texto. Eles já controlam navegadores, têm plugins, fazem muito mais.

Quem aprende a organizar o contexto tira muito mais da mesma ferramenta. E continua precisando revisar no final: a IA pode até acertar de primeira, mas você só vai saber se conferir.
