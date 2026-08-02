import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, SquareIcon, EllipseIcon, TriangleIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'

const SHAPES = [
  { type: 'shape-arrow', label: 'Arrow', icon: ArrowRight01Icon },
  { type: 'shape-square', label: 'Square', icon: SquareIcon },
  { type: 'shape-ellipse', label: 'Ellipse', icon: EllipseIcon },
  { type: 'shape-triangle', label: 'Triangle', icon: TriangleIcon },
]

export default function ShapesFlyout() {
  const addElement = useStore((s) => s.addElement)

  return (
    <div className="flyout-panel components-flyout full-height">
      <div className="component-grid">
        {SHAPES.map((s) => (
          <button key={s.type} className="component-btn" onClick={() => addElement(s.type)}>
            <span className="component-icon-box">
              <HugeiconsIcon icon={s.icon} size={20} strokeWidth={1.6} />
            </span>
            <span className="component-label">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
