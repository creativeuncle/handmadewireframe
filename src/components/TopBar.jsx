import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft01Icon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons'
import { useProjectsStore } from '../lib/projectsStore'

export default function TopBar() {
  const currentProjectId = useProjectsStore((s) => s.currentProjectId)
  const project = useProjectsStore((s) => s.projects[s.currentProjectId])
  const renameProject = useProjectsStore((s) => s.renameProject)
  const backToProjects = useProjectsStore((s) => s.backToProjects)
  const saveStatus = useProjectsStore((s) => s.saveStatus)
  const [editing, setEditing] = useState(false)
  const [nameDraft, setNameDraft] = useState('')

  if (!project) return null

  const startRename = () => {
    setNameDraft(project.name)
    setEditing(true)
  }

  const commitRename = () => {
    renameProject(currentProjectId, nameDraft.trim())
    setEditing(false)
  }

  return (
    <div className="top-bar">
      <button className="top-bar-back" data-tooltip="Back to projects" onClick={backToProjects}>
        <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.8} />
      </button>

      {editing ? (
        <input
          autoFocus
          className="top-bar-name-input"
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
            if (e.key === 'Escape') setEditing(false)
          }}
        />
      ) : (
        <span className="top-bar-name" onDoubleClick={startRename}>
          {project.name}
        </span>
      )}

      <span className={`save-status${saveStatus === 'saving' ? ' saving' : ''}`}>
        {saveStatus === 'saving' ? (
          'Saving…'
        ) : (
          <>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} strokeWidth={1.8} />
            Saved
          </>
        )}
      </span>
    </div>
  )
}
