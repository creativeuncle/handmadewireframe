import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUp01Icon, ArrowDown01Icon, LockIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'

const LABELS = {
  button: 'Button',
  card: 'Card',
  image: 'Image',
  video: 'Video',
  input: 'Input Field',
  navbar: 'Navbar',
  header: 'Header',
  hero: 'Hero Section',
  sidebar: 'Sidebar',
  footer: 'Footer',
  heading: 'Heading',
  subheading: 'Sub Heading',
  searchbar: 'Search Bar',
  popup: 'Popup',
  breadcrumbs: 'Breadcrumbs',
  pagination: 'Pagination',
  paragraph: 'Paragraph',
  text: 'Text',
  emoji: 'Emoji',
  comment: 'Comment',
  'shape-arrow': 'Arrow',
  'shape-square': 'Square',
  'shape-ellipse': 'Ellipse',
  'shape-triangle': 'Triangle',
}

export default function LayersPanel() {
  const elements = useStore((s) => s.elements)
  const selectedIds = useStore((s) => s.selectedIds)
  const selectElement = useStore((s) => s.selectElement)
  const toggleLock = useStore((s) => s.toggleLock)
  const moveLayerUp = useStore((s) => s.moveLayerUp)
  const moveLayerDown = useStore((s) => s.moveLayerDown)
  const deleteElement = useStore((s) => s.deleteElement)

  const layers = [...elements].reverse()

  return (
    <aside className="sidebar right-sidebar">
      <h2>Layers</h2>

      {layers.length === 0 ? (
        <p className="prop-empty">No layers yet — add a component to the canvas.</p>
      ) : (
        <div className="layers-list">
          {layers.map((el, i) => (
            <div
              key={el.id}
              className={`layer-row${selectedIds.includes(el.id) ? ' active' : ''}`}
              onClick={() => selectElement(el.id)}
            >
              <span className="layer-name">{LABELS[el.type] ?? el.type}</span>
              <div className="layer-actions">
                <button
                  data-tooltip="Move up"
                  disabled={i === 0}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLayerUp(el.id)
                  }}
                >
                  <HugeiconsIcon icon={ArrowUp01Icon} size={14} strokeWidth={1.8} />
                </button>
                <button
                  data-tooltip="Move down"
                  disabled={i === layers.length - 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    moveLayerDown(el.id)
                  }}
                >
                  <HugeiconsIcon icon={ArrowDown01Icon} size={14} strokeWidth={1.8} />
                </button>
                <button
                  data-tooltip={el.locked ? 'Unlock' : 'Lock'}
                  className={el.locked ? 'active' : ''}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLock(el.id)
                  }}
                >
                  <HugeiconsIcon icon={LockIcon} size={14} strokeWidth={1.8} />
                </button>
                <button
                  data-tooltip="Delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteElement(el.id)
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.8} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
