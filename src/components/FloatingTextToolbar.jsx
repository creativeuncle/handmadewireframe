import { HugeiconsIcon } from '@hugeicons/react'
import {
  TextBoldIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
} from '@hugeicons/core-free-icons'
import { GOOGLE_FONTS, useStore } from '../lib/store'

export default function FloatingTextToolbar() {
  const selectedIds = useStore((s) => s.selectedIds)
  const elements = useStore((s) => s.elements)
  const activeTool = useStore((s) => s.activeTool)
  const pan = useStore((s) => s.pan)
  const zoom = useStore((s) => s.zoom)
  const updateElement = useStore((s) => s.updateElement)

  if (activeTool !== 'select' || selectedIds.length !== 1) return null
  const el = elements.find((it) => it.id === selectedIds[0])
  if (!el || el.locked) return null

  const left = pan.x + el.x * zoom + (el.width * zoom) / 2
  const top = pan.y + el.y * zoom - 52

  const onChange = (patch) => updateElement(el.id, patch)

  return (
    <div className="floating-text-toolbar" style={{ left, top }}>
      <select value={el.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })}>
        {GOOGLE_FONTS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>
            {f}
          </option>
        ))}
      </select>

      <div className="font-size-stepper">
        <span>{el.fontSize}</span>
        <div className="stepper-arrows">
          <button onClick={() => onChange({ fontSize: Math.min(96, el.fontSize + 1) })}>
            <HugeiconsIcon icon={ArrowUp01Icon} size={11} strokeWidth={2} />
          </button>
          <button onClick={() => onChange({ fontSize: Math.max(8, el.fontSize - 1) })}>
            <HugeiconsIcon icon={ArrowDown01Icon} size={11} strokeWidth={2} />
          </button>
        </div>
      </div>

      <button
        className={`ftt-btn${el.fontWeight >= 700 ? ' active' : ''}`}
        data-tooltip="Bold"
        onClick={() => onChange({ fontWeight: el.fontWeight >= 700 ? 400 : 700 })}
      >
        <HugeiconsIcon icon={TextBoldIcon} size={16} strokeWidth={1.8} />
      </button>

      <div className="ftt-divider" />

      {[
        { a: 'left', icon: TextAlignLeftIcon },
        { a: 'center', icon: TextAlignCenterIcon },
        { a: 'right', icon: TextAlignRightIcon },
      ].map(({ a, icon }) => (
        <button
          key={a}
          className={`ftt-btn${el.align === a ? ' active' : ''}`}
          data-tooltip={`Align ${a}`}
          onClick={() => onChange({ align: a })}
        >
          <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} />
        </button>
      ))}
    </div>
  )
}
