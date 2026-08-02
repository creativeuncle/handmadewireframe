import { useEffect, useRef } from 'react'
import { useStore } from '../lib/store'
import { useProjectsStore } from '../lib/projectsStore'

const DEBOUNCE_MS = 600

export default function AutoSave() {
  const elements = useStore((s) => s.elements)
  const strokes = useStore((s) => s.strokes)
  const pan = useStore((s) => s.pan)
  const zoom = useStore((s) => s.zoom)
  const currentProjectId = useProjectsStore((s) => s.currentProjectId)
  const autosave = useProjectsStore((s) => s.autosave)
  const timerRef = useRef(null)
  const prevProjectId = useRef(null)

  useEffect(() => {
    if (!currentProjectId) return undefined
    if (prevProjectId.current !== currentProjectId) {
      prevProjectId.current = currentProjectId
      return undefined
    }
    useProjectsStore.setState({ saveStatus: 'saving' })
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(autosave, DEBOUNCE_MS)
    return () => clearTimeout(timerRef.current)
  }, [elements, strokes, pan, zoom, currentProjectId, autosave])

  useEffect(() => {
    const flush = () => useProjectsStore.getState().autosave()
    window.addEventListener('beforeunload', flush)
    return () => window.removeEventListener('beforeunload', flush)
  }, [])

  return null
}
