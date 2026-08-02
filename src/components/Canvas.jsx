import { useEffect, useRef, useState } from 'react'
import { useStore } from '../lib/store'
import CanvasElement from './CanvasElement'

const GRID_SIZE = 22

export default function Canvas() {
  const elements = useStore((s) => s.elements)
  const strokes = useStore((s) => s.strokes)
  const activeTool = useStore((s) => s.activeTool)
  const strokeWidth = useStore((s) => s.strokeWidth)
  const eraserSize = useStore((s) => s.eraserSize)
  const addStroke = useStore((s) => s.addStroke)
  const addElement = useStore((s) => s.addElement)
  const selectElement = useStore((s) => s.selectElement)
  const setActiveTool = useStore((s) => s.setActiveTool)
  const selectedId = useStore((s) => s.selectedId)
  const deleteElement = useStore((s) => s.deleteElement)
  const pan = useStore((s) => s.pan)
  const zoom = useStore((s) => s.zoom)
  const panBy = useStore((s) => s.panBy)
  const zoomAtPoint = useStore((s) => s.zoomAtPoint)
  const resetView = useStore((s) => s.resetView)

  const [spacePressed, setSpacePressed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)

  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const wrapRef = useRef(null)
  const drawingRef = useRef(null)
  const panRef = useRef(null)

  // space-to-pan + delete key
  useEffect(() => {
    const isTyping = () => {
      const el = document.activeElement
      return el && (el.isContentEditable || el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT')
    }
    const onKeyDown = (e) => {
      if (e.code === 'Space' && !isTyping()) {
        e.preventDefault()
        setSpacePressed(true)
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping() && useStore.getState().selectedId) {
        e.preventDefault()
        deleteElement(useStore.getState().selectedId)
      }
    }
    const onKeyUp = (e) => {
      if (e.code === 'Space') setSpacePressed(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [deleteElement])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const resize = () => {
      const rect = wrap.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      redrawAll()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    redrawAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, pan, zoom])

  const redrawAll = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(zoom, 0, 0, zoom, pan.x, pan.y)
    for (const stroke of strokes) drawStroke(ctx, stroke)
  }

  const drawStroke = (ctx, stroke) => {
    if (stroke.points.length < 2) return
    ctx.save()
    ctx.globalCompositeOperation = stroke.mode === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = '#1f1f1f'
    ctx.lineWidth = stroke.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
    for (const pt of stroke.points.slice(1)) ctx.lineTo(pt.x, pt.y)
    ctx.stroke()
    ctx.restore()
  }

  // screen coords -> content (canvas) coords
  const toContent = (clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const sx = clientX - rect.left
    const sy = clientY - rect.top
    return { x: (sx - pan.x) / zoom, y: (sy - pan.y) / zoom }
  }

  const onWheel = (e) => {
    e.preventDefault()
    const rect = wrapRef.current.getBoundingClientRect()
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (e.ctrlKey || e.metaKey) {
      const factor = Math.exp(-e.deltaY * 0.01)
      zoomAtPoint(factor, point)
    } else {
      panBy(-e.deltaX, -e.deltaY)
    }
  }

  const onPointerDown = (e) => {
    if (spacePressed || e.button === 1) {
      e.preventDefault()
      setIsPanning(true)
      panRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y }
      const onMove = (ev) => {
        if (!panRef.current) return
        const dx = ev.clientX - panRef.current.startX
        const dy = ev.clientY - panRef.current.startY
        useStore.setState({ pan: { x: panRef.current.panX + dx, y: panRef.current.panY + dy } })
      }
      const onUp = () => {
        panRef.current = null
        setIsPanning(false)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      return
    }

    if (activeTool === 'select') {
      selectElement(null)
      return
    }
    if (activeTool === 'text') {
      const pos = toContent(e.clientX, e.clientY)
      addElement('text', pos)
      setActiveTool('select')
      return
    }
    if (activeTool === 'pencil' || activeTool === 'eraser') {
      const pos = toContent(e.clientX, e.clientY)
      const size = activeTool === 'eraser' ? eraserSize : strokeWidth
      drawingRef.current = { mode: activeTool, size, points: [pos] }
      const ctx = ctxRef.current

      const onMove = (ev) => {
        const p = toContent(ev.clientX, ev.clientY)
        drawingRef.current.points.push(p)
        redrawAll()
        drawStroke(ctx, drawingRef.current)
      }
      const onUp = () => {
        if (drawingRef.current && drawingRef.current.points.length > 1) {
          addStroke(drawingRef.current)
        }
        drawingRef.current = null
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    }
  }

  const cursorClass = spacePressed
    ? isPanning
      ? 'tool-panning'
      : 'tool-pan'
    : activeTool === 'pencil'
      ? 'tool-pencil'
      : activeTool === 'eraser'
        ? 'tool-eraser'
        : activeTool === 'text'
          ? 'tool-text'
          : ''

  const bgSize = GRID_SIZE * zoom
  const bgPosX = ((pan.x % bgSize) + bgSize) % bgSize
  const bgPosY = ((pan.y % bgSize) + bgSize) % bgSize

  return (
    <div
      ref={wrapRef}
      className={`canvas-wrap ${cursorClass}`}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      style={{
        backgroundSize: `${bgSize}px ${bgSize}px`,
        backgroundPosition: `${bgPosX}px ${bgPosY}px`,
      }}
    >
      <div
        className="canvas-content"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
      >
        {elements.map((el) => (
          <CanvasElement key={el.id} el={el} />
        ))}
      </div>
      <canvas ref={canvasRef} className="draw-canvas" />

      <div className="zoom-control">
        <button onClick={() => zoomAtPoint(0.83, centerPoint(wrapRef))}>−</button>
        <button className="zoom-pct" onClick={resetView}>
          {Math.round(zoom * 100)}%
        </button>
        <button onClick={() => zoomAtPoint(1.2, centerPoint(wrapRef))}>+</button>
      </div>
    </div>
  )
}

function centerPoint(wrapRef) {
  const rect = wrapRef.current.getBoundingClientRect()
  return { x: rect.width / 2, y: rect.height / 2 }
}
