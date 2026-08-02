import { useMemo } from 'react'
import rough from 'roughjs/bin/rough'

const generator = rough.generator()

export default function SketchyRect({ width, height, seed, rounded = false }) {
  const paths = useMemo(() => {
    const w = Math.max(width, 4)
    const h = Math.max(height, 4)
    const drawable = rounded
      ? generator.path(roundedRectPath(2, 2, w - 4, h - 4, 10), {
          stroke: '#1f1f1f',
          strokeWidth: 1.5,
          roughness: 1.6,
          seed,
        })
      : generator.rectangle(2, 2, w - 4, h - 4, {
          stroke: '#1f1f1f',
          strokeWidth: 1.5,
          roughness: 1.6,
          seed,
        })
    return generator.toPaths(drawable)
  }, [width, height, seed, rounded])

  return (
    <svg
      width={width}
      height={height}
      className="sketchy-rect"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? 'none'} />
      ))}
    </svg>
  )
}

function roundedRectPath(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2)
  return `M ${x + rr} ${y}
    L ${x + w - rr} ${y}
    Q ${x + w} ${y} ${x + w} ${y + rr}
    L ${x + w} ${y + h - rr}
    Q ${x + w} ${y + h} ${x + w - rr} ${y + h}
    L ${x + rr} ${y + h}
    Q ${x} ${y + h} ${x} ${y + h - rr}
    L ${x} ${y + rr}
    Q ${x} ${y} ${x + rr} ${y}
    Z`
}
