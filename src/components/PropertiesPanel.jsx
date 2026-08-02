import { GOOGLE_FONTS, useStore } from '../lib/store'

export default function PropertiesPanel() {
  const activeTool = useStore((s) => s.activeTool)
  const selectedId = useStore((s) => s.selectedId)
  const elements = useStore((s) => s.elements)
  const strokeWidth = useStore((s) => s.strokeWidth)
  const eraserSize = useStore((s) => s.eraserSize)
  const setStrokeWidth = useStore((s) => s.setStrokeWidth)
  const setEraserSize = useStore((s) => s.setEraserSize)
  const updateElement = useStore((s) => s.updateElement)

  const selectedEl = elements.find((el) => el.id === selectedId)

  return (
    <aside className="sidebar right-sidebar">
      <h2>Properties</h2>

      {activeTool === 'pencil' && (
        <div className="prop-group">
          <label>Pencil size</label>
          <input
            type="range"
            min={1}
            max={12}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
          />
          <div className="prop-range-labels">
            <span>Thin</span>
            <span>Bold</span>
          </div>
        </div>
      )}

      {activeTool === 'eraser' && (
        <div className="prop-group">
          <label>Eraser size</label>
          <input
            type="range"
            min={8}
            max={60}
            value={eraserSize}
            onChange={(e) => setEraserSize(Number(e.target.value))}
          />
          <div className="prop-range-labels">
            <span>Thin</span>
            <span>Bold</span>
          </div>
        </div>
      )}

      {activeTool === 'select' && selectedEl && (
        <TextProperties el={selectedEl} onChange={(patch) => updateElement(selectedEl.id, patch)} />
      )}

      {activeTool === 'select' && !selectedEl && (
        <p className="prop-empty">Select an element or tool to see its properties.</p>
      )}

      {activeTool === 'text' && (
        <p className="prop-empty">Click on the canvas to place text.</p>
      )}
    </aside>
  )
}

function TextProperties({ el, onChange }) {
  return (
    <div className="prop-group">
      <label>Font family</label>
      <select value={el.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })}>
        {GOOGLE_FONTS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>
            {f}
          </option>
        ))}
      </select>

      <label>Font size</label>
      <input
        type="number"
        min={8}
        max={96}
        value={el.fontSize}
        onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
      />

      <label>Font weight</label>
      <select value={el.fontWeight} onChange={(e) => onChange({ fontWeight: Number(e.target.value) })}>
        {[300, 400, 500, 600, 700].map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>

      <label>Line height</label>
      <input
        type="number"
        step={0.1}
        min={0.8}
        max={3}
        value={el.lineHeight}
        onChange={(e) => onChange({ lineHeight: Number(e.target.value) })}
      />

      <label>Letter spacing</label>
      <input
        type="number"
        step={0.5}
        min={-2}
        max={10}
        value={el.letterSpacing}
        onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
      />

      <label>Align</label>
      <div className="align-row">
        {['left', 'center', 'right'].map((a) => (
          <button
            key={a}
            className={`align-btn${el.align === a ? ' active' : ''}`}
            onClick={() => onChange({ align: a })}
          >
            {a === 'left' ? '⟸' : a === 'center' ? '≡' : '⟹'}
          </button>
        ))}
      </div>
    </div>
  )
}
