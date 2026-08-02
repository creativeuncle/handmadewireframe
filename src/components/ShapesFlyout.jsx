import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, SquareIcon, EllipseIcon, TriangleIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'

const SHAPES = [
  { type: 'shape-arrow', label: 'Arrow', icon: ArrowRight01Icon },
  { type: 'shape-square', label: 'Square', icon: SquareIcon },
  { type: 'shape-ellipse', label: 'Ellipse', icon: EllipseIcon },
  { type: 'shape-triangle', label: 'Triangle', icon: TriangleIcon },
]

export default function ShapesFlyout({ top }) {
  const addElement = useStore((s) => s.addElement)
  const closeFlyout = useStore((s) => s.closeFlyout)

  return (
    <div className="flyout-panel shapes-flyout" style={{ top }}>
      {SHAPES.map((s) => (
        <button
          key={s.type}
          className="rail-btn"
          data-tooltip={s.label}
          onClick={() => {
            addElement(s.type)
            closeFlyout()
          }}
        >
          <HugeiconsIcon icon={s.icon} size={20} strokeWidth={1.6} />
        </button>
      ))}
    </div>
  )
}
