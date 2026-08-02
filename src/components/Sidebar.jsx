import { useStore } from '../lib/store'

const COMPONENTS = [
  { type: 'button', label: 'Button' },
  { type: 'card', label: 'Card' },
  { type: 'input', label: 'Input' },
  { type: 'tabs', label: 'Tabs' },
  { type: 'image', label: 'Image' },
  { type: 'slider', label: 'Slider' },
  { type: 'heading', label: 'Heading' },
  { type: 'video', label: 'Video' },
]

export default function Sidebar() {
  const addElement = useStore((s) => s.addElement)

  return (
    <aside className="sidebar left-sidebar">
      <h2>Components</h2>
      <div className="component-grid">
        {COMPONENTS.map((c) => (
          <button key={c.type} className="component-btn" onClick={() => addElement(c.type)}>
            {c.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
