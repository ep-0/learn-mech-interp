---
title: "Reading and Running Research Code"
description: "Getting someone else's experiment to run: environments and dependencies, notebooks and scripts, version control, seeds and reproducibility, and debugging code you did not write."
order: 3
status: placeholder
prerequisites:
  - title: "Python Fundamentals"
    url: "/topics/python-fundamentals/"
---

## Why this article exists

Interpretability moves through repositories rather than through papers alone, and the gap between reading a result and reproducing it is almost always environments, versions, and unfamiliar code rather than the idea itself. This is the article that stops that gap from being where people quit.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Environments and dependencies**

- Why a fresh environment per project, and `venv` or `conda` as the two normal ways
- `pip install`, requirements files, and pinning a version
- Reading a dependency error and deciding whether to pin, upgrade, or work around

**2. Notebooks and scripts**

- What each is good at, and the failure mode of out-of-order notebook cells
- Moving working notebook code into a script once an experiment stabilizes
- Colab and hosted notebooks, and the reason most interpretability tutorials assume them

**3. Version control, minimally**

- Cloning a repository and checking out the commit a paper refers to
- `status`, `diff`, `add`, `commit`, and branches as the five things you need
- Why a result you cannot tie to a commit is a result you cannot reproduce

**4. Reproducibility**

- Seeding Python, NumPy, and the framework, and what still varies afterward
- Nondeterminism from hardware and parallelism, and when to stop chasing it
- Recording the configuration that produced a number, alongside the number

**5. Debugging code you did not write**

- Reading a traceback from the bottom up, across library frames
- Print debugging, `breakpoint()`, and inspecting a tensor's shape at a failure point
- Bisecting a failure: shrink the input, disable half the pipeline, isolate the change

**6. Reading an unfamiliar repository**

- Finding the entry point, then the model, then the experiment loop
- Following a function you do not understand to its definition and back
- Running the smallest thing that produces output before changing anything

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Software engineering practice: testing, CI, code review, packaging your own library
- Docker, cluster scheduling, and distributed experiment orchestration
- Git beyond the everyday commands: rebasing, submodules, and history rewriting

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Clone an interpretability repository, build its environment, and reproduce one figure
- Take a failing script and locate the cause from the traceback without reading the whole codebase
- Explain what you would record so that a number you report can be regenerated in six months

## Sources to learn from

- Patrick Mineault, *The Good Research Code Handbook* — Start here. Free, short, and written for exactly this situation: a researcher who needs code to work rather than to be beautiful.
- Software Carpentry, 'The Unix Shell' and 'Version Control with Git' — Free lesson material with exercises. Do the Git one even if you have used Git.
- Scott Chacon, *Pro Git*, chapters 1-3 — Free. Read for what a commit and a branch actually are; skip the plumbing.
- Godbole, Dahl, Gilmer, Shallue & Nado, *Deep Learning Tuning Playbook*, the sections on experiment scoping and analysis — Free. How to organise a study so its results mean something, which is the part that version control and reproducibility tooling do not touch.
- The Turing Way, the reproducibility chapters — Free, and good on what recording an experiment means in practice.

## Where the curriculum uses it

[ARENA: Hands-On Technical Training](/topics/arena/).
