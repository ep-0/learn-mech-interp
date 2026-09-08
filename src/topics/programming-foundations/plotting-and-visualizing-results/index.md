---
title: "Plotting and Visualizing Results"
description: "Producing the figures this field argues with: line plots across layers, heatmaps of attention and activation, scatter plots of learned directions, and the labeling and uncertainty that make a figure a claim."
order: 4
status: placeholder
prerequisites:
  - title: "Arrays and Numerical Python"
    url: "/topics/arrays-and-numerical-python/"
---

## Why this article exists

Interpretability results are figures. An attention pattern, a logit lens heatmap, a sparsity-fidelity frontier, and a per-head attribution bar chart are how findings are stated, checked, and disputed, so producing and reading them accurately is a research skill rather than a presentational one.

## Required sections

The finished article must cover the following, in this order. Headings can be reworded; the content cannot be dropped.

**1. The plotting stack**

- matplotlib as the default, and where plotly earns its place through interactivity
- Figure, axes, and the object-oriented interface, rather than the stateful one
- Saving a figure at a resolution that survives being looked at closely

**2. The plot types this field uses**

- Line plots across layers or training steps, which is most interpretability results
- Heatmaps for attention patterns and for layer-by-position quantities, including the colormap choice
- Scatter plots for two-dimensional projections of activations
- Bar charts for per-component attribution, sorted rather than in index order

**3. Making a figure say something true**

- Axis labels, units, and a title that states the claim
- Error bars and confidence bands, and the choice not to plot a single run
- Diverging colormaps centered at zero for signed quantities, and why a rainbow map misleads
- Log scales, and when the data demands one

**4. Reading a figure critically**

- Checking the axis range before believing a gap
- Asking what is averaged over, and what a single line is hiding
- Projections such as t-SNE and UMAP, and the conclusions their plots do not support

**5. Interactive tools in this field**

- Attention visualization widgets, and what they are showing per head
- Feature dashboards as a plotting problem, previewed
- When an interactive view finds something a static plot would have hidden

## Deliberately out of scope

A standard course covers these. This one does not, because nothing downstream needs them.

- Publication typesetting, journal style requirements, and figure composition for papers
- Dashboard frameworks and web visualization libraries such as D3
- Statistical graphics theory beyond the choices listed above

## What you should be able to do afterward

If any of these is still out of reach, the article is not finished.

- Plot a quantity across all layers of a model with a labeled axis and an error band
- Produce a correctly oriented, correctly labeled attention heatmap for one head
- Look at a published interpretability figure and name one thing its axes are hiding

## Sources to learn from

- The matplotlib 'Quick start' and 'Artist tutorial' — Free. Learn the object-oriented interface first; the stateful one causes trouble later.
- Nicolas Rougier, *Scientific Visualization: Python + Matplotlib* — Free book. Read the chapters on figure anatomy and on colormaps.
- Claus Wilke, *Fundamentals of Data Visualization* — Free online. Not about code: it is about which figure is honest. Read the colormap and uncertainty chapters.
- Wattenberg, Viégas & Johnson, 'How to Use t-SNE Effectively' (Distill, 2016) — Interactive, and the fastest inoculation against over-reading a projection.

## Where the curriculum uses it

[Intrinsic Dimension and Dimensionality Reduction](/topics/intrinsic-dimension-and-dimensionality-reduction/), [Reading the Attention Patterns](/topics/reading-attention-patterns/).
