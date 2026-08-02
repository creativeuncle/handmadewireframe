import { useRef, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { BubbleChatIcon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'
import SketchyRect from './SketchyRect'

const SHAPE_KIND = { 'shape-ellipse': 'ellipse', 'shape-triangle': 'triangle', 'shape-arrow': 'arrow' }

export default function CanvasElement({ el }) {
  const updateElement = useStore((s) => s.updateElement)
  const selectElement = useStore((s) => s.selectElement)
  const moveSelectionBy = useStore((s) => s.moveSelectionBy)
  const selectedIds = useStore((s) => s.selectedIds)
  const activeTool = useStore((s) => s.activeTool)
  const textRef = useRef(null)
  const [editing, setEditing] = useState(false)

  const isSelected = selectedIds.includes(el.id)
  const canInteract = activeTool === 'select' && !el.locked

  const onPointerDown = (e) => {
    if (!canInteract || editing) return
    e.stopPropagation()

    const alreadyInSelection = selectedIds.includes(el.id)
    if (!alreadyInSelection) selectElement(el.id)
    useStore.getState().pushHistory()

    const zoom = useStore.getState().zoom
    const start = { startX: e.clientX, startY: e.clientY, lastX: e.clientX, lastY: e.clientY }
    const onMove = (ev) => {
      const dx = (ev.clientX - start.lastX) / zoom
      const dy = (ev.clientY - start.lastY) / zoom
      start.lastX = ev.clientX
      start.lastY = ev.clientY
      if (alreadyInSelection && selectedIds.length > 1) {
        moveSelectionBy(dx, dy)
      } else {
        const current = useStore.getState().elements.find((it) => it.id === el.id)
        updateElement(el.id, { x: current.x + dx, y: current.y + dy }, { skipHistory: true })
      }
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onDoubleClick = (e) => {
    if (!canInteract) return
    e.stopPropagation()
    setEditing(true)
    requestAnimationFrame(() => {
      textRef.current?.focus()
      document.getSelection()?.selectAllChildren(textRef.current)
    })
  }

  const onResizePointerDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
    useStore.getState().pushHistory()
    const zoom = useStore.getState().zoom
    const start = { startX: e.clientX, startY: e.clientY, w: el.width, h: el.height }
    const onMove = (ev) => {
      const dx = (ev.clientX - start.startX) / zoom
      const dy = (ev.clientY - start.startY) / zoom
      updateElement(
        el.id,
        { width: Math.max(40, start.w + dx), height: Math.max(28, start.h + dy) },
        { skipHistory: true },
      )
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const shapeKind = SHAPE_KIND[el.type]
  const isPolygon = shapeKind === 'triangle' || shapeKind === 'arrow'
  const isEmoji = el.type === 'emoji'
  const isComment = el.type === 'comment'
  const borderColor = isSelected ? '#2563eb' : '#1a1a1a'

  return (
    <div
      className={`canvas-el${isSelected ? ' selected' : ''}${el.locked ? ' locked' : ''}`}
      style={{
        position: 'absolute',
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        cursor: canInteract ? (editing ? 'text' : 'move') : 'default',
        pointerEvents: activeTool === 'select' && el.locked ? 'none' : undefined,
        border: isPolygon || isEmoji ? 'none' : `2px solid ${borderColor}`,
        borderRadius: shapeKind === 'ellipse' ? '50%' : 8,
        background: isEmoji ? 'transparent' : isComment ? '#fff7cc' : '#fff',
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      {isPolygon && (
        <SketchyRect width={el.width} height={el.height} shape={shapeKind} color={borderColor} />
      )}
      {isComment && (
        <div className="comment-icon">
          <HugeiconsIcon icon={BubbleChatIcon} size={14} strokeWidth={1.8} />
        </div>
      )}
      <div
        ref={textRef}
        className="canvas-el-label"
        contentEditable={editing}
        suppressContentEditableWarning
        onBlur={(e) => {
          setEditing(false)
          updateElement(el.id, { text: e.currentTarget.textContent })
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') e.currentTarget.blur()
          e.stopPropagation()
        }}
        style={{
          fontFamily: el.fontFamily,
          fontSize: isEmoji ? Math.min(el.width, el.height) * 0.7 : el.fontSize,
          lineHeight: el.lineHeight,
          letterSpacing: el.letterSpacing,
          fontWeight: el.fontWeight,
          textAlign: el.align,
          paddingLeft: isComment ? 22 : undefined,
        }}
      >
        {el.text}
      </div>
      {isSelected && canInteract && (
        <div className="resize-handle" onPointerDown={onResizePointerDown} />
      )}
    </div>
  )
}
