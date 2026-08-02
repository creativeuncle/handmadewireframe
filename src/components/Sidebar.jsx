import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Cursor02Icon,
  CreditCardIcon,
  Image01Icon,
  Video01Icon,
  InputTextIcon,
  Menu01Icon,
  LayoutTopIcon,
  Layout01Icon,
  SidebarLeftIcon,
  LayoutBottomIcon,
  HeadingIcon,
  Heading02Icon,
  Search01Icon,
  AppWindowIcon,
  ArrowRight05Icon,
  ArrangeByNumbersOneNineIcon,
  ParagraphIcon,
  ComputerIcon,
  SmartPhone01Icon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'

const COMPONENTS = [
  { type: 'button', label: 'Button', icon: Cursor02Icon },
  { type: 'card', label: 'Card', icon: CreditCardIcon },
  { type: 'image', label: 'Image', icon: Image01Icon },
  { type: 'video', label: 'Video', icon: Video01Icon },
  { type: 'input', label: 'Input Field', icon: InputTextIcon },
  { type: 'navbar', label: 'Navbar', icon: Menu01Icon },
  { type: 'header', label: 'Header', icon: LayoutTopIcon },
  { type: 'hero', label: 'Hero Section', icon: Layout01Icon },
  { type: 'sidebar', label: 'Sidebar', icon: SidebarLeftIcon },
  { type: 'footer', label: 'Footer', icon: LayoutBottomIcon },
  { type: 'heading', label: 'Headings', icon: HeadingIcon },
  { type: 'subheading', label: 'Sub Headings', icon: Heading02Icon },
  { type: 'searchbar', label: 'Search Bar', icon: Search01Icon },
  { type: 'popup', label: 'Popups', icon: AppWindowIcon },
  { type: 'breadcrumbs', label: 'Breadcrumbs', icon: ArrowRight05Icon },
  { type: 'pagination', label: 'Pagination', icon: ArrangeByNumbersOneNineIcon },
  { type: 'paragraph', label: 'Paragraph', icon: ParagraphIcon },
]

const TABS = [
  { id: 'web', label: 'Web', icon: ComputerIcon },
  { id: 'mobile', label: 'Mobile', icon: SmartPhone01Icon },
  { id: 'layers', label: 'Layers', icon: Layers01Icon },
]

export default function Sidebar() {
  const addElement = useStore((s) => s.addElement)
  const [activeTab, setActiveTab] = useState('web')

  return (
    <aside className="sidebar left-sidebar">
      <h2>Components</h2>

      <div className="sidebar-tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`sidebar-tab${activeTab === t.id ? ' active' : ''}`}
            data-tooltip={t.label}
            onClick={() => setActiveTab(t.id)}
          >
            <HugeiconsIcon icon={t.icon} size={18} strokeWidth={1.6} />
          </button>
        ))}
      </div>

      {activeTab === 'layers' ? (
        <p className="prop-empty">Layers (Coming soon)</p>
      ) : (
        <div className="component-grid">
          {COMPONENTS.map((c) => (
            <button
              key={c.type}
              className="component-btn"
              data-tooltip={c.label}
              onClick={() => addElement(c.type)}
            >
              <HugeiconsIcon icon={c.icon} size={22} strokeWidth={1.6} />
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
