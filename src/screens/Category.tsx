import { useState } from 'react'
import { Button, Icon, PALETTE, Sheet } from '../components/ui'
import { ACTIVITIES, CATEGORY_INFO, DIFFICULTY_LABEL, xpFor, type Activity, type Difficulty } from '../data/activities'
import type { Category } from '../data/items'
import type { Game } from '../lib/store'

const SECTIONS: { d: Difficulty; title: string; sub: string }[] = [
  { d: 1, title: 'Warm up', sub: 'Easy, quick wins' },
  { d: 2, title: 'Level up', sub: 'Medium, a bit more focus' },
  { d: 3, title: 'Boss mode', sub: 'Hard, big XP energy' },
]

export function DifficultyDots({ d }: { d: Difficulty }) {
  return (
    <span className="diff-dots" aria-label={DIFFICULTY_LABEL[d]}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= d ? 'on' : ''} />
      ))}
    </span>
  )
}

export function ActivitySheet({ activity, onClose, onStart, timesDone }: { activity: Activity; onClose: () => void; onStart: (a: Activity, minutes: number) => void; timesDone: number }) {
  const [minutes, setMinutes] = useState(activity.minutes)
  const info = CATEGORY_INFO[activity.category]
  return (
    <Sheet onClose={onClose}>
      <div className="act-sheet" style={{ ['--c' as string]: info.color }}>
        <div className="act-cat">
          {info.name} · {DIFFICULTY_LABEL[activity.difficulty]}
        </div>
        <h2>{activity.title}</h2>
        <p>{activity.blurb}</p>
        <div className="chips">
          <span className="chip">
            <DifficultyDots d={activity.difficulty} />
          </span>
          <span className="chip">{minutes} min</span>
          <span className="chip chip-xp">+{xpFor(activity.difficulty, minutes)} XP</span>
          {timesDone > 0 && <span className="chip">Done {timesDone}×</span>}
        </div>
        {activity.durations && (
          <div className="durations">
            {activity.durations.map((m) => (
              <button key={m} className={`dur ${m === minutes ? 'active' : ''}`} onClick={() => setMinutes(m)}>
                {m} min
              </button>
            ))}
          </div>
        )}
        <Button block variant={activity.category === 'move' ? 'green' : activity.category === 'calm' ? 'blue' : 'purple'} onClick={() => onStart(activity, minutes)}>
          Start
        </Button>
      </div>
    </Sheet>
  )
}

interface Props {
  game: Game
  cat: Exclude<Category, 'unwind'>
  onBack: () => void
  onStart: (a: Activity, minutes: number) => void
}

export function CategoryScreen({ game, cat, onBack, onStart }: Props) {
  const info = CATEGORY_INFO[cat]
  const [open, setOpen] = useState<Activity | null>(null)
  const doneCount = (id: string) => game.state.log.filter((e) => e.activityId === id).length
  const doneToday = (id: string) => game.state.log.some((e) => e.activityId === id && e.day === game.stats.today)
  let idx = cat === 'calm' ? 3 : 0

  return (
    <div className="screen category">
      <header className="page-head">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <span className="stat-pill">
          <b>{game.stats.catXp[cat]}</b> XP
        </span>
      </header>
      <h1 className="display" style={{ color: info.color }}>
        {info.name}
      </h1>
      <p className="lede">{info.tagline}</p>

      {SECTIONS.map((s) => {
        const list = ACTIVITIES.filter((a) => a.category === cat && a.difficulty === s.d)
        if (!list.length) return null
        return (
          <section key={s.d}>
            <div className="list-head">
              <b>{s.title}</b>
              <small>{s.sub}</small>
            </div>
            <div className="pill-list">
              {list.map((a) => {
                const color = PALETTE[idx++ % PALETTE.length]
                const done = doneToday(a.id)
                const n = doneCount(a.id)
                return (
                  <button key={a.id} className={`pill act-pill ${done ? 'done' : ''}`} style={{ background: color }} onClick={() => setOpen(a)}>
                    <span className="pill-text">
                      <span className="pill-name">{a.title}</span>
                      <small>
                        {a.minutes} min · {DIFFICULTY_LABEL[a.difficulty]}
                        {n > 0 ? ` · done ${n}×` : ''}
                      </small>
                    </span>
                    <span className="pill-num">+{xpFor(a.difficulty, a.minutes)}</span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}

      {open && <ActivitySheet activity={open} timesDone={doneCount(open.id)} onClose={() => setOpen(null)} onStart={(a, m) => { setOpen(null); onStart(a, m) }} />}
    </div>
  )
}
