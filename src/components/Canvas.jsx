import { useEffect, useRef } from 'react'
import { useStore } from '../lib/store'
import CanvasElement from './CanvasElement'

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

  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const wrapRef = useRef(null)
  const drawingRef = useRef(null)

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
  }, [strokes])

  const redrawAll = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const stroke of strokes) {
      drawStroke(ctx, stroke)
    }
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

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPointerDown = (e) => {
    if (activeTool === 'select') {
      selectElement(null)
      return
    }
    if (activeTool === 'text') {
      const pos = getPos(e)
      addElement('text', pos)
      setActiveTool('select')
      return
    }
    if (activeTool === 'pencil' || activeTool === 'eraser') {
      const pos = getPos(e)
      const size = activeTool === 'eraser' ? eraserSize : strokeWidth
      drawingRef.current = { mode: activeTool, size, points: [pos] }
      const ctx = ctxRef.current
      ctx.save()
      ctx.globalCompositeOperation = activeTool === 'eraser' ? 'destination-out' : 'source-over'
      ctx.strokeStyle = '#1f1f1f'
      ctx.lineWidth = size
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(pos.x, pos.y)

      const onMove = (ev) => {
        const p = getPos(ev)
        drawingRef.current.points.push(p)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
      }
      const onUp = () => {
        ctx.restore()
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

  const cursorClass =
    activeTool === 'pencil' ? 'tool-pencil' : activeTool === 'eraser' ? 'tool-eraser' : activeTool === 'text' ? 'tool-text' : ''

  return (
    <div ref={wrapRef} className={`canvas-wrap ${cursorClass}`} onPointerDown={onPointerDown}>
      {elements.map((el) => (
        <CanvasElement key={el.id} el={el} />
      ))}
      <canvas ref={canvasRef} className="draw-canvas" />
    </div>
  )
}
