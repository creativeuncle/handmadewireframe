import { useStore } from '../lib/store'

const TOOLS = [
  { id: 'pencil', label: 'Pencil', icon: '✎' },
  { id: 'eraser', label: 'Eraser', icon: '⌫' },
  { id: 'text', label: 'Text', icon: 'Aa' },
]

export default function Toolbar() {
  const activeTool = useStore((s) => s.activeTool)
  const setActiveTool = useStore((s) => s.setActiveTool)

  return (
    <div className="toolbar">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          className={`toolbar-btn${activeTool === t.id ? ' active' : ''}`}
          title={t.label}
          onClick={() => setActiveTool(activeTool === t.id ? 'select' : t.id)}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}
