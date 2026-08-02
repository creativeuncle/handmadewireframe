# handmadewireframe

A simple, canvas-based, hand-drawn wireframing tool (FigJam-style) built for personal use, expanding step by step.

## Stack

- React + Vite
- [roughjs](https://roughjs.com/) for the sketchy/hand-drawn look
- [zustand](https://github.com/pmndrs/zustand) for state

## Getting started

```bash
npm install
npm run dev
```

## Current features (MVP)

- Left sidebar: component palette (Button, Card, Input, Tabs, Image, Slider, Heading, Video) — click to drop onto the canvas
- Canvas: select, drag, resize, and inline-edit sketchy components
- Bottom toolbar: Pencil, Eraser, and Text tools with freehand drawing/erasing
- Right sidebar: context-sensitive properties — stroke/eraser size for drawing tools, and font family (Google Fonts), size, weight, line height, letter spacing, and alignment for text
