import { useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  CursorMove02Icon,
  TextIcon,
  PencilEdit02Icon,
  Eraser01Icon,
  ShapesIcon,
  GridViewIcon,
  SmilePlusIcon,
  BubbleChatIcon,
} from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'
import PencilFlyout from './PencilFlyout'
import ShapesFlyout from './ShapesFlyout'
import ComponentsFlyout from './ComponentsFlyout'
import EmojiFlyout from './EmojiFlyout'

const TOOLS = [
  { id: 'select', label: 'Move', icon: CursorMove02Icon, kind: 'tool' },
  { id: 'text', label: 'Text', icon: TextIcon, kind: 'tool' },
  { id: 'pencil', label: 'Pencil', icon: PencilEdit02Icon, kind: 'tool', flyout: 'pencil' },
  { id: 'eraser', label: 'Eraser', icon: Eraser01Icon, kind: 'tool', flyout: 'eraser' },
  { id: 'shapes', label: 'Shapes', icon: ShapesIcon, kind: 'flyout', flyout: 'shapes' },
  { id: 'components', label: 'Components', icon: GridViewIcon, kind: 'flyout', flyout: 'components' },
  { id: 'emoji', label: 'Emoji', icon: SmilePlusIcon, kind: 'flyout', flyout: 'emoji' },
  { id: 'comment', label: 'Comment', icon: BubbleChatIcon, kind: 'tool' },
]

export default function IconRail() {
  const activeTool = useStore((s) => s.activeTool)
  const setActiveTool = useStore((s) => s.setActiveTool)
  const openFlyout = useStore((s) => s.openFlyout)
  const setOpenFlyout = useStore((s) => s.setOpenFlyout)
  const closeFlyout = useStore((s) => s.closeFlyout)
  const [flyoutTop, setFlyoutTop] = useState(64)
  const railRef = useRef(null)

  const handleClick = (t, e) => {
    const railRect = railRef.current.getBoundingClientRect()
    setFlyoutTop(e.currentTarget.getBoundingClientRect().top - railRect.top)

    if (t.kind === 'tool') {
      setActiveTool(activeTool === t.id ? 'select' : t.id)
      if (t.flyout) setOpenFlyout(t.flyout)
      else closeFlyout()
    } else {
      setOpenFlyout(t.flyout)
    }
  }

  return (
    <div className="icon-rail" ref={railRef}>
      {TOOLS.map((t) => (
        <button
          key={t.id}
          className={`rail-btn${(t.kind === 'tool' ? activeTool === t.id : openFlyout === t.flyout) ? ' active' : ''}`}
          data-tooltip={t.label}
          onClick={(e) => handleClick(t, e)}
        >
          <HugeiconsIcon icon={t.icon} size={20} strokeWidth={1.6} />
        </button>
      ))}

      {openFlyout === 'pencil' && <PencilFlyout mode="pencil" top={flyoutTop} />}
      {openFlyout === 'eraser' && <PencilFlyout mode="eraser" top={flyoutTop} />}
      {openFlyout === 'shapes' && <ShapesFlyout top={flyoutTop} />}
      {openFlyout === 'components' && <ComponentsFlyout top={flyoutTop} />}
      {openFlyout === 'emoji' && <EmojiFlyout top={flyoutTop} />}
    </div>
  )
}
