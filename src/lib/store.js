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
  image: { width: 200, height: 140, text: 'Image' },
  video: { width: 240, height: 140, text: 'Video' },
  input: { width: 220, height: 44, text: 'Input field' },
  navbar: { width: 480, height: 56, text: 'Logo      Home    About    Contact' },
  header: { width: 480, height: 70, text: 'Header' },
  hero: { width: 480, height: 260, text: 'Hero Section' },
  sidebar: { width: 200, height: 400, text: 'Sidebar' },
  footer: { width: 480, height: 80, text: 'Footer' },
  heading: { width: 240, height: 44, text: 'Heading' },
  subheading: { width: 220, height: 34, text: 'Sub heading' },
  searchbar: { width: 240, height: 44, text: 'Search...' },
  popup: { width: 260, height: 180, text: 'Popup' },
  breadcrumbs: { width: 260, height: 28, text: 'Home / Category / Page' },
  pagination: { width: 220, height: 40, text: '1   2   3   4   5' },
  paragraph: { width: 260, height: 90, text: 'Paragraph text goes here. Lorem ipsum dolor sit amet.' },
  text: { width: 160, height: 32, text: 'Text' },
}

const MIN_ZOOM = 0.2
const MAX_ZOOM = 4
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

export const useStore = create((set, get) => ({
  elements: [],
  selectedId: null,
  activeTool: 'select', // select | pencil | eraser | text
  strokeWidth: 3,
  eraserSize: 24,
  strokes: [],
  pan: { x: 0, y: 0 },
  zoom: 1,

  addElement: (type, pos) => {
    const defaults = COMPONENT_DEFAULTS[type] ?? COMPONENT_DEFAULTS.text
    const id = nextId()
    const count = get().elements.length
    const cascade = (count % 8) * 24
    const el = {
      id,
      type,
      x: pos?.x ?? 340 + cascade,
      y: pos?.y ?? 120 + cascade,
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

  panBy: (dx, dy) => set((s) => ({ pan: { x: s.pan.x + dx, y: s.pan.y + dy } })),

  zoomAtPoint: (factor, point) =>
    set((s) => {
      const newZoom = clamp(s.zoom * factor, MIN_ZOOM, MAX_ZOOM)
      const contentX = (point.x - s.pan.x) / s.zoom
      const contentY = (point.y - s.pan.y) / s.zoom
      return {
        zoom: newZoom,
        pan: { x: point.x - contentX * newZoom, y: point.y - contentY * newZoom },
      }
    }),

  resetView: () => set({ pan: { x: 0, y: 0 }, zoom: 1 }),
}))
