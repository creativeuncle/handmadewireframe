import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlusSignIcon, File02Icon, Delete02Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { useProjectsStore } from '../lib/projectsStore'

function formatRelative(ts) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  return new Date(ts).toLocaleDateString()
}

export default function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects)
  const createProject = useProjectsStore((s) => s.createProject)
  const openProject = useProjectsStore((s) => s.openProject)
  const renameProject = useProjectsStore((s) => s.renameProject)
  const deleteProject = useProjectsStore((s) => s.deleteProject)
  const [renamingId, setRenamingId] = useState(null)
  const [nameDraft, setNameDraft] = useState('')

  const list = Object.values(projects).sort((a, b) => b.updatedAt - a.updatedAt)

  const startRename = (p) => {
    setRenamingId(p.id)
    setNameDraft(p.name)
  }

  const commitRename = (id) => {
    renameProject(id, nameDraft.trim())
    setRenamingId(null)
  }

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>handmadewireframe</h1>
        <button className="new-project-btn" onClick={() => createProject('Untitled')}>
          <HugeiconsIcon icon={PlusSignIcon} size={18} strokeWidth={1.8} />
          New Project
        </button>
      </div>

      {list.length === 0 ? (
        <div className="projects-empty">
          <HugeiconsIcon icon={File02Icon} size={40} strokeWidth={1.4} />
          <p>No projects yet — create your first one.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {list.map((p) => (
            <div key={p.id} className="project-card" onClick={() => openProject(p.id)}>
              <div className="project-thumb">
                <HugeiconsIcon icon={File02Icon} size={32} strokeWidth={1.3} />
              </div>
              <div className="project-card-footer">
                {renamingId === p.id ? (
                  <input
                    autoFocus
                    className="project-name-input"
                    value={nameDraft}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onBlur={() => commitRename(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.currentTarget.blur()
                      if (e.key === 'Escape') setRenamingId(null)
                    }}
                  />
                ) : (
                  <span className="project-name">{p.name}</span>
                )}
                <span className="project-updated">Edited {formatRelative(p.updatedAt)}</span>
              </div>
              <div className="project-card-actions">
                <button
                  data-tooltip="Rename"
                  onClick={(e) => {
                    e.stopPropagation()
                    startRename(p)
                  }}
                >
                  <HugeiconsIcon icon={PencilEdit02Icon} size={16} strokeWidth={1.6} />
                </button>
                <button
                  data-tooltip="Delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteProject(p.id)
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.6} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
