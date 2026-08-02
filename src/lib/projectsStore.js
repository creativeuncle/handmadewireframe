import { create } from 'zustand'
import { useStore } from './store'

const STORAGE_KEY = 'hwf-projects-v1'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAll(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  } catch {
    // storage unavailable or full — autosave silently no-ops
  }
}

const emptyDoc = () => ({ elements: [], strokes: [], pan: { x: 0, y: 0 }, zoom: 1 })

let projectIdCounter = 1
const nextProjectId = () => `proj_${Date.now()}_${projectIdCounter++}`

export const useProjectsStore = create((set, get) => ({
  view: 'projects', // 'projects' | 'editor'
  projects: loadAll(),
  currentProjectId: null,
  saveStatus: 'saved', // 'saved' | 'saving'

  createProject: (name) => {
    const id = nextProjectId()
    const now = Date.now()
    const project = { id, name: name || 'Untitled', createdAt: now, updatedAt: now, doc: emptyDoc() }
    set((s) => {
      const projects = { ...s.projects, [id]: project }
      saveAll(projects)
      return { projects }
    })
    get().openProject(id)
  },

  openProject: (id) => {
    const project = get().projects[id]
    if (!project) return
    const doc = project.doc ?? emptyDoc()
    useStore.setState({
      elements: doc.elements ?? [],
      strokes: doc.strokes ?? [],
      pan: doc.pan ?? { x: 0, y: 0 },
      zoom: doc.zoom ?? 1,
      selectedIds: [],
      activeTool: 'select',
      history: [],
    })
    set({ currentProjectId: id, view: 'editor', saveStatus: 'saved' })
  },

  backToProjects: () => {
    get().autosave()
    set({ view: 'projects', currentProjectId: null })
  },

  renameProject: (id, name) =>
    set((s) => {
      if (!s.projects[id]) return s
      const projects = { ...s.projects, [id]: { ...s.projects[id], name: name || 'Untitled', updatedAt: Date.now() } }
      saveAll(projects)
      return { projects }
    }),

  deleteProject: (id) =>
    set((s) => {
      const projects = { ...s.projects }
      delete projects[id]
      saveAll(projects)
      return {
        projects,
        ...(s.currentProjectId === id ? { view: 'projects', currentProjectId: null } : {}),
      }
    }),

  autosave: () => {
    const { currentProjectId, projects } = get()
    if (!currentProjectId || !projects[currentProjectId]) return
    const { elements, strokes, pan, zoom } = useStore.getState()
    set((s) => {
      const existing = s.projects[currentProjectId]
      const updated = {
        ...s.projects,
        [currentProjectId]: { ...existing, doc: { elements, strokes, pan, zoom }, updatedAt: Date.now() },
      }
      saveAll(updated)
      return { projects: updated, saveStatus: 'saved' }
    })
  },
}))
