import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  PencilEdit02Icon,
  Eraser01Icon,
  TextIcon,
  ShapesIcon,
  ArrowRight01Icon,
  SquareIcon,
  EllipseIcon,
  TriangleIcon,
} from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'

const TOOLS = [
  { id: 'pencil', label: 'Pencil', icon: PencilEdit02Icon },
  { id: 'eraser', label: 'Eraser', icon: Eraser01Icon },
  { id: 'text', label: 'Text', icon: TextIcon },
]

const SHAPES = [
  { type: 'shape-arrow', label: 'Arrow', icon: ArrowRight01Icon },
  { type: 'shape-square', label: 'Square', icon: SquareIcon },
  { type: 'shape-ellipse', label: 'Ellipse', icon: EllipseIcon },
  { type: 'shape-triangle', label: 'Triangle', icon: TriangleIcon },
]

export default function Toolbar() {
  const activeTool = useStore((s) => s.activeTool)
  const setActiveTool = useStore((s) => s.setActiveTool)
  const addElement = useStore((s) => s.addElement)
  const [shapesOpen, setShapesOpen] = useState(false)

  return (
    <div className="toolbar-wrap">
      {shapesOpen && (
        <div className="shapes-popup">
          {SHAPES.map((s) => (
            <button
              key={s.type}
              className="toolbar-btn"
              data-tooltip={s.label}
              onClick={() => {
                addElement(s.type)
                setShapesOpen(false)
              }}
            >
              <HugeiconsIcon icon={s.icon} size={20} strokeWidth={1.6} />
            </button>
          ))}
        </div>
      )}
      <div className="toolbar">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`toolbar-btn${activeTool === t.id ? ' active' : ''}`}
            data-tooltip={t.label}
            onClick={() => {
              setShapesOpen(false)
              setActiveTool(activeTool === t.id ? 'select' : t.id)
            }}
          >
            <HugeiconsIcon icon={t.icon} size={20} strokeWidth={1.6} />
          </button>
        ))}
        <button
          className={`toolbar-btn${shapesOpen ? ' active' : ''}`}
          data-tooltip="Shapes"
          onClick={() => setShapesOpen((v) => !v)}
        >
          <HugeiconsIcon icon={ShapesIcon} size={20} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  )
}
