---
title: "One chat per task: how 7 hours of AI work became 40 minutes"
description: "Dropping a huge PDF into one AI chat and asking everything there eats the context window. Splitting reading from doing into clean chats fixed it."
date: 2026-10-20
tags: [agents, context, AI, productivity]
summary:
  - "A long PDF can take up most of a conversation's context before any real work starts, and quality drops as the window fills up."
  - "The method: one conversation reads and summarizes; every task gets a fresh chat with only the summary and what it needs."
  - "A task that had been stuck for 7 hours was done in 30 to 40 minutes, with the same AI, just by organizing the context differently."
translation: um-chat-por-tarefa
---

Someone close to me had spent more than 7 hours trying to fill out an application form with AI. Same model, same document, and we finished in 30 to 40 minutes. The difference wasn't the tool. It was the context.

The document was a call for proposals from an innovation funding program: more than 70 pages of rules, deadlines, required documents and evaluation criteria. She did what almost everyone does. She attached the whole PDF to one conversation and kept asking everything right there, one question after another. At some point the answers got worse, even on the most capable model available.

```stats
70+ | pages in the call
7h | stuck in a single chat
30–40 min | with one chat per task
```

## A big window is not infinite memory

Frontier models already work with context windows of 1 million tokens or more ([Google](https://ai.google.dev/gemini-api/docs/long-context)). That sounds like a lot. But when you drop a massive PDF into a conversation, in my experience it already eats something like 80% to 90% of the context. Every question, answer and correction after that takes up room too.

![Two ways to use the same context window](/blog/media/um-chat-por-tarefa/janela-en.svg "In a single conversation, the document takes almost everything. With one chat per task, each one starts with just the summary.")

What I see day to day is that once a conversation goes past 60% to 70% of the window, quality drops a lot. It isn't just my impression:

- The *Lost in the Middle* study showed that models use information at the start or end of the context better than information buried in the middle ([Liu et al., TACL](https://arxiv.org/abs/2307.03172)).
- Chroma tested 18 models and found they don't keep the same performance as the input grows, even on simple tasks ([Context Rot](https://www.trychroma.com/research/context-rot)).

Neither study sets an exact point where quality falls off a cliff. But both point the same way: fitting in the window is not the same as being used well.

It works the same way with people. If I hand someone a 70-page PDF and immediately start asking about different parts of it, expecting a perfect answer every time, nobody can do that. Our memory doesn't work like that. We don't remember every moment, we remember the important parts. That's why so many people study with flashcards: they keep the trigger, not the whole book.

## The method: one conversation reads, others do the work

What I did with her was separate reading from doing:

```steps
Summarize the call | In one conversation, the whole PDF goes in and a summary comes out: rules, deadlines, documents and criteria.
List the documents | In a fresh chat, with only the summary: which documents she needs to gather.
Map the form | In another chat, the agent lists every field the form asks for.
Draft the answers | The fields go back to the summary chat, which writes the best answer for each one from her documents.
Fill it in | A last chat gets the finished answers and fills out the form on the website.
```

Instead of starting every task with 80% of the context already used, each chat starts at around 5%. **And it's the 5% that actually matters.** The rest of the window stays free for the work.

![One chat per task, step by step](/blog/media/um-chat-por-tarefa/fluxo-en.svg "The summary travels between conversations. The PDF stays in one place.")

There's a bonus: you can work in parallel. While one chat sorts out the documents, another maps the form. With agents and subagents, this becomes routine.

```callout tip Rule of thumb
If you've been on a task for a long time and the answers are getting worse, open a new chat and bring only the summary. If that fixes it, great. If it doesn't, then the problem is something else, and it's time to try a different approach.
```

## Tell the AI how to check its own work

Splitting conversations solves half of it. The other half is the request. If the AI doesn't know what the expected result is, it has no way to check whether it got there.

So each chat got a goal you could verify: "list the required documents", "list the form fields", "for each field, give the answer and where it came from". One more thing helped: instead of typing, she said what she wanted out loud. I use Wispr Flow a lot to dictate. When we talk, we explain what we want better than we do in a short typed prompt.

Review also works better when it starts clean. In a study with 150 errors planted in documents and code, a second review done in the same conversation caught fewer errors than a review done in a fresh session with no history (F1 of 21.7% versus 28.6%). It's a preprint, with a single model, but it points the same way ([Song, Cross-Context Review](https://arxiv.org/abs/2603.12123)).

## What I learned watching from the outside

For me, this is already a habit. I open a conversation, then another, and another, all day, working at Volanos and IndiqAI. Watching someone lose 7 hours to this made me realize that a lot of what I consider simple isn't obvious to others. Not because they can't do it, but because nobody ever showed them there was another way.

> In the age of agents, plenty of people still use ChatGPT and Claude as if they were just text generators. They already drive browsers, run plugins and do a lot more.

People who learn to organize context get a lot more out of the same tool. And they still need to review at the end: the AI might get it right the first time, but you only know if you check.
