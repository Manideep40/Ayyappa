import React from 'react'

type Props = {
  end: number
  start?: number
  durationMs?: number
  className?: string
  formatter?: (n: number) => string
  continuous?: boolean
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3)
}

export function CountUp({
  end,
  start = 0,
  durationMs = 2000,
  className,
  formatter,
  continuous = false,
}: Props) {
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const [val, setVal] = React.useState(start)
  const [hasPlayed, setHasPlayed] = React.useState(false)

  React.useEffect(() => {
    let raf = 0
    let startTs = 0
    let observer: IntersectionObserver | null = null
    const node = ref.current
    if (!node) return

    const play = () => {
      setHasPlayed(true)
      const loop = (ts: number) => {
        if (!startTs) startTs = ts
        const t = Math.min(1, (ts - startTs) / durationMs)
        const eased = easeOutCubic(t)
        const current = Math.round(start + (end - start) * eased)
        setVal(current)
        if (t < 1) {
          raf = requestAnimationFrame(loop)
        }
      }
      raf = requestAnimationFrame(loop)
    }

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && !hasPlayed) {
        play()
      }
    }, { threshold: 0.2 })

    observer.observe(node)

    return () => {
      if (observer) observer.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, start, durationMs])

  // Small, periodic increments to simulate live growth
  React.useEffect(() => {
    if (!continuous) return
    const minDelay = 5000
    const maxDelay = 15000
    let timer: any
    function schedule() {
      const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay
      timer = setTimeout(() => {
        setVal((v) => v + 1)
        schedule()
      }, delay)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [continuous])

  const text = formatter ? formatter(val) : String(val)

  return <span ref={ref} className={className}>{text}</span>
}

