import { useMemo } from 'react'
import rough from 'roughjs/bin/rough'

const generator = rough.generator()

export default function SketchyRect({ width, height, seed, rounded = false, shape = 'rect' }) {
  const paths = useMemo(() => {
    const w = Math.max(width, 4)
    const h = Math.max(height, 4)
    const opts = { stroke: '#1f1f1f', strokeWidth: 1.5, roughness: 1.6, seed }

    let drawable
    if (shape === 'ellipse') {
      drawable = generator.ellipse(w / 2, h / 2, w - 6, h - 6, opts)
    } else if (shape === 'triangle') {
      drawable = generator.polygon(
        [
          [w / 2, 3],
          [w - 3, h - 3],
          [3, h - 3],
        ],
        opts,
      )
    } else if (shape === 'arrow') {
      drawable = generator.linearPath(
        [
          [6, h / 2],
          [w - 20, h / 2],
        ],
        opts,
      )
    } else if (rounded) {
      drawable = generator.path(roundedRectPath(2, 2, w - 4, h - 4, 10), opts)
    } else {
      drawable = generator.rectangle(2, 2, w - 4, h - 4, opts)
    }
    const result = generator.toPaths(drawable)

    if (shape === 'arrow') {
      const head = generator.polygon(
        [
          [w - 26, h / 2 - 10],
          [w - 4, h / 2],
          [w - 26, h / 2 + 10],
        ],
        { ...opts, fill: '#1f1f1f', fillStyle: 'solid' },
      )
      result.push(...generator.toPaths(head))
    }

    return result
  }, [width, height, seed, rounded, shape])

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
