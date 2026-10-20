---
title: "The Context Window Is Not Your Project Memory"
description: "A long PDF can crowd out the task that follows. Here is how I extract what matters, split work across chats, and keep each result checkable."
date: 2026-10-20
lang: en
noindex: true
translation: janela-de-contexto-nao-e-memoria-infinita
tags: [agents, context, productivity, memory]
summary:
  - "I separate reading a large document from the tasks that depend on it."
  - "Each new chat gets only the summary and details needed for its specific task."
  - "Context works better when the task has a clear goal and a result I can verify."
---

A PDF can fit inside a context window and still leave little room for the work that comes next.

This often happens with long documents, such as a funding call. One file may contain the rules, deadlines, required documents, evaluation criteria, and form instructions. It is tempting to attach the whole thing to one chat and keep asking about every step there.

The chat then carries the entire document alongside every question, answer, and decision that follows. A large window helps, but it does not make the AI use every detail with equal attention from beginning to end.

![A flow for turning a long document into task-specific context](/blog/media/the-context-window-is-not-project-memory/project-context.svg "From the full document to a checkable task")

## A large window still has practical limits

A context window is the information a model can consider during an interaction. It includes what I write, files and excerpts brought into the chat, earlier responses, and system instructions. When a task starts with a huge document, part of that space is already occupied before I begin the actual work.

There is another issue beyond volume. In *Lost in the Middle*, Liu and colleagues evaluated models on information-retrieval tasks with long contexts. In the tested settings, models did not use information evenly: the position of relevant facts affected accuracy, and facts in the middle could be harder to retrieve. The study does not establish a universal percentage at which quality drops. It shows that a larger window alone does not guarantee uniform attention across its contents. ([Liu et al., 2024](https://aclanthology.org/2024.tacl-1.9/))

That is why I do not treat the context window as a storage bin where I can put everything and expect the AI to find the right detail every time. I organize the work so the most important context is explicit and close to the current task.

## First, I turn the document into a map

When I receive a long PDF, I start one chat to understand the document, not to perform every task that might come from it. I ask for a summary that answers concrete questions:

- What are the rules and evaluation criteria?
- What are the deadlines and required documents?
- Which forms or fields need to be completed?
- What is unclear or needs confirmation?
- Which page contains each important detail?

I ask the AI to distinguish what the document states from what it infers. For details that could change a decision, I keep the page or original passage as a reference. The summary is a map for the work, not a replacement for the source.

## Then I open one chat for each task

Once I know what needs to happen, I start a new chat for each piece of work: identifying documents, drafting answers, filling out a form, or reviewing the result. I bring the summary and only the details that apply to that step.

Instead of starting each task with dozens of pages, I begin with a small, targeted packet. If a section of the funding call matters, I include that excerpt or point to the page. If the form has specific fields, I bring the field list. The chat can focus on the required output.

It also becomes easier to work in parallel. One chat can map the documents while another organizes the form questions. Then I combine the results and check them against the funding call. Separation does not remove the need for coordination, but it reduces irrelevant context in each step.

## A good request makes the result checkable

Splitting chats helps, but I still need to define what it means to finish each task. If I only ask “take care of this,” the AI may return something that looks complete without a clear way to verify it.

I try to specify the expected result, format, allowed sources, and conditions that must be met. For a form, the task could be to map each field, identify the matching information, and mark anything missing from the documents. Later, if an agent fills out the form on a website, I review the content against the original sources before accepting the submission.

That gives the AI a way to judge whether it reached the requested result. It also gives me a way to judge its work. Review is still my responsibility, especially when a deadline, rule, or statement could have real consequences.

## Context should serve the task

This method has a cost: I need to prepare an initial summary and keep the chats organized. Not every document needs a separate step, and not every question needs a new chat. I split the work when reading the source and executing distinct tasks would compete for the same context.

The idea is simple: I use one chat to understand the material, preserve the important information in a checkable summary, and start each task with the context it needs. A huge window does not replace that organization. My work improves when I carry less information, more intentionally, and verify the result before moving on.
