---
title: "Let AI do the work, not the learning"
description: "AI speeds up execution, but the discomfort that makes you improve, the studying and the review are still yours. What the research shows and what I do."
date: 2026-10-20
tags: [architecture, AI, learning, review]
summary:
  - "If you stop practicing, you lose the ability to judge the result, and if you can't judge it, you stop being bothered by what could be better."
  - "In a study of about 1,000 students, unrestricted AI raised practice scores by 48% and lowered exam scores without it by 17%."
  - "AI speeds up execution; spotting the problem, reviewing the solution and continuing to learn stay with you."
translation: use-a-ia-para-executar
---

Someone I know was great at writing essays. Top grades, sometimes a perfect score. After a long stretch of using AI to write almost everything, she sat an exam and got a bad grade.

She hadn't forgotten the material. What she lost was the path from the idea in her head to the words on the page. If she had handed the same ideas to an AI, it would probably have produced a top-scoring essay. Without the tool, the habit just wasn't there anymore.

This happens to me too. Some days I'm too lazy to write a piece in English or in Portuguese and I want the whole thing done for me. That's exactly where the risk is. And it doesn't stop at essays.

## Doing well with AI is not the same as learning

What happened to her has a name in the research: performance goes up while the tool is there and drops once it's gone.

```stats
~1,000 | high school students in the study
+48% | during practice, with open AI
−17% | on the exam, without AI
```

- In an experiment with about 1,000 high school math students in Turkey, those who practiced with an unrestricted, ChatGPT-style AI did 48% better during practice. On the exam without the tool, they did 17% worse than students who never had access. A version set up as a tutor, giving hints instead of answers, largely canceled out that effect ([Bastani et al., PNAS](https://doi.org/10.1073/pnas.2422633122)).
- In an MIT study with 54 participants writing essays, the group using an AI assistant showed the weakest brain connectivity on EEG, the lowest sense of ownership and trouble quoting their own essays. It's a preprint and hasn't been peer reviewed yet ([Kosmyna et al., MIT](https://arxiv.org/abs/2506.08872)).

```callout info What these studies don't say
Neither proves that using AI makes anyone incapable. They show something narrower: doing well while the tool is there is not the same as learning. And how you use it matters, as the hint-giving tutor shows.
```

The skill you lose isn't only the ability to produce. It's also the ability to judge. If you no longer write, it gets harder to notice when a text is weak. And if you don't notice something is weak, it doesn't bother you.

## Without experience, there's no discomfort

That's how dependence turns into complacency. People don't stop questioning out of laziness. They stop because they no longer have the experience to see what could be better.

Some company processes stay the same for 15 years. Most of the time it isn't carelessness: someone asked for it that way, it worked, and nobody had time to question it. The problem starts when nobody can ask anymore, "why do I do it this way? Can it be better?" That question only comes up for people who understand the work well enough to see the friction.

That's why I don't think jobs are going away that fast. AI is very good and will get better, but if you don't take care of your own knowledge and get comfortable with how you work today, you won't move forward. The professionals who will stand out are the ones who get bothered: by a confusing design, by code that could be better, by a slow customer-service process.

> What we can't do is be bothered by something and just accept it, get comfortable with it.

Discomfort is where a cycle starts, and AI only covers one part of it:

![The improvement loop with AI](/blog/media/use-a-ia-para-executar/ciclo-en.svg "AI speeds up the middle part. The discomfort, the review and the learning stay with you.")

AI is here to make execution fast. If we can put it to work for us, we should. There's a limit, of course: sometimes I catch myself trying to improve things that didn't need improving. Discomfort is useful when it points to rework, slowness or something that actually costs money.

## Spotting the problem means being able to judge the fix

Noticing the problem is the first half. The second is knowing whether the solution AI brought actually solves it. And this brings back the same skill from the start of this piece: judgment.

When I dug into studies on coding agents, the conclusion I found was this: the quality of agents doesn't depend only on which model is doing the work. The biggest room for improvement is in how we review, test and validate changes before accepting them.

The industry is moving that way. GitHub released ReviewBench, an open benchmark built only to measure how well AI reviews code, with 219 pull requests from 187 repositories in 19 languages ([GitHub](https://github.blog/ai-and-ml/github-copilot/reviewbench-an-open-benchmark-for-ai-code-review/)). And, as I showed in [One chat per task](/en/blog/one-chat-per-task/), even review works better when it starts in a clean conversation.

But however good the process, a review is only as good as the person who knows what's right. And knowing what's right takes continuing to learn.

## Knowing how you learn is what lets you delegate without losing

It took me a while to realize I spent high school, and maybe all of college, trying to learn the way I was taught: theory and exams. That has value, but everyone learns differently. Mine is intuitive. I like to poke at things and understand what happens behind them. I see a share icon, I already guess what it does, I test it and confirm.

Understanding that changed how I use AI. If I know I learn by tinkering, I also know what I can't hand over entirely: the part where I test, get it wrong and understand. The rest can go.

In practice, here's what I do:

```steps
The ideas are mine | I think it through and say what I want to say. AI organizes, formats and shapes it, like this article.
I hand off what teaches me nothing | Filling out my Lattes profile (Brazil's academic CV platform) by hand doesn't make me better at anything. That goes to AI.
I keep the creative part | Writing, telling a story, designing a game. AI tends to repeat the patterns it already knows.
Mistakes are just attempts | It went wrong? I adjust the original prompt or send a correction. Getting angry at the AI fixes nothing.
I review everything at the end | AI may get it right the first time, but I only know if I check.
```

In the [previous piece](/en/blog/one-chat-per-task/), I wrote about organizing context so AI works better. This is the other side: what you can't delegate. It helps to think of AI as an extension of your own body. It extends what you can do. What you know, what bothers you and what you decide to improve are still yours.
