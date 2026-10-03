import { Avatar } from '../components/Avatar'
import { Button, Icon, Moon, Pip } from '../components/ui'
import { ACTIVITIES, xpFor, type Activity } from '../data/activities'
import { shiftDay } from '../lib/game'
import type { Game } from '../lib/store'

const UNWIND = ACTIVITIES.filter((a) => a.category === 'unwind')

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** One deterministic pick per night (never the same as last night), plus one alternate. */
export function tonightsPicks(game: Game): [Activity, Activity] {
  const today = game.stats.today
  const yesterday = shiftDay(today, -1)
  const last = game.state.log.filter((e) => e.cat === 'unwind' && e.day === yesterday).pop()?.activityId
  const pool = UNWIND.filter((a) => a.id !== last)
  const h = hash(today)
  const first = pool[h % pool.length]
  const rest = pool.filter((a) => a.id !== first.id)
  return [first, rest[(h >> 3) % rest.length]]
}

interface Props {
  game: Game
  onBack: () => void
  onStart: (a: Activity, minutes: number) => void
}

export function UnwindScreen({ game, onBack, onStart }: Props) {
  const { state, stats } = game
  const [first, alt] = tonightsPicks(game)
  const swapped = state.unwindSwap === stats.today
  const pick = swapped ? alt : first
  const sleepyLook = { ...state.avatar, background: 'night' }
  const week = Array.from({ length: 7 }, (_, i) => shiftDay(stats.today, i - 6))
  const unwindDays = new Set(state.log.filter((e) => e.cat === 'unwind').map((e) => e.day))
  const dayName = (d: string) => new Date(d + 'T12:00').toLocaleDateString(undefined, { weekday: 'narrow' })

  return (
    <div className="screen unwind">
      <header className="unwind-header">
        <button className="icon-btn" onClick={onBack} aria-label="Back">
          <Icon name="back" />
        </button>
        <span>Unwind</span>
        <span className="unwind-streak">
          <Moon /> {stats.unwindStreak}
        </span>
      </header>

      <div className="unwind-stage">
        <Avatar config={sleepyLook} pose="sleep" anim="breathe" />
      </div>

      {stats.unwindToday ? (
        <div className="unwind-done">
          <h2>All done for tonight</h2>
          <p>That's it, no next video and nothing else to tap. Put your phone face-down and let your brain power down.</p>
          <div className="unwind-pip">
            <Pip mood="sleepy" size={80} />
            <span>"I'll guard your streak. Night night!"</span>
          </div>
        </div>
      ) : (
        <>
          <div className="unwind-intro">
            <h2>Tonight's wind-down</h2>
            <p>One slow thing, then sleep. No feed, no autoplay.</p>
          </div>
          <div className="unwind-card">
            <small className="eyebrow dark">Tonight's pick</small>
            <b>{pick.title}</b>
            <span>{pick.blurb}</span>
            <small>
              {pick.minutes} min · +{xpFor(pick.difficulty, pick.minutes)} XP · keeps your wind-down streak
            </small>
          </div>
          <Button block variant="purple" onClick={() => onStart(pick, pick.minutes)}>
            Begin wind-down
          </Button>
          {!swapped ? (
            <button className="link-btn" onClick={() => game.update({ unwindSwap: stats.today })}>
              Not feeling it? Swap once
            </button>
          ) : (
            <p className="tiny-note">You've used tonight's swap. This one's a good one, promise.</p>
          )}
        </>
      )}

      <div className="unwind-week">
        {week.map((d) => (
          <div key={d} className={`uw-day ${d === stats.today ? 'today' : ''}`}>
            <Moon size={24} lit={unwindDays.has(d)} />
            <small>{dayName(d)}</small>
          </div>
        ))}
      </div>

      <ul className="unwind-rules">
        <li>We'll never suggest "one more" after you finish</li>
        <li>Dim colours, slow motion, nothing flashing</li>
        <li>A 3-night streak unlocks Bunny Slippers</li>
      </ul>
    </div>
  )
}
