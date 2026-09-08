---
title: "Arrays and Numerical Python"
description: "NumPy arrays as the data structure everything numerical uses: shape and dtype, indexing and masks, broadcasting, axis-wise reductions, and vectorized thinking instead of loops."
order: 2
status: placeholder
prerequisites:
  - title: "Python Fundamentals"
    url: "/topics/python-fundamentals/"
---

## Why this article exists

A PyTorch tensor is a NumPy array with a device and a gradient attached, so every shape error, broadcasting surprise, and axis argument you will meet in interpretability code is learnable here first, in a setting where nothing else is going on.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. Arrays**

- Creating arrays, and the shape and dtype attributes that describe them
- Why a homogeneous typed array is fast and a list of numbers is not
- Reshaping, transposing, and the difference between a view and a copy

**2. Indexing**

- Basic slicing on multiple axes, and what `:` means in each position
- Integer and fancy indexing
- Boolean masks, and selecting the positions where a condition holds

**3. Broadcasting**

- The alignment rules stated exactly, then applied to three worked cases
- A silent broadcast that produces a wrong answer with no error
- The habit of asserting shapes, and of naming axes in comments

**4. Reductions along an axis**

- `sum`, `mean`, `max`, and `argmax`, with the `axis` argument explained by which axis disappears
- `keepdims`, and why it exists
- Softmax over a chosen axis, written out as the running example

**5. Vectorized thinking**

- Replacing a loop with an array operation, with a timing comparison
- When a loop is actually fine, since clarity sometimes wins
- Random number generation, seeds, and reproducible arrays

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- pandas, dataframes, and tabular data wrangling
- SciPy's numerical routines, sparse matrices, and optimizers
- Writing performant numerical kernels, memory layout, and strides beyond views versus copies

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Predict the output shape of a broadcast operation before running it
- Compute a softmax over a chosen axis with `keepdims` and verify the rows sum to one
- Take an array of shape `[batch, position, features]` and reduce it three different ways, saying which axis went

## Sources to learn from

- The official NumPy 'Absolute Beginners' guide, then 'NumPy Fundamentals' — Free, current, and the fastest path to competence. Do the examples in a notebook rather than reading them.
- Jake VanderPlas, *Python Data Science Handbook*, chapter 2 — Free online. The best written treatment of indexing, broadcasting, and vectorization.
- Nicolas Rougier, *From Python to NumPy* — Free. Read it for the shift from loop-thinking to array-thinking, which is the actual skill.
- The NumPy broadcasting documentation — Two pages. Read them exactly rather than inferring the rules from behavior.

## Where the curriculum uses it

[GPUs, Memory, and Numerical Precision](/topics/gpus-memory-and-precision/), [Plotting and Visualizing Results](/topics/plotting-and-visualizing-results/), [Tensors, Shapes, and Einsum Notation](/topics/tensors-and-einsum-notation/).
