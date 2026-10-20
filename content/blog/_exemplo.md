---
title: "Exemplo: todos os blocos do template do blog"
description: "Artigo de referência com cada bloco disponível: resumo, callouts, métricas, passos, imagens, galeria, código, vídeo, embeds, cards de link e GitHub."
date: 2026-10-20
tags: [automação, IA, template]
summary:
  - "Arquivos que começam com _ nunca são publicados; servem de referência."
  - "Cada bloco especial é um bloco de código com o nome do widget."
  - "Imagens ficam em content/blog/media/<slug>/ e são servidas em /blog/media/<slug>/."
draft: true
---

Este é o parágrafo de abertura. Ele aparece logo depois do resumo "Em 30 segundos" e deve ir direto ao ponto: **o que aconteceu, por que importa e o que você vai tirar da leitura**.

## Texto, links e ênfase

Parágrafos curtos leem melhor. Use [links normais](https://indiqai.com/), `código inline` e listas:

- Um item por ideia.
- No máximo cinco itens.
- Termine com o que aprendeu.

> A IA acelera a execução, mas a responsabilidade pela arquitetura continua sendo minha.
>
> — Gabriel Buarque

## Callouts

```callout tip
Use **tip** para atalhos e boas práticas.
```

```callout warn Cuidado com isso
Use **warn** para riscos. O texto depois da variante vira o título.
```

```callout success
Use **success** para resultados.
```

## Métricas e passos

```stats
3h | economizadas por semana
14 | workflows no n8n
0 | erros em produção
```

```steps
Gravar o áudio | Falo livremente sobre a semana.
Transcrever | A transcrição vai para a skill.
Publicar | A skill gera o artigo e faz o commit.
```

## Imagens

![Fluxo do áudio até o blog](/blog/media/exemplo/fluxo.svg "Legenda opcional entre aspas")

```gallery
/blog/media/exemplo/fluxo.svg | Fluxo | Primeira imagem
/blog/media/exemplo/fluxo.svg | Fluxo | Segunda imagem
```

## Código

```python agente.py
def resumir(transcricao: str) -> str:
    """Consolida a semana em tópicos."""
    return llm(f"Resuma: {transcricao}")
```

## Vídeo, áudio e embeds

```youtube
https://www.youtube.com/watch?v=dQw4w9WgXcQ
title: Demo do workflow
```

```embed
https://www.openstreetmap.org/export/embed.html?bbox=-35.25%2C-5.86%2C-35.17%2C-5.76&layer=mapnik
title: Mapa de Natal
height: 360
```

## Cards de link e GitHub

```github
gabrielbuarque/n8n-nodes-difyai
```

```link
https://indiqai.com/
```

| Ferramenta | Uso |
| --- | --- |
| n8n | orquestração |
| Dify | agentes |

```cta
Quer automatizar algo parecido? | mailto:buarquegabriel01@gmail.com | Fale comigo
```
