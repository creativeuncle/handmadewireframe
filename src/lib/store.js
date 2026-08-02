import { create } from 'zustand'

let idCounter = 1
const nextId = () => `el_${idCounter++}`

export const GOOGLE_FONTS = [
  'Kalam',
  'Caveat',
  'Patrick Hand',
  'Architects Daughter',
  'Indie Flower',
  'Shadows Into Light',
  'Inter',
]

const COMPONENT_DEFAULTS = {
  button: { width: 140, height: 48, text: 'Button' },
  card: { width: 220, height: 160, text: 'Card' },
  input: { width: 200, height: 44, text: 'Input text' },
  tabs: { width: 260, height: 48, text: 'Tab 1   Tab 2' },
  image: { width: 200, height: 140, text: 'Image' },
  slider: { width: 220, height: 40, text: '' },
  heading: { width: 220, height: 44, text: 'Heading' },
  video: { width: 240, height: 140, text: 'Video' },
  text: { width: 160, height: 32, text: 'Text' },
}

export const useStore = create((set, get) => ({
  elements: [],
  selectedId: null,
  activeTool: 'select', // select | pencil | eraser | text
  strokeWidth: 3,
  eraserSize: 24,
  strokes: [],

  addElement: (type, pos) => {
    const defaults = COMPONENT_DEFAULTS[type] ?? COMPONENT_DEFAULTS.text
    const id = nextId()
    const count = get().elements.length
    const cascade = (count % 8) * 24
    const el = {
      id,
      type,
      x: pos?.x ?? 100 + cascade,
      y: pos?.y ?? 100 + cascade,
      width: defaults.width,
      height: defaults.height,
      text: defaults.text,
      seed: Math.floor(Math.random() * 2000),
      fontFamily: 'Kalam',
      fontSize: 16,
      lineHeight: 1.4,
      letterSpacing: 0,
      fontWeight: 400,
      align: 'center',
    }
    set((s) => ({ elements: [...s.elements, el], selectedId: id, activeTool: 'select' }))
    return id
  },

  updateElement: (id, patch) =>
    set((s) => ({
      elements: s.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    })),

  deleteElement: (id) =>
    set((s) => ({
      elements: s.elements.filter((el) => el.id !== id),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  selectElement: (id) => set({ selectedId: id }),

  setActiveTool: (tool) =>
    set((s) => ({ activeTool: tool, selectedId: tool === 'select' ? s.selectedId : null })),

  setStrokeWidth: (v) => set({ strokeWidth: v }),
  setEraserSize: (v) => set({ eraserSize: v }),

  addStroke: (stroke) => set((s) => ({ strokes: [...s.strokes, stroke] })),
  clearStrokes: () => set({ strokes: [] }),
}))
