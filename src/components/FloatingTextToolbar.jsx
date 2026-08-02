import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  TextBoldIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  ListViewIcon,
  Link01Icon,
  TextColorIcon,
  HighlighterIcon,
} from '@hugeicons/core-free-icons'
import { GOOGLE_FONTS, STROKE_COLORS, useStore } from '../lib/store'

const HIGHLIGHT_COLORS = ['#fff3a3', '#b2f2bb', '#a5d8ff', '#ffc9c9', '#e5dbff']

export default function FloatingTextToolbar() {
  const selectedIds = useStore((s) => s.selectedIds)
  const elements = useStore((s) => s.elements)
  const activeTool = useStore((s) => s.activeTool)
  const pan = useStore((s) => s.pan)
  const zoom = useStore((s) => s.zoom)
  const updateElement = useStore((s) => s.updateElement)
  const [openPopover, setOpenPopover] = useState(null)
  const [linkDraft, setLinkDraft] = useState('')

  if (activeTool !== 'select' || selectedIds.length !== 1) return null
  const el = elements.find((it) => it.id === selectedIds[0])
  if (!el || el.locked || el.type !== 'text') return null

  const left = pan.x + el.x * zoom + (el.width * zoom) / 2
  const top = pan.y + el.y * zoom - 52

  const onChange = (patch) => updateElement(el.id, patch)
  const togglePopover = (name) => setOpenPopover((p) => (p === name ? null : name))

  return (
    <div className="floating-text-toolbar" style={{ left, top }}>
      <select value={el.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })}>
        {GOOGLE_FONTS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>
            {f}
          </option>
        ))}
      </select>

      <input
        type="number"
        className="font-size-input"
        min={8}
        max={200}
        value={el.fontSize}
        onChange={(e) => onChange({ fontSize: Math.max(8, Math.min(200, Number(e.target.value) || 8)) })}
      />

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

      <div className="ftt-divider" />

      <button
        className={`ftt-btn${el.list ? ' active' : ''}`}
        data-tooltip="List"
        onClick={() => onChange({ list: !el.list })}
      >
        <HugeiconsIcon icon={ListViewIcon} size={16} strokeWidth={1.8} />
      </button>

      <div className="ftt-popover-wrap">
        <button
          className={`ftt-btn${el.link ? ' active' : ''}`}
          data-tooltip="Link"
          onClick={() => {
            setLinkDraft(el.link ?? '')
            togglePopover('link')
          }}
        >
          <HugeiconsIcon icon={Link01Icon} size={16} strokeWidth={1.8} />
        </button>
        {openPopover === 'link' && (
          <div className="ftt-popover ftt-link-popover">
            <input
              autoFocus
              type="text"
              placeholder="https://example.com"
              value={linkDraft}
              onChange={(e) => setLinkDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onChange({ link: linkDraft.trim() || null })
                  setOpenPopover(null)
                }
              }}
            />
            <button
              onClick={() => {
                onChange({ link: linkDraft.trim() || null })
                setOpenPopover(null)
              }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="ftt-popover-wrap">
        <button className="ftt-btn" data-tooltip="Text color" onClick={() => togglePopover('color')}>
          <HugeiconsIcon icon={TextColorIcon} size={16} strokeWidth={1.8} />
        </button>
        {openPopover === 'color' && (
          <div className="ftt-popover color-grid">
            {STROKE_COLORS.map((c) => (
              <button
                key={c}
                className={`color-swatch${el.color === c ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => {
                  onChange({ color: c })
                  setOpenPopover(null)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="ftt-popover-wrap">
        <button
          className={`ftt-btn${el.highlight ? ' active' : ''}`}
          data-tooltip="Highlight"
          onClick={() => togglePopover('highlight')}
        >
          <HugeiconsIcon icon={HighlighterIcon} size={16} strokeWidth={1.8} />
        </button>
        {openPopover === 'highlight' && (
          <div className="ftt-popover color-grid">
            <button
              className={`color-swatch color-swatch-none${!el.highlight ? ' active' : ''}`}
              onClick={() => {
                onChange({ highlight: null })
                setOpenPopover(null)
              }}
            />
            {HIGHLIGHT_COLORS.map((c) => (
              <button
                key={c}
                className={`color-swatch${el.highlight === c ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => {
                  onChange({ highlight: c })
                  setOpenPopover(null)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
