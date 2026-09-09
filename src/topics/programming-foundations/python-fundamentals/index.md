---
title: "Python Fundamentals"
description: "The subset of Python that interpretability code is written in: values and types, control flow, functions, the four core collections, comprehensions, and enough class syntax to read a library."
order: 1
status: placeholder
prerequisites: []
---

## Why this article exists

Every tool in this curriculum is a Python library, every paper's code release is a Python repository, and the exercises that turn reading into understanding are Python notebooks. This page is the bottom of the programming chain, the way notation is the bottom of the mathematical one: it assumes you have never written a line of code.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Running code at all**

- The interpreter, a script, and a notebook cell, and when each is the right one
- Printing, and reading an error message from the bottom line upward
- Variables, assignment, and why a name is a label rather than a box

**2. Values and types**

- Integers, floats, strings, booleans, and `None`
- Type conversion, and the errors that come from forgetting it
- f-strings for readable output, since every experiment prints results

**3. Collections**

- Lists, tuples, dictionaries, and sets, with the question each one answers
- Indexing and slicing, including negative indices and the half-open convention
- Mutability, and the aliasing bug that follows from missing it

**4. Control flow and functions**

- `if`, `for`, `while`, and iterating over a collection directly rather than by index
- Defining functions, arguments, defaults, and return values
- Scope, and why a function modifying a global is a bug waiting to happen

**5. Comprehensions and idiom**

- List and dict comprehensions, read as a loop turned inside out
- `enumerate`, `zip`, and `range`, which appear in nearly every research script
- `import`, modules, and where a library's name comes from

**6. Reading classes**

- Just enough syntax to read a class: `__init__`, `self`, attributes, methods
- Why `model.forward(x)` and `model(x)` do the same thing
- Writing a class is not required here; reading one is

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Object-oriented design, inheritance hierarchies, and when to write a class
- Decorators, generators, context managers, metaclasses, and async
- Packaging, type checking, and testing frameworks
- Data structures and algorithms as a subject: sorting, recursion, complexity analysis

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Write a function that loops over a list of prompts and collects results into a dictionary
- Read a traceback and name the file, line, and cause
- Open an unfamiliar library's source file and follow what a class's method does

## Sources to learn from

- Al Sweigart, *Automate the Boring Stuff with Python*, chapters 1-6 — Start here. Free online, and the gentlest start if you have never programmed. Stop after functions and lists; the automation chapters are not needed.
- Allen Downey, *Think Python* (2nd edition) — Free, and better than Sweigart if you want the reasoning rather than the recipes.
- The official Python Tutorial, sections 3-5 and 9 — The reference version, worth reading once the basics are in place. Section 9 is the class syntax you need for reading libraries.
- Exercism's Python track, or the problem sets from whichever course above you choose — Free, with mentor solutions. Reading Python and writing Python are different skills and only the second one transfers to a research codebase.
- MIT 6.100L or Berkeley CS61A, the first few weeks — Free full courses. Use one of these if you would rather be taught than read, and stop once functions and collections are comfortable.

## Where the curriculum uses it

[Arrays and Numerical Python](/topics/arrays-and-numerical-python/), [Reading and Running Research Code](/topics/working-with-research-code/).
