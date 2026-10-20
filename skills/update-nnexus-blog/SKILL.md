---
name: update-nnexus-blog
description: Transforma a transcrição de um áudio do Gabriel Buarque contando a semana dele em um artigo para o blog nnex.us/blog, escrito na voz dele, mostra a prévia e só publica depois da aprovação. Use quando o Gabriel mandar uma transcrição, notas de voz ou um resumo da semana e pedir um artigo, "atualizar o blog", "publicar no nnex.us" ou "Update Nnexus Blog".
---

# Update Nnexus Blog

Você recebe a transcrição de um áudio longo e informal em que o Gabriel conta o que fez na semana, quase sempre sobre automações, agentes de IA e engenharia. Seu trabalho tem quatro passos:

1. **Consolidar** a transcrição em um artigo claro, rápido de ler e fiel ao que ele disse.
2. **Escrever na voz do Gabriel** (guia abaixo), não na sua.
3. **Mostrar a prévia** e esperar a aprovação.
4. **Publicar** em `nnex.us/blog` e entregar os textos prontos para compartilhar.

Nunca publique sem um "pode publicar" explícito. Nunca invente fatos, números, clientes ou resultados.

---

## 1. Ler e extrair

Leia a transcrição inteira antes de escrever. Monte uma lista interna com:

- **O que foi construído ou entregue** (ferramentas, workflows, agentes, features)
- **Problemas** que apareceram e **como foram resolvidos**
- **Decisões** e o *porquê* de cada uma (é o que ele mais valoriza)
- **Números**: tempo economizado, volume, custo, erros, testes. Só use os que ele falou.
- **Ferramentas** citadas (n8n, Dify, MCP, Claude, ChatGPT, Supabase, Docker, Cloudflare…)
- **Aprendizados** e opiniões
- **Links, repositórios, prints e vídeos** mencionados
- **Dúvidas**: tudo que ficou ambíguo vira pergunta na prévia, não suposição

**Confidencialidade.** A transcrição pode citar clientes, colegas, valores, credenciais, URLs internas ou dados de empresas (Volanos, IndiqAI e clientes). No artigo:
- Generalize clientes ("um cliente do setor de varejo no Canadá") a menos que ele diga que pode citar.
- Remova chaves, tokens, senhas, e-mails, telefones, IPs, URLs internas e valores contratuais.
- Avise na prévia o que foi omitido.

## 2. Escolher o ângulo

Um artigo, **uma ideia central**. Se a semana teve vários assuntos:
- Se eles se conectam (ex.: "automatizei o onboarding e isso mudou como uso agentes"), vira um artigo com seções.
- Se não se conectam, proponha na prévia: um artigo principal e o resto em uma seção curta "Outras coisas da semana", ou dividir em dois posts.

Título (até ~70 caracteres), concreto e específico. Bons formatos:
- "Como [fiz X] com [ferramenta] e [resultado]"
- "[Número] coisas que aprendi [fazendo X]"
- "Por que [decisão contraintuitiva]"
- "O que quebrou quando [fiz X] (e como resolvi)"

Evite títulos genéricos ("Minha semana", "Reflexões sobre IA").

## 3. A voz do Gabriel

Ele escreve como fala quando está explicando algo para um colega técnico: direto, calmo e prático. Referência do tom dele:

> "Gosto de entender o problema antes de escolher a tecnologia. Nem toda demanda precisa de uma arquitetura complexa, de agentes de IA ou de uma ferramenta nova."

> "Uso agentes para ampliar minha capacidade de execução, mas não trato código gerado automaticamente como código validado."

**Faça:**
- Primeira pessoa ("eu fiz", "eu decidi"). Use "a gente"/"nós" só quando foi trabalho de time.
- Português do Brasil, frases curtas, parágrafos de 1 a 4 linhas.
- Explique o **porquê** das decisões e o **trade-off**: o que ganhou e o que custou.
- Exemplos concretos e números reais. "Economizei 3 horas por semana" em vez de "economizei muito tempo".
- Conecte tecnologia com **produto, operação e negócio**. Ele sempre pensa nos três.
- Seja honesto sobre limites: o que não funcionou, o que ainda falta validar.
- Termine com um aprendizado ou o próximo passo, nunca com um resumo genérico.
- Termos técnicos em inglês quando é assim que se fala (workflow, deploy, prompt, embedding, MCP).
- Expressões que combinam com ele: "na prática", "de ponta a ponta", "problemas reais", "faz sentido", "o que realmente precisa ser resolvido".

**Não faça:**
- Hype: "revolucionário", "game changer", "incrível", "o futuro chegou", "neste artigo vamos explorar".
- Emojis no corpo do texto.
- Muletas da fala: "né", "tipo", "aí", "então assim", "enfim". Limpe sem mudar o sentido.
- Listas em tudo. Use listas para passos e itens; o raciocínio vai em prosa.
- Frases de efeito vazias ou conclusões moralistas.
- Colocar na boca dele opiniões que ele não deu.

## 4. Estrutura do artigo

Entre 600 e 1.400 palavras (de 3 a 7 minutos de leitura). Leitura rápida: quem só passar o olho pelos subtítulos e pelo resumo tem que entender o essencial.

```
frontmatter (ver seção 6)

Abertura (2–3 parágrafos curtos): o problema ou a situação, por que importava, o que você vai encontrar no texto.

## O contexto            ← só se precisar
## O que eu fiz          ← o miolo: passos, decisões, ferramentas (use ```steps se for sequência)
## O que deu errado      ← quando houver; é o que torna o texto útil
## O resultado           ← números (```stats) e impacto real
## O que eu aprendi      ← 2–4 aprendizados práticos
Fechamento: próximo passo ou pergunta aberta (1 parágrafo). Opcional: ```cta
```

Adapte os subtítulos ao assunto; eles devem dizer algo ("Por que tirei o agente do loop de aprovação" em vez de "Desenvolvimento"). Use de 3 a 6 seções `##`. Com 3 ou mais, o índice lateral aparece sozinho.

O campo `summary` (3 bullets) vira o box "Em 30 segundos" no topo. Ele precisa responder: o que foi feito, o resultado e o principal aprendizado. Também é o que os mecanismos de resposta (ChatGPT, Perplexity, Google AI) mais citam, então use frases completas e factuais.

## 5. Blocos disponíveis (template dinâmico)

O artigo é Markdown normal (títulos `##`, **negrito**, [links](https://…), listas, tabelas, citações `>`, `código`) mais blocos especiais. **Cada bloco especial é um bloco de código cuja linguagem é o nome do bloco.** Copie exatamente:

**Callout** (variantes: `tip`, `info`, `warn`, `success`; o texto depois da variante vira o título):
````
```callout tip
Use **tip** para atalhos e boas práticas.
```

```callout warn Cuidado com isso
Texto do alerta.
```
````

**Métricas** (`valor | rótulo`, uma por linha):
````
```stats
3h | economizadas por semana
14 | workflows no n8n
```
````

**Passos** (`título | descrição`):
````
```steps
Gravar o áudio | Falo livremente sobre a semana.
Transcrever | A transcrição vai para a skill.
Publicar | A skill gera o artigo e faz o commit.
```
````

**Imagem com legenda** (a legenda vai entre aspas; imagens do repositório ficam em `content/blog/media/<slug>/`):
```
![Texto alternativo descrevendo a imagem](/blog/media/<slug>/print-workflow.webp "Legenda opcional")
```

**Galeria** (`src | alt | legenda`):
````
```gallery
/blog/media/<slug>/antes.webp | Antes | Workflow antigo
/blog/media/<slug>/depois.webp | Depois | Workflow novo
```
````

**Código com nome de arquivo** (linguagem + nome):
````
```python agente.py
def resumir(texto: str) -> str:
    ...
```
````

**YouTube** (carrega só no clique; `title:` opcional):
````
```youtube
https://www.youtube.com/watch?v=ID
title: Demo do workflow
```
````

**Vídeo ou áudio próprio** (`url | poster` ou `url | rótulo`):
````
```video
/blog/media/<slug>/demo.mp4 | /blog/media/<slug>/poster.webp
```

```audio
/blog/media/<slug>/trecho.mp3 | Trecho da call
```
````

**Embed genérico** (Loom, Figma, CodePen, mapas, Google Slides; `height:` opcional, senão fica 16:9):
````
```embed
https://www.loom.com/embed/ID
title: Walkthrough
height: 480
```
````

**Card de repositório do GitHub** (descrição e estrelas buscadas no build):
````
```github
gabrielbuarque/n8n-nodes-difyai
```
````

**Card de link** (título e descrição buscados no build; dá para sobrescrever):
````
```link
https://docs.n8n.io/
title: Documentação do n8n
```
````

**Post do X/Twitter** (vira card com link):
````
```x
https://x.com/usuario/status/123
```
````

**Chamada para ação** (`texto | url | botão`):
````
```cta
Quer automatizar algo parecido? | mailto:buarquegabriel01@gmail.com | Fale comigo
```
````

**Citação com autor** (a última linha com "— " vira a assinatura):
```
> A IA acelera a execução, mas a responsabilidade pela arquitetura continua sendo minha.
>
> — Gabriel Buarque
```

Use os blocos com moderação: no máximo de 3 a 5 por artigo, só quando ajudam a ler mais rápido.

## 6. Frontmatter

```yaml
---
title: "Título do artigo (até ~70 caracteres)"
description: "Uma frase de 140–160 caracteres que vende o artigo. Aparece no Google e no card do LinkedIn/WhatsApp."
date: 2026-10-20            # data de publicação (AAAA-MM-DD)
tags: [automação, IA, n8n]  # 2–4 tags do vocabulário abaixo
summary:                    # box "Em 30 segundos" (exatamente 3 bullets)
  - "O que foi feito."
  - "O resultado, com número se houver."
  - "O principal aprendizado."
# opcionais:
# lang: en                  # padrão: pt
# cover: /blog/media/<slug>/capa.webp
# cover_alt: "Descrição da capa"
# audio: /blog/media/<slug>/audio.mp3   # player "Ouça na minha voz" no topo
# translation: slug-da-versao-em-ingles
# updated: 2026-10-27
# draft: true               # não publica
---
```

Tags preferidas: `automação`, `IA`, `agentes`, `n8n`, `Dify`, `MCP`, `memória`, `arquitetura`, `produto`, `infraestrutura`, `IndiqAI`, `Nnexus`, `aprendizados`, `open source`.

**Nome do arquivo:** `content/blog/AAAA-MM-DD-slug.md`. Slug curto, sem acentos, só com hífens (ex.: `2026-10-20-automatizei-o-onboarding-com-n8n.md`). A URL final é `https://nnex.us/blog/<slug>/` (sem a data).

A imagem de compartilhamento (og:image) é **gerada automaticamente** a partir do título, das tags e da data. Não precisa criar capa.

## 7. Checklist antes da prévia

- [ ] Todo fato, número e nome veio da transcrição (ou foi confirmado pelo Gabriel)
- [ ] Nada confidencial: clientes, credenciais, valores, URLs internas
- [ ] Título específico, até ~70 caracteres
- [ ] `description` entre 140 e 160 caracteres
- [ ] `summary` com exatamente 3 bullets factuais
- [ ] 600–1.400 palavras, subtítulos que dizem algo, parágrafos curtos
- [ ] Voz: primeira pessoa, sem hype, sem emojis, sem muletas
- [ ] Blocos com a sintaxe exata da seção 5
- [ ] Links externos completos (`https://…`)

## 8. Prévia (sempre antes de publicar)

Mostre nesta ordem:

1. **Card de compartilhamento**: título, `description` e URL final `https://nnex.us/blog/<slug>/` (é assim que aparece no LinkedIn e no WhatsApp).
2. **O artigo renderizado** (Markdown normal no chat).
3. **O arquivo completo** em um bloco de código `markdown` (frontmatter + corpo), pronto para commit.
4. **Pontos de atenção**: o que foi omitido por confidencialidade, suposições e perguntas.

Pergunte: "Quer ajustar algo ou posso publicar?" e espere. Aplique os ajustes e mostre a prévia de novo se mudar algo relevante.

## 9. Publicar

Repositório: **`gabrielbuarque/portfolio`**, branch **`main`**. Um push em `main` dispara o workflow **"Build & deploy nnex.us"**: ele gera o site, valida, faz o deploy no Easypanel e espera o post responder em `nnex.us`. Leva de 3 a 6 minutos.

**A) Se você tem acesso de escrita ao GitHub** (conector, API, Codex, Claude Code, git):
1. Crie `content/blog/AAAA-MM-DD-slug.md` com o conteúdo aprovado.
2. Se houver imagens ou áudio, envie-os para `content/blog/media/<slug>/` (de preferência `.webp` com até 1600px de largura e `.mp3` para áudio).
3. Commit em `main` com a mensagem `blog: <título>`.
4. Acompanhe o workflow em `https://github.com/gabrielbuarque/portfolio/actions`. Quando terminar, confira se `https://nnex.us/blog/<slug>/` abre.

**B) Se você não tem acesso de escrita:**
1. Entregue o arquivo final em um bloco de código.
2. Passe este link para o Gabriel criar o arquivo pelo navegador (ele cola o conteúdo e clica em "Commit changes"):
   `https://github.com/gabrielbuarque/portfolio/new/main/content/blog?filename=AAAA-MM-DD-slug.md`
3. Imagens: `https://github.com/gabrielbuarque/portfolio/upload/main/content/blog/media/<slug>`

Para despublicar ou corrigir, edite o mesmo arquivo (com `draft: true` o post sai do ar) e faça commit de novo.

## 10. Depois de publicar: textos para compartilhar

Entregue, na voz dele e com o link do post:

- **LinkedIn** (de 600 a 1.200 caracteres): gancho na primeira linha, de 2 a 4 linhas com o principal aprendizado ou resultado, o link no fim. Sem hashtags em excesso (no máximo 3).
- **X** (até 280 caracteres): uma frase com o insight e o link.
- **WhatsApp/Telegram** (1 a 2 linhas): o que é e o link.

Os botões de compartilhar (LinkedIn, X, WhatsApp, e-mail, copiar link) e o card com imagem já aparecem no post sozinhos.

## 11. Ouça na minha voz (futuro)

O template já tem suporte a áudio: quando houver o MP3 do artigo lido com a voz clonada do Gabriel, envie para `content/blog/media/<slug>/audio.mp3` e adicione `audio: /blog/media/<slug>/audio.mp3` no frontmatter. O player "Ouça na minha voz" aparece no topo do artigo, e o áudio entra nos dados estruturados (AudioObject). Para gerar o roteiro de leitura, use o texto do artigo sem os blocos de código e sem as tabelas.
