import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { useStore } from '../lib/store'

const RECENT_KEY = 'hwf-recent-emoji'

const CATEGORIES = [
  {
    id: 'smileys',
    label: 'Smileys',
    icon: '😀',
    items: [
      { c: '😀', n: 'grin' },
      { c: '😂', n: 'laugh' },
      { c: '😅', n: 'sweat' },
      { c: '😍', n: 'heart eyes' },
      { c: '🥳', n: 'party' },
      { c: '😎', n: 'cool' },
      { c: '🤔', n: 'think' },
      { c: '😴', n: 'sleep' },
      { c: '😭', n: 'cry' },
      { c: '😡', n: 'angry' },
      { c: '🥰', n: 'love' },
      { c: '🤩', n: 'star struck' },
    ],
  },
  {
    id: 'gestures',
    label: 'Gestures',
    icon: '👍',
    items: [
      { c: '👍', n: 'thumbs up' },
      { c: '👎', n: 'thumbs down' },
      { c: '👏', n: 'clap' },
      { c: '🙌', n: 'raise hands' },
      { c: '🤝', n: 'handshake' },
      { c: '👋', n: 'wave' },
      { c: '✌️', n: 'peace' },
      { c: '🤞', n: 'fingers crossed' },
      { c: '💪', n: 'muscle' },
      { c: '🙏', n: 'pray' },
      { c: '👌', n: 'ok' },
      { c: '✋', n: 'hand' },
    ],
  },
  {
    id: 'objects',
    label: 'Objects',
    icon: '💡',
    items: [
      { c: '💡', n: 'idea' },
      { c: '🔥', n: 'fire' },
      { c: '⭐', n: 'star' },
      { c: '❤️', n: 'heart' },
      { c: '✅', n: 'check' },
      { c: '⚠️', n: 'warning' },
      { c: '🚀', n: 'rocket' },
      { c: '🎉', n: 'party popper' },
      { c: '📌', n: 'pin' },
      { c: '🔗', n: 'link' },
      { c: '📎', n: 'clip' },
      { c: '🗂️', n: 'folder' },
    ],
  },
]

const STICKERS = [
  { c: '🎉', n: 'party popper' },
  { c: '🎊', n: 'confetti' },
  { c: '🥳', n: 'party face' },
  { c: '🔥', n: 'fire' },
  { c: '💯', n: 'hundred' },
  { c: '✨', n: 'sparkles' },
  { c: '🏆', n: 'trophy' },
  { c: '🎯', n: 'target' },
  { c: '🚀', n: 'rocket' },
  { c: '🌟', n: 'glow star' },
  { c: '🎈', n: 'balloon' },
  { c: '👑', n: 'crown' },
]

const MAIN_TABS = ['All', 'Stickers', 'Emojis', 'GIFs']

function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecent(list) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
  } catch {
    // ignore
  }
}

export default function EmojiFlyout() {
  const addElement = useStore((s) => s.addElement)
  const [mainTab, setMainTab] = useState('All')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState(loadRecent)

  useEffect(() => saveRecent(recent), [recent])

  const pick = (char, isSticker = false) => {
    addElement('emoji', undefined, { text: char, width: isSticker ? 84 : 64, height: isSticker ? 84 : 64 })
    setRecent((r) => [char, ...r.filter((c) => c !== char)].slice(0, 12))
  }

  const allItems = [...CATEGORIES.flatMap((c) => c.items), ...STICKERS]
  const q = query.trim().toLowerCase()
  const searchResults = q ? allItems.filter((it) => it.n.includes(q)) : null

  const activeCategory = CATEGORIES.find((c) => c.id === category)

  return (
    <div className="flyout-panel emoji-flyout full-height">
      <div className="emoji-search">
        <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.8} />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="emoji-main-tabs">
        {MAIN_TABS.map((t) => (
          <button
            key={t}
            className={`emoji-main-tab${mainTab === t ? ' active' : ''}`}
            onClick={() => setMainTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {mainTab === 'GIFs' ? (
        <p className="prop-empty">GIFs (Coming soon)</p>
      ) : searchResults ? (
        <>
          <div className="emoji-section-title">Search results</div>
          <div className="emoji-grid">
            {searchResults.map((it) => (
              <button key={it.c} className="emoji-item-btn" title={it.n} onClick={() => pick(it.c)}>
                {it.c}
              </button>
            ))}
            {searchResults.length === 0 && <p className="prop-empty">No matches</p>}
          </div>
        </>
      ) : (
        <>
          {mainTab !== 'Stickers' && (
            <div className="emoji-category-row">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`emoji-category-btn${category === c.id ? ' active' : ''}`}
                  data-tooltip={c.label}
                  onClick={() => setCategory(c.id)}
                >
                  {c.icon}
                </button>
              ))}
            </div>
          )}

          {mainTab !== 'Stickers' && recent.length > 0 && (
            <>
              <div className="emoji-section-title">Recent</div>
              <div className="emoji-grid">
                {recent.map((c) => (
                  <button key={c} className="emoji-item-btn" onClick={() => pick(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </>
          )}

          {mainTab !== 'Stickers' && (
            <>
              <div className="emoji-section-title">{activeCategory.label}</div>
              <div className="emoji-grid">
                {activeCategory.items.map((it) => (
                  <button key={it.c} className="emoji-item-btn" title={it.n} onClick={() => pick(it.c)}>
                    {it.c}
                  </button>
                ))}
              </div>
            </>
          )}

          {(mainTab === 'Stickers' || mainTab === 'All') && (
            <>
              <div className="emoji-section-title">Stickers</div>
              <div className="emoji-grid">
                {STICKERS.map((it) => (
                  <button
                    key={it.c}
                    className="emoji-item-btn sticker-btn"
                    title={it.n}
                    onClick={() => pick(it.c, true)}
                  >
                    {it.c}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
