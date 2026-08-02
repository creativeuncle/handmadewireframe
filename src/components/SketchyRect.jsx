export default function SketchyRect({ width, height, shape, color = '#1a1a1a' }) {
  const w = Math.max(width, 4)
  const h = Math.max(height, 4)

  if (shape === 'triangle') {
    const points = `${w / 2},3 ${w - 3},${h - 3} 3,${h - 3}`
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <polygon points={points} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      </svg>
    )
  }

  if (shape === 'arrow') {
    const midY = h / 2
    return (
      <svg width={w} height={h} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1={6} y1={midY} x2={w - 22} y2={midY} stroke={color} strokeWidth={2} strokeLinecap="round" />
        <polygon
          points={`${w - 26},${midY - 10} ${w - 4},${midY} ${w - 26},${midY + 10}`}
          fill={color}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return null
}
