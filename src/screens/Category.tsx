import { useState } from 'react'
import { Button, Pip, Sheet, Speech } from '../components/ui'
import { ACTIVITIES, CATEGORY_INFO, DIFFICULTY_LABEL, xpFor, type Activity, type Difficulty } from '../data/activities'
import type { Category } from '../data/items'
import type { Game } from '../lib/store'

const SECTIONS: { d: Difficulty; title: string; sub: string }[] = [
  { d: 1, title: 'Warm up', sub: 'Easy · low effort, quick wins' },
  { d: 2, title: 'Level up', sub: 'Medium · a bit more focus' },
  { d: 3, title: 'Boss mode', sub: 'Hard · big XP energy' },
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
    <Sheet onClose={onClose} dark={activity.category === 'unwind'}>
      <div className="act-sheet" style={{ ['--c' as string]: info.color, ['--d' as string]: info.dark, ['--l' as string]: info.light }}>
        <div className="act-emoji">{activity.emoji}</div>
        <div className="act-cat">{info.name}</div>
        <h2>{activity.title}</h2>
        <p>{activity.blurb}</p>
        <div className="chips">
          <span className="chip">
            <DifficultyDots d={activity.difficulty} /> {DIFFICULTY_LABEL[activity.difficulty]}
          </span>
          <span className="chip">⏱ {minutes} min</span>
          <span className="chip chip-xp">⚡ +{xpFor(activity.difficulty, minutes)} XP</span>
          {timesDone > 0 && <span className="chip">✅ done {timesDone}×</span>}
        </div>
        {activity.durations && (
          <div className="durations">
            <span>Pick a length</span>
            <div>
              {activity.durations.map((m) => (
                <button key={m} className={`dur ${m === minutes ? 'active' : ''}`} onClick={() => setMinutes(m)}>
                  {m} min
                </button>
              ))}
            </div>
          </div>
        )}
        <Button block variant={activity.category === 'move' ? 'green' : activity.category === 'calm' ? 'blue' : 'purple'} onClick={() => onStart(activity, minutes)}>
          Start · +{xpFor(activity.difficulty, minutes)} XP
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
  let idx = 0

  return (
    <div className="screen category" style={{ ['--c' as string]: info.color, ['--d' as string]: info.dark, ['--l' as string]: info.light }}>
      <header className="cat-header">
        <button className="back" onClick={onBack} aria-label="Back">←</button>
        <div>
          <div className="cat-header-title">
            {info.emoji} {info.name}
          </div>
          <div className="cat-header-sub">{info.tagline}</div>
        </div>
        <div className="cat-header-xp">{game.stats.catXp[cat]} XP</div>
      </header>

      {SECTIONS.map((s) => {
        const list = ACTIVITIES.filter((a) => a.category === cat && a.difficulty === s.d)
        if (!list.length) return null
        return (
          <section key={s.d} className="path-section">
            <div className="path-banner">
              <div>
                <b>{s.title}</b>
                <small>{s.sub}</small>
              </div>
              <DifficultyDots d={s.d} />
            </div>
            <div className="path">
              {list.map((a) => {
                const i = idx++
                const x = Math.sin(i * 1.1) * 72
                const done = doneCount(a.id)
                return (
                  <div key={a.id} className="path-node-wrap" style={{ transform: `translateX(${x}px)` }}>
                    <button className={`path-node ${done ? 'done' : ''} ${doneToday(a.id) ? 'today' : ''}`} onClick={() => setOpen(a)} aria-label={a.title}>
                      <span>{a.emoji}</span>
                      {done > 0 && <em className="node-count">{done}</em>}
                    </button>
                    <div className="path-label">
                      {a.title}
                      <small>
                        {a.minutes} min · +{xpFor(a.difficulty, a.minutes)} XP
                      </small>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      <div className="path-end">
        <Pip mood="cheer" size={90} />
        <Speech tail="left">More {info.name.toLowerCase()} quests coming soon!</Speech>
      </div>

      {open && <ActivitySheet activity={open} timesDone={doneCount(open.id)} onClose={() => setOpen(null)} onStart={(a, m) => { setOpen(null); onStart(a, m) }} />}
    </div>
  )
}
