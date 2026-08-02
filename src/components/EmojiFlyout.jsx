import { useState } from 'react'
import { useStore } from '../lib/store'

const CATEGORIES = {
  Smileys: ['😀', '😂', '😅', '😍', '🥳', '😎', '🤔', '😴', '😭', '😡', '🥰', '🤩'],
  Gestures: ['👍', '👎', '👏', '🙌', '🤝', '👋', '✌️', '🤞', '💪', '🙏', '👌', '✋'],
  Objects: ['💡', '🔥', '⭐', '❤️', '✅', '⚠️', '🚀', '🎉', '📌', '🔗', '📎', '🗂️'],
}

export default function EmojiFlyout({ top }) {
  const addElement = useStore((s) => s.addElement)
  const closeFlyout = useStore((s) => s.closeFlyout)
  const [tab, setTab] = useState('Smileys')

  return (
    <div className="flyout-panel emoji-flyout" style={{ top }}>
      <div className="sidebar-tabs">
        {Object.keys(CATEGORIES).map((c) => (
          <button
            key={c}
            className={`sidebar-tab${tab === c ? ' active' : ''}`}
            data-tooltip={c}
            onClick={() => setTab(c)}
          >
            {CATEGORIES[c][0]}
          </button>
        ))}
      </div>
      <div className="component-grid emoji-grid">
        {CATEGORIES[tab].map((emoji) => (
          <button
            key={emoji}
            className="component-btn emoji-btn"
            onClick={() => {
              addElement('emoji', undefined, { text: emoji })
              closeFlyout()
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
