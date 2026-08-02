import { create } from 'zustand'

let idCounter = 1
const nextId = () => `el_${idCounter++}`

export const GOOGLE_FONTS = [
  'Patrick Hand',
  'Kalam',
  'Caveat',
  'Architects Daughter',
  'Indie Flower',
  'Shadows Into Light',
  'Inter',
]

export const STROKE_COLORS = [
  '#1a1a1a',
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#9c36b5',
  '#495057',
  '#ffffff',
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
  'shape-arrow': { width: 160, height: 60, text: '' },
  'shape-square': { width: 120, height: 120, text: '' },
  'shape-ellipse': { width: 140, height: 100, text: '' },
  'shape-triangle': { width: 130, height: 110, text: '' },
  emoji: { width: 64, height: 64, text: '😀' },
  comment: { width: 200, height: 64, text: 'Comment' },
}

const MIN_ZOOM = 0.2
const MAX_ZOOM = 4
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))
const MAX_HISTORY = 50

export const useStore = create((set, get) => ({
  elements: [],
  selectedIds: [],
  activeTool: 'select', // select | pencil | eraser | text | comment
  strokeWidth: 3,
  strokeColor: '#1a1a1a',
  eraserSize: 24,
  strokes: [],
  pan: { x: 0, y: 0 },
  zoom: 1,
  openFlyout: null,
  history: [],
  clipboard: [],

  pushHistory: () =>
    set((s) => ({ history: [...s.history.slice(-MAX_HISTORY + 1), s.elements] })),

  undo: () =>
    set((s) => {
      if (s.history.length === 0) return s
      const prev = s.history[s.history.length - 1]
      return { elements: prev, history: s.history.slice(0, -1), selectedIds: [] }
    }),

  addElement: (type, pos, extra) => {
    get().pushHistory()
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
      fontFamily: 'Patrick Hand',
      fontSize: 16,
      lineHeight: 1.4,
      letterSpacing: 0,
      fontWeight: 400,
      align: 'center',
      locked: false,
      ...extra,
    }
    set((s) => ({ elements: [...s.elements, el], selectedIds: [id], activeTool: 'select' }))
    return id
  },

  updateElement: (id, patch, { skipHistory } = {}) => {
    if (!skipHistory) get().pushHistory()
    set((s) => ({
      elements: s.elements.map((el) => (el.id === id ? { ...el, ...patch } : el)),
    }))
  },

  moveSelectionBy: (dx, dy) =>
    set((s) => ({
      elements: s.elements.map((el) =>
        s.selectedIds.includes(el.id) ? { ...el, x: el.x + dx, y: el.y + dy } : el,
      ),
    })),

  deleteElement: (id) => {
    get().pushHistory()
    set((s) => ({
      elements: s.elements.filter((el) => el.id !== id),
      selectedIds: s.selectedIds.filter((sid) => sid !== id),
    }))
  },

  deleteSelection: () => {
    const { selectedIds } = get()
    if (selectedIds.length === 0) return
    get().pushHistory()
    set((s) => ({
      elements: s.elements.filter((el) => !s.selectedIds.includes(el.id)),
      selectedIds: [],
    }))
  },

  toggleLock: (id) =>
    set((s) => ({
      elements: s.elements.map((el) => (el.id === id ? { ...el, locked: !el.locked } : el)),
    })),

  moveLayerUp: (id) =>
    set((s) => {
      const i = s.elements.findIndex((el) => el.id === id)
      if (i < 0 || i === s.elements.length - 1) return s
      const elements = [...s.elements]
      ;[elements[i], elements[i + 1]] = [elements[i + 1], elements[i]]
      return { elements }
    }),

  moveLayerDown: (id) =>
    set((s) => {
      const i = s.elements.findIndex((el) => el.id === id)
      if (i <= 0) return s
      const elements = [...s.elements]
      ;[elements[i], elements[i - 1]] = [elements[i - 1], elements[i]]
      return { elements }
    }),

  selectElement: (id) => set({ selectedIds: id ? [id] : [] }),
  selectMultiple: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  copySelection: () =>
    set((s) => ({
      clipboard: s.elements.filter((el) => s.selectedIds.includes(el.id)).map((el) => ({ ...el })),
    })),

  pasteClipboard: () => {
    const { clipboard } = get()
    if (clipboard.length === 0) return
    get().pushHistory()
    const newIds = []
    const pasted = clipboard.map((el) => {
      const id = nextId()
      newIds.push(id)
      return { ...el, id, x: el.x + 24, y: el.y + 24 }
    })
    set((s) => ({ elements: [...s.elements, ...pasted], selectedIds: newIds }))
  },

  setActiveTool: (tool) =>
    set((s) => ({ activeTool: tool, selectedIds: tool === 'select' ? s.selectedIds : [] })),

  setStrokeWidth: (v) => set({ strokeWidth: v }),
  setStrokeColor: (v) => set({ strokeColor: v }),
  setEraserSize: (v) => set({ eraserSize: v }),

  addStroke: (stroke) => set((s) => ({ strokes: [...s.strokes, stroke] })),
  clearStrokes: () => set({ strokes: [] }),

  setOpenFlyout: (name) => set((s) => ({ openFlyout: s.openFlyout === name ? null : name })),
  closeFlyout: () => set({ openFlyout: null }),

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
