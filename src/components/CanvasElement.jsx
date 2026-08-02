import { useRef, useState } from 'react'
import { useStore } from '../lib/store'
import SketchyRect from './SketchyRect'

const ROUNDED_TYPES = new Set(['button', 'card', 'image', 'video'])

export default function CanvasElement({ el }) {
  const updateElement = useStore((s) => s.updateElement)
  const selectElement = useStore((s) => s.selectElement)
  const selectedId = useStore((s) => s.selectedId)
  const activeTool = useStore((s) => s.activeTool)
  const textRef = useRef(null)
  const [editing, setEditing] = useState(false)

  const isSelected = selectedId === el.id
  const canInteract = activeTool === 'select'

  const onPointerDown = (e) => {
    if (!canInteract || editing) return
    e.stopPropagation()
    selectElement(el.id)
    const zoom = useStore.getState().zoom
    const start = { startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y }
    const onMove = (ev) => {
      const dx = (ev.clientX - start.startX) / zoom
      const dy = (ev.clientY - start.startY) / zoom
      updateElement(el.id, { x: start.elX + dx, y: start.elY + dy })
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
    const zoom = useStore.getState().zoom
    const start = { startX: e.clientX, startY: e.clientY, w: el.width, h: el.height }
    const onMove = (ev) => {
      const dx = (ev.clientX - start.startX) / zoom
      const dy = (ev.clientY - start.startY) / zoom
      updateElement(el.id, {
        width: Math.max(40, start.w + dx),
        height: Math.max(28, start.h + dy),
      })
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  return (
    <div
      className={`canvas-el${isSelected ? ' selected' : ''}`}
      style={{
        position: 'absolute',
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        cursor: canInteract ? (editing ? 'text' : 'move') : 'default',
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      <SketchyRect width={el.width} height={el.height} seed={el.seed} rounded={ROUNDED_TYPES.has(el.type)} />
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
          fontSize: el.fontSize,
          lineHeight: el.lineHeight,
          letterSpacing: el.letterSpacing,
          fontWeight: el.fontWeight,
          textAlign: el.align,
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
