---
name: update-nnexus-blog
description: Transforma a transcrição de um áudio do Gabriel Buarque contando a semana dele em um artigo para o blog nnex.us/blog, escrito na voz dele, mostra a prévia e só publica depois da aprovação. Use quando o Gabriel mandar uma transcrição, notas de voz ou um resumo da semana e pedir um artigo, "atualizar o blog", "publicar no nnex.us" ou "Update Nnexus Blog".
---

# Update Nnexus Blog

Você recebe a transcrição de um áudio longo e informal em que o Gabriel conta o que fez na semana, quase sempre sobre automações, agentes de IA e engenharia. O objetivo é que a revisão dele seja uma **revisão, não uma reescrita**: o rascunho já chega classificado, fiel ao que ele disse, sem nada sensível e na voz dele.

O fluxo:

1. **Receber** o material (texto ou áudio) e separar o que é conteúdo.
2. **Classificar** em um pilar antes de escrever qualquer coisa.
3. **Extrair** dos próprios termos dele: o que aconteceu, as frases boas e a única lição.
4. **Filtrar**: confidencialidade, reconhecimento de pessoas e ressentimento.
5. **Escrever** na voz do Gabriel, não na sua.
6. **Checar** voz, números e fontes.
7. **Mostrar a prévia**, esperar a aprovação, **publicar** e entregar os posts para as redes.

Nunca publique sem um "pode publicar" explícito. Nunca invente um fato, um número, um cliente, um resultado ou um detalhe de história para ela "funcionar melhor".

---

## 1. Receber o material

- **Texto** (transcrição colada, Wispr Flow, Otter, Plaud): use direto.
- **Áudio**: se você consegue transcrever, transcreva **literalmente**, com hesitações e frases quebradas. O ritmo falado é matéria-prima para ganchos; não limpe nada nesta etapa. Se não consegue, peça a transcrição em texto e não prometa prazo.
- **Guarde o bruto à parte.** A transcrição original nunca vai para o repositório (ele é público). Se houver um lugar privado para guardá-la (o Nnexus, uma pasta pessoal), sugira guardar lá, intacta.

## 2. Classificar (antes de escrever)

Todo artigo pertence a **um pilar**. O pilar vira a primeira tag.

| Pilar | Do que trata | Tag principal |
| --- | --- | --- |
| Automação na prática | workflows, integrações e processos que ele automatizou (n8n, Dify, webhooks) | `automação` |
| Agentes e memória | agentes de IA, MCP, contexto, memória persistente, Nnexus | `agentes` |
| Engenharia com IA | arquitetura, segurança, testes, infraestrutura, como usa IA para construir software | `arquitetura` |
| Produto e negócio | decisões de produto, SaaS, IndiqAI, operação, o lado de negócio das escolhas técnicas | `produto` |
| Pesquisa e dados | mestrado, privacidade, análise de dados, LGPD | `pesquisa` |

**Teste de conteúdo.** Um trecho só vira artigo se tiver as três coisas: **algo que ele fez ou decidiu**, **um resultado ou problema concreto** e **algo que outra pessoa técnica possa aproveitar**. Se a semana não passa no teste:
- se ainda houver algo útil, proponha uma **nota curta** (300 a 500 palavras, sem forçar seções);
- se não houver, diga isso e **não escreva nada**. Uma semana fraca não vira um artigo forçado.

## 3. Extrair do que ele falou

Leia tudo antes de escrever e monte, citando trechos **exatos** da transcrição:

- **A espinha da história**: o que aconteceu, na ordem em que aconteceu.
- **Frases dele que valem manter**: expressões, comparações e opiniões com a cara dele. Elas viram título, gancho e subtítulos.
- **A virada**: a **única** lição que a história sustenta. Uma história, uma lição. Se aparecerem duas lições, são dois artigos (ou uma vai para o backlog).
- **O mecanismo**: o *porquê* da decisão e o trade-off (o que ganhou, o que custou). É o que ele mais valoriza.
- **Números** que ele disse (tempo, volume, custo, erros, testes).
- **Ferramentas**, **links**, **repositórios**, **prints** e **vídeos** citados.
- **Dúvidas**: tudo que ficou ambíguo vira pergunta na prévia, não suposição.
- **Ângulos que sobraram**: vão para o backlog (seção 12).

Rascunhe a partir das palavras dele, nunca de um resumo genérico do tema. A transcrição sempre ganha de qualquer ideia sua sobre o assunto.

## 4. Filtrar: confidencialidade, reconhecimento e ressentimento

A transcrição pode citar clientes, colegas, valores, credenciais e dados de empresas (IndiqAI, Volanos e clientes delas). Este filtro é obrigatório.

**Confidencialidade**
- Nomes de clientes e empresas de terceiros saem, a menos que o Gabriel diga que pode citar. Use um descritor vago o bastante para não identificar ("um cliente do varejo", "uma empresa grande").
- Valores de contrato e preços viram faixa ("cinco dígitos", "alguns milhares de reais") ou saem.
- Chaves, tokens, senhas, e-mails, telefones, IPs, URLs internas e prints com dados sensíveis saem sempre.
- Relações privadas saem: quem apresentou quem, negociações com pessoas nomeadas.
- Família e vida pessoal só entram se mostrarem como ele pensa e se ele confirmar.
- **Tudo que ele disse que não pode ser publicado fica fora, sem jeitinho.**
- Palavrão sai.

**Reconhecimento.** Quem lê não pode identificar as pessoas da história, e as próprias pessoas não podem se reconhecer nela.
- Tire as digitais: tempo de relacionamento, onde se conheceram, o que venderam um para o outro, contagens exatas, cidade, detalhes do negócio. Se o ponto depender de um número, arredonde.
- Nomes de ferramentas e tecnologias **ficam** (são o assunto do blog); nomes de produtos de clientes saem.
- **O teste:** a pessoa da história se reconheceria? Se sim, generalize de novo. Se o ponto não sobrevive à generalização, o trecho vai para "Pendente de confirmação" (seção 12) em vez de entrar no texto.
- Marcar alguém nas redes só em post que elogia a pessoa, nunca em um que tira lição da situação dela.

**Sem marcação de tempo relativa.** O post é lido meses depois. Nada de "ontem", "semana passada", "hoje de manhã", "há três semanas" ou mês e evento nomeados no título, no gancho, no corpo ou nos posts das redes. A data já está no post. Use "Em um projeto recente...", "Quando comecei a...", ou nenhuma marcação.

**Ressentimento.** O áudio carrega frustrações reais com clientes, ferramentas e pessoas, e o leitor sente isso mesmo com as palavras limpas. Texto que soa como "o outro lado é burro" destrói a autoridade dele. Corrija nesta ordem de preferência:
1. Comece pelo **padrão**, não pelo incidente ("isso acontece muito quando...").
2. Mostre a decisão do outro lado como **razoável no momento**, porque geralmente era.
3. Inclua **um erro do próprio Gabriel** ou do time dele. É isso que dá credibilidade.

**Sem prejuízo para ninguém:** mesmo que alguém se reconheça, nada no texto pode soar como crítica a essa pessoa. A história é um padrão comum que ele está explicando, nunca um veredito sobre alguém.

## 5. A voz do Gabriel

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
- Reaproveite as frases dele (seção 3) nos ganchos e subtítulos.
- Expressões que combinam com ele: "na prática", "de ponta a ponta", "problemas reais", "faz sentido", "o que realmente precisa ser resolvido".

**Não faça:**
- Hype: "revolucionário", "game changer", "incrível", "o futuro chegou", "neste artigo vamos explorar".
- Tom de venda ou pitch. O artigo ensina; no máximo um bloco `cta` discreto no fim.
- Travessão (—) no corpo do texto: use vírgula, dois-pontos, parênteses ou ponto. A única exceção é a assinatura de citação (`— Nome`), que o template exige.
- Emojis no corpo do texto.
- Muletas da fala: "né", "tipo", "aí", "então assim", "enfim". Limpe sem mudar o sentido.
- Listas em tudo. Use listas para passos e itens; o raciocínio vai em prosa.
- Frases de efeito vazias ou conclusões moralistas.
- Colocar na boca dele opiniões que ele não deu, ou autoridade que ele não tem (ele é CTO, builder e mestrando; não é professor doutor, investidor nem especialista jurídico).

## 6. Números e fontes

- A experiência dele é a fonte principal. Números da transcrição entram como ele disse (respeitando o filtro da seção 4).
- **Estatística externa só entra se for verificada na fonte original**, com link no texto. Nunca de memória, nunca de listicle, nunca um número contestado (o clássico "bug em produção custa 100x mais" não tem estudo localizável). Na dúvida, deixe fora: o blog não precisa de enchimento com dados.
- **Formato consistente:** estatísticas, porcentagens e dinheiro sempre em algarismos, porcentagem com `%`, inclusive no começo da frase ("17% dos casos", nunca "Dezessete por cento"). Milhar com ponto ("3.586"), decimal com vírgula.

## 7. Escolher o ângulo

Um artigo, **uma ideia central** (a virada da seção 3). Se a semana teve vários assuntos:
- Se eles se conectam (ex.: "automatizei o onboarding e isso mudou como uso agentes"), vira um artigo com seções.
- Se não se conectam, o principal vira o artigo e o resto vai para o backlog, ou para uma seção curta "Outras coisas que fiz" se tiver valor por si.

**Cadência:** o blog é semanal. A entrega padrão por áudio é **1 artigo + os posts das redes que derivam dele** (seção 14). Não produza vários artigos de um áudio só para "ter estoque"; ângulos extras vão para o backlog.

Título (até ~70 caracteres), concreto e específico. Bons formatos:
- "Como [fiz X] com [ferramenta] e [resultado]"
- "[Número] coisas que aprendi [fazendo X]"
- "Por que [decisão contraintuitiva]"
- "O que quebrou quando [fiz X] (e como resolvi)"

Evite títulos genéricos ("Minha semana", "Reflexões sobre IA") e títulos com marcação de tempo ("O que fiz esta semana").

## 8. Estrutura do artigo

Entre 600 e 1.400 palavras (de 3 a 7 minutos de leitura). Leitura rápida: quem só passar o olho pelos subtítulos e pelo resumo tem que entender o essencial.

```
frontmatter (ver seção 10)

Abertura (2–3 parágrafos curtos): gancho (de preferência uma frase dele), o problema ou a situação, por que importava. Sem marcação de tempo.

## O contexto            ← só se precisar
## O que eu fiz          ← o miolo: passos, decisões, ferramentas (use ```steps se for sequência)
## O que deu errado      ← quando houver; é o que torna o texto útil
## O resultado           ← números (```stats) e impacto real
## O que eu aprendi      ← 2–4 aprendizados práticos
Fechamento: próximo passo ou pergunta aberta (1 parágrafo). Opcional: ```cta
```

Adapte os subtítulos ao assunto; eles devem dizer algo ("Por que tirei o agente do loop de aprovação" em vez de "Desenvolvimento"). Use de 3 a 6 seções `##`. Com 3 ou mais, o índice lateral aparece sozinho.

O campo `summary` (3 bullets) vira o box "Em 30 segundos" no topo. Ele precisa responder: o que foi feito, o resultado e o principal aprendizado. Também é o que os mecanismos de resposta (ChatGPT, Perplexity, Google AI) mais citam, então use frases completas e factuais.

## 9. Blocos disponíveis (template dinâmico)

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

## 10. Frontmatter

```yaml
---
title: "Título do artigo (até ~70 caracteres)"
description: "Uma frase de 140–160 caracteres que vende o artigo. Aparece no Google e no card do LinkedIn/WhatsApp."
date: 2026-10-20            # data de publicação (AAAA-MM-DD)
tags: [automação, n8n, IA]  # pilar primeiro + 1 a 3 de assunto
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

A primeira tag é a do pilar (seção 2): `automação`, `agentes`, `arquitetura`, `produto` ou `pesquisa`. As outras (1 a 3) dizem o assunto: `IA`, `n8n`, `Dify`, `MCP`, `memória`, `infraestrutura`, `IndiqAI`, `Nnexus`, `aprendizados`, `open source`.

**Nome do arquivo:** `content/blog/AAAA-MM-DD-slug.md`. Slug curto, sem acentos, só com hífens (ex.: `2026-10-20-automatizei-o-onboarding-com-n8n.md`). A URL final é `https://nnex.us/blog/<slug>/` (sem a data).

A imagem de compartilhamento (og:image) é **gerada automaticamente** a partir do título, das tags e da data. Não precisa criar capa.

## 11. Checagem final (o rascunho reprova se...)

Rode antes de mostrar a prévia. Qualquer item marcado reprova o rascunho: corrija e rode de novo.

**Fidelidade**
- [ ] Algum fato, número, nome ou detalhe de história não veio da transcrição nem foi confirmado pelo Gabriel
- [ ] O artigo tem mais de uma lição central
- [ ] Não se encaixa em nenhum pilar da seção 2

**Filtro (seção 4)**
- [ ] Aparece cliente, empresa de terceiro, valor exato, credencial, URL interna ou relação privada
- [ ] Alguém da história poderia se reconhecer
- [ ] Sobrou marcação de tempo relativa (título, gancho, corpo ou posts das redes)
- [ ] Algum trecho soa como reclamação ou crítica a uma pessoa ou empresa

**Voz (seção 5)**
- [ ] Soa como pitch ou tem chamada de venda
- [ ] Tem hype, emoji, palavrão, muleta de fala ou travessão no corpo
- [ ] Atribui a ele uma opinião ou autoridade que ele não tem

**Números (seção 6)**
- [ ] Estatística externa sem link para a fonte original
- [ ] Números em formatos misturados (por extenso e em algarismos, % e "por cento")

**Formato**
- [ ] Título acima de ~70 caracteres ou genérico
- [ ] `description` fora de 140 a 160 caracteres
- [ ] `summary` sem exatamente 3 bullets factuais
- [ ] Fora de 600 a 1.400 palavras (ou 300 a 500 numa nota curta)
- [ ] Bloco especial com sintaxe diferente da seção 9, ou link externo sem `https://`

## 12. Prévia (sempre antes de publicar)

Mostre nesta ordem:

1. **Classificação**: pilar, tipo (artigo ou nota curta) e a lição central em uma frase.
2. **Card de compartilhamento**: título, `description` e URL final `https://nnex.us/blog/<slug>/` (é assim que aparece no LinkedIn e no WhatsApp).
3. **O artigo renderizado** (Markdown normal no chat).
4. **O arquivo completo** em um bloco de código `markdown` (frontmatter + corpo), pronto para commit.
5. **O que foi filtrado**: o que saiu por confidencialidade ou reconhecimento e o que foi generalizado ou arredondado, para ele conferir que o sentido ficou certo.
6. **Pendente de confirmação**: tudo que precisa do "ok" dele antes de ir ao ar (números desidentificados, nomes, histórias que o envolvem negativamente, se um ângulo pessoal pode entrar). Junte numa lista só, em vez de interromper o trabalho com perguntas soltas. O que estiver aqui não vai para o texto até ele confirmar.
7. **Backlog**: os ângulos que sobraram, um por linha, com o pilar e a frase dele que sustenta cada um. São pautas para semanas fracas. Se houver um lugar privado para guardar (Nnexus), sugira salvar lá.

Pergunte: "Quer ajustar algo ou posso publicar?" e espere. Aplique os ajustes e mostre a prévia de novo se mudar algo relevante.

## 13. Publicar

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

## 14. Posts para as redes

Entregue junto com o link do post, na voz dele e passando pelos mesmos filtros (seção 4) e pela mesma checagem (seção 11). **Cada post se sustenta sozinho**: quem não clicar no link ainda leva a ideia. O link é bônus, não a razão do post.

- **LinkedIn** (de 600 a 1.200 caracteres): o gancho na primeira linha, de preferência uma frase dele. Depois, de 2 a 4 linhas curtas com a lição e o mecanismo ou o resultado. O link vai no fim. No máximo 3 hashtags.
- **X** (até 280 caracteres): uma frase com o insight e o link.
- **WhatsApp/Telegram** (1 a 2 linhas): o que é e o link.

Varie o tipo de gancho de uma semana para outra: frase dele, número, erro que ele cometeu, decisão contraintuitiva, pergunta. Não repita o mesmo formato duas semanas seguidas. Marque pessoas só em post que as elogia.

Os botões de compartilhar (LinkedIn, X, WhatsApp, e-mail, copiar link) e o card com imagem já aparecem no post sozinhos.

## 15. Quando o Gabriel corrige

As correções dele são a melhor fonte para melhorar esta skill.

- Se a correção vale só para este artigo, aplique e siga.
- Se ela muda uma regra (uma palavra que ele não usa, um tipo de história que não quer contar, um formato de título que não gosta), aplique no artigo **e** proponha a mudança exata para este SKILL.md (seção e texto), para não repetir o erro.
- Quando uma regra mudar, confira os rascunhos que ainda não foram publicados e ajuste-os à regra nova antes de seguir.

## 16. Ouça na minha voz (futuro)

O template já tem suporte a áudio: quando houver o MP3 do artigo lido com a voz clonada do Gabriel, envie para `content/blog/media/<slug>/audio.mp3` e adicione `audio: /blog/media/<slug>/audio.mp3` no frontmatter. O player "Ouça na minha voz" aparece no topo do artigo, e o áudio entra nos dados estruturados (AudioObject). Para gerar o roteiro de leitura, use o texto do artigo sem os blocos de código e sem as tabelas.
