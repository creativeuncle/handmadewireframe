import { useStore, STROKE_COLORS } from '../lib/store'

export default function PencilFlyout({ mode, top }) {
  const strokeWidth = useStore((s) => s.strokeWidth)
  const setStrokeWidth = useStore((s) => s.setStrokeWidth)
  const strokeColor = useStore((s) => s.strokeColor)
  const setStrokeColor = useStore((s) => s.setStrokeColor)
  const eraserSize = useStore((s) => s.eraserSize)
  const setEraserSize = useStore((s) => s.setEraserSize)

  const size = mode === 'eraser' ? eraserSize : strokeWidth
  const setSize = mode === 'eraser' ? setEraserSize : setStrokeWidth

  return (
    <div className="flyout-panel pencil-flyout" style={{ top }}>
      <input
        type="range"
        min={mode === 'eraser' ? 8 : 1}
        max={mode === 'eraser' ? 60 : 12}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
      />
      <div className="prop-range-labels">
        <span>Thin</span>
        <span>Bold</span>
      </div>

      {mode === 'pencil' && (
        <div className="color-grid">
          {STROKE_COLORS.map((c) => (
            <button
              key={c}
              className={`color-swatch${strokeColor === c ? ' active' : ''}`}
              style={{ background: c }}
              onClick={() => setStrokeColor(c)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
