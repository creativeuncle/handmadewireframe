import { useRef } from 'react'
import { useStore } from '../lib/store'
import SketchyRect from './SketchyRect'

const ROUNDED_TYPES = new Set(['button', 'card', 'image', 'video'])

export default function CanvasElement({ el }) {
  const updateElement = useStore((s) => s.updateElement)
  const selectElement = useStore((s) => s.selectElement)
  const deleteElement = useStore((s) => s.deleteElement)
  const selectedId = useStore((s) => s.selectedId)
  const activeTool = useStore((s) => s.activeTool)
  const dragRef = useRef(null)

  const isSelected = selectedId === el.id
  const canInteract = activeTool === 'select'

  const onPointerDown = (e) => {
    if (!canInteract) return
    e.stopPropagation()
    selectElement(el.id)
    dragRef.current = { startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y }
    const onMove = (ev) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.startX
      const dy = ev.clientY - dragRef.current.startY
      updateElement(el.id, { x: dragRef.current.elX + dx, y: dragRef.current.elY + dy })
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  const onResizePointerDown = (e) => {
    e.stopPropagation()
    e.preventDefault()
    const start = { startX: e.clientX, startY: e.clientY, w: el.width, h: el.height }
    const onMove = (ev) => {
      const dx = ev.clientX - start.startX
      const dy = ev.clientY - start.startY
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

  const onKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (document.activeElement !== textRef.current) {
        e.preventDefault()
        deleteElement(el.id)
      }
    }
  }

  const textRef = useRef(null)

  return (
    <div
      className={`canvas-el${isSelected ? ' selected' : ''}`}
      style={{
        position: 'absolute',
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        cursor: canInteract ? 'move' : 'default',
      }}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <SketchyRect width={el.width} height={el.height} seed={el.seed} rounded={ROUNDED_TYPES.has(el.type)} />
      <div
        ref={textRef}
        className="canvas-el-label"
        contentEditable={canInteract}
        suppressContentEditableWarning
        onPointerDown={(e) => e.stopPropagation()}
        onBlur={(e) => updateElement(el.id, { text: e.currentTarget.textContent })}
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
