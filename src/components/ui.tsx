import { useMemo, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { sfx } from '../lib/sound'
import { INK } from './Avatar'

type Variant = 'green' | 'blue' | 'purple' | 'white' | 'gold' | 'ghost' | 'red'

export function Button({
  variant = 'green',
  block,
  small,
  className,
  onClick,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; block?: boolean; small?: boolean }) {
  return (
    <button
      className={`btn btn-${variant} ${block ? 'btn-block' : ''} ${small ? 'btn-small' : ''} ${className ?? ''}`}
      onClick={(e) => {
        sfx.tap()
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export function Bar({ value, max, color = '#58CC02', height = 16, label }: { value: number; max: number; color?: string; height?: number; label?: ReactNode }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))
  return (
    <div className="bar" style={{ height }}>
      <div className="bar-fill" style={{ width: `${pct}%`, background: color }}>
        <div className="bar-shine" />
      </div>
      {label && <div className="bar-label">{label}</div>}
    </div>
  )
}

export function Flame({ size = 24, lit = true }: { size?: number; lit?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2 C14 6 19 8 19 14 A7 7 0 0 1 5 14 C5 10 8 9 8 5 C10 7 11 8 11 10 C12 8 12 5 12 2 Z" fill={lit ? '#FF9600' : '#E5E5E5'} />
      <path d="M12 11 C13 13 15 14 15 16.5 A3 3 0 0 1 9 16.5 C9 14.5 11 14 12 11 Z" fill={lit ? '#FFC800' : '#F2F2F2'} />
    </svg>
  )
}

export function Moon({ size = 22, lit = true }: { size?: number; lit?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M15 3 A9 9 0 1 0 21 15 A7 7 0 0 1 15 3 Z" fill={lit ? '#8B6CF6' : '#E5E5E5'} />
    </svg>
  )
}

export function Gem({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2 L21 9 L12 22 L3 9 Z" fill="#FFC800" />
      <path d="M12 2 L16 9 L12 22 L8 9 Z" fill="#FFE066" />
    </svg>
  )
}

export type PipMood = 'happy' | 'sleepy' | 'cheer' | 'wave'

export function Pip({ mood = 'happy', size = 90 }: { mood?: PipMood; size?: number }) {
  const o = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const }
  const sleepy = mood === 'sleepy'
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`pip pip-${mood}`} aria-label="Pip the penguin">
      <ellipse cx="44" cy="110" rx="12" ry="6" fill="#FFB020" {...o} />
      <ellipse cx="76" cy="110" rx="12" ry="6" fill="#FFB020" {...o} />
      <g className="pip-wing-l">
        <path d="M24 62 C8 70 8 88 18 94 C22 84 26 76 30 70 Z" fill="#4F6BED" {...o} />
      </g>
      <g className={mood === 'wave' || mood === 'cheer' ? 'pip-wing-wave' : 'pip-wing-r'}>
        <path d="M96 62 C112 70 112 88 102 94 C98 84 94 76 90 70 Z" fill="#4F6BED" {...o} />
      </g>
      <ellipse cx="60" cy="66" rx="38" ry="44" fill="#4F6BED" {...o} />
      <ellipse cx="60" cy="76" rx="26" ry="30" fill="#fff" />
      {sleepy ? (
        <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
          <path d="M40 54 Q46 59 52 54" />
          <path d="M68 54 Q74 59 80 54" />
        </g>
      ) : mood === 'cheer' ? (
        <g fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round">
          <path d="M40 56 Q46 47 52 56" />
          <path d="M68 56 Q74 47 80 56" />
        </g>
      ) : (
        <g>
          <circle cx="46" cy="54" r="6" fill={INK} />
          <circle cx="74" cy="54" r="6" fill={INK} />
          <circle cx="48" cy="51.5" r="2" fill="#fff" />
          <circle cx="76" cy="51.5" r="2" fill="#fff" />
        </g>
      )}
      <ellipse cx="38" cy="66" rx="6" ry="3.5" fill="#FF9FB0" />
      <ellipse cx="82" cy="66" rx="6" ry="3.5" fill="#FF9FB0" />
      <path d="M52 62 L68 62 L60 72 Z" fill="#FFB020" {...o} strokeWidth="3" />
      {sleepy && (
        <g>
          <path d="M28 34 C36 6 84 6 92 34 Z" fill="#8B6CF6" {...o} />
          <path d="M88 26 C100 26 106 40 104 52" fill="none" stroke={INK} strokeWidth="4" />
          <circle cx="104" cy="54" r="7" fill="#fff" {...o} />
        </g>
      )}
    </svg>
  )
}

export function Speech({ children, tail = 'left' }: { children: ReactNode; tail?: 'left' | 'bottom' }) {
  return <div className={`speech speech-${tail}`}>{children}</div>
}

const CONFETTI_COLORS = ['#58CC02', '#1CB0F6', '#FFC800', '#FF4B4B', '#CE82FF', '#FF9600', '#FF8FB1']

export function Confetti({ count = 90 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.8 + Math.random() * 1.6,
        rot: Math.random() * 360,
        drift: (Math.random() - 0.5) * 160,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        w: 6 + Math.random() * 6,
        round: Math.random() > 0.6,
      })),
    [count],
  )
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: p.w,
            height: p.round ? p.w : p.w * 1.6,
            borderRadius: p.round ? '50%' : 2,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            ['--rot' as string]: `${p.rot}deg`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  )
}

export function Sheet({ children, onClose, dark }: { children: ReactNode; onClose: () => void; dark?: boolean }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className={`sheet ${dark ? 'sheet-dark' : ''}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function fmtMin(m: number) {
  if (m < 60) return `${Math.round(m)} min`
  const h = Math.floor(m / 60)
  return `${h}h ${Math.round(m % 60)}m`
}
