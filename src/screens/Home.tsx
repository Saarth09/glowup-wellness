import { Avatar } from '../components/Avatar'
import { Bar, Flame, Gem, Moon, Pip, Speech } from '../components/ui'
import { ACTIVITY_BY_ID, CATEGORY_INFO, type Activity } from '../data/activities'
import { describeUnlock, type Category } from '../data/items'
import { DAILY_GOAL, STREAK_MILESTONES, nextReward } from '../lib/game'
import type { Game } from '../lib/store'

const MOODS: { emoji: string; label: string; activity: string }[] = [
  { emoji: '😣', label: 'Stiff', activity: 'desk' },
  { emoji: '😰', label: 'Stressed', activity: 'box' },
  { emoji: '🥱', label: 'Sluggish', activity: 'wakeup' },
  { emoji: '⚡', label: 'Restless', activity: 'hiit' },
  { emoji: '🌀', label: 'Scattered', activity: 'ground' },
  { emoji: '🌙', label: "Can't sleep", activity: 'sleepy478' },
]

export function TopBar({ game }: { game: Game }) {
  const { stats } = game
  return (
    <header className="topbar">
      <div className="tb-item" title="Level">
        <span className="lvl-badge">{stats.level}</span>
      </div>
      <div className={`tb-item ${stats.doneToday ? 'flame-on' : 'muted'}`} title="Daily streak">
        <Flame lit={stats.doneToday || stats.streak > 0} /> {stats.streak}
      </div>
      <div className="tb-item purple" title="Wind-down streak">
        <Moon lit={stats.unwindStreak > 0} /> {stats.unwindStreak}
      </div>
      <div className="tb-item gold" title="Total XP">
        <Gem /> {stats.xp.toLocaleString()}
      </div>
    </header>
  )
}

function greeting(name: string, hour: number, doneToday: boolean) {
  if (hour >= 21 || hour < 4) return `It's getting late, ${name}. Swap the scroll for a wind-down? 🌙`
  if (doneToday) return `Nice work today, ${name}! Keep that glow going ✨`
  if (hour < 11) return `Good morning, ${name}! A quick stretch to wake up? ☀️`
  if (hour < 17) return `Hey ${name}! Got 2 minutes for a breather?`
  return `Evening, ${name}! How about a little movement before dinner?`
}

interface Props {
  game: Game
  onCategory: (c: Category) => void
  onActivity: (a: Activity) => void
  onCloset: () => void
}

export function Home({ game, onCategory, onActivity, onCloset }: Props) {
  const { state, stats } = game
  const hour = new Date().getHours()
  const night = hour >= 20 || hour < 4
  const reward = nextReward(stats)
  const goalDone = stats.todayXp >= DAILY_GOAL

  return (
    <div className="screen home">
      <TopBar game={game} />

      <section className="hero card">
        <button className="hero-avatar" onClick={onCloset} aria-label="Open closet">
          <Avatar config={state.avatar} pose={goalDone ? 'cheer' : 'wave'} />
        </button>
        <div className="hero-info">
          <div className="hero-name">{state.name}</div>
          <div className="hero-level">Level {stats.level}</div>
          <Bar value={stats.levelProgress} max={stats.levelNeed} color="#FFC800" label={`${stats.levelProgress} / ${stats.levelNeed} XP`} />
          <div className="hero-pip">
            <Pip mood={night ? 'sleepy' : 'happy'} size={54} />
            <Speech>{greeting(state.name, hour, stats.doneToday)}</Speech>
          </div>
        </div>
      </section>

      <section className="card goal">
        <div className="goal-ring" style={{ ['--p' as string]: Math.min(1, stats.todayXp / DAILY_GOAL) }}>
          <span>{goalDone ? '✓' : `${Math.min(stats.todayXp, DAILY_GOAL)}`}</span>
        </div>
        <div className="goal-text">
          <div className="goal-title">{goalDone ? 'Daily goal smashed!' : 'Daily goal'}</div>
          <div className="goal-sub">
            {goalDone ? `${stats.todayXp} XP today — legend.` : `${stats.todayXp} / ${DAILY_GOAL} XP today`}
          </div>
        </div>
        <div className="goal-flame">
          <Flame size={36} lit={stats.doneToday} />
          <b>{stats.streak}</b>
        </div>
      </section>

      <h3 className="section-title">Pick your quest</h3>
      <section className="cat-cards">
        {(['move', 'calm', 'unwind'] as Category[]).map((c) => {
          const info = CATEGORY_INFO[c]
          const highlight = c === 'unwind' && night
          return (
            <button
              key={c}
              className={`cat-card cat-${c} ${highlight ? 'glow' : ''}`}
              onClick={() => onCategory(c)}
              style={{ ['--c' as string]: info.color, ['--d' as string]: info.dark, ['--l' as string]: info.light }}
            >
              <span className="cat-emoji">{info.emoji}</span>
              <span className="cat-text">
                <span className="cat-name">{info.name}</span>
                <span className="cat-tag">{c === 'unwind' && stats.unwindToday ? 'Done for tonight 🌙' : info.tagline}</span>
              </span>
              <span className="cat-xp">{stats.catXp[c]} XP</span>
              {highlight && !stats.unwindToday && <span className="cat-pill">Tonight's pick ready</span>}
            </button>
          )
        })}
      </section>

      <h3 className="section-title">How are you feeling?</h3>
      <section className="moods">
        {MOODS.map((m) => (
          <button key={m.label} className="mood" onClick={() => onActivity(ACTIVITY_BY_ID[m.activity])}>
            <span className="mood-emoji">{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </section>

      {reward && reward.item.unlock && (
        <>
          <h3 className="section-title">Next reward</h3>
          <section className="card reward" onClick={onCloset}>
            <div className="reward-preview">
              <Avatar config={{ ...state.avatar, [reward.item.slot]: reward.item.id }} showBg={reward.item.slot === 'background'} anim="still" />
              <span className="reward-lock">🔒</span>
            </div>
            <div className="reward-info">
              <div className="reward-name">{reward.item.name}</div>
              <div className="reward-req">{describeUnlock(reward.item.unlock)}</div>
              <Bar value={reward.have} max={reward.need} color="#1CB0F6" label={`${reward.have} / ${reward.need}`} />
            </div>
          </section>
        </>
      )}

      <h3 className="section-title">Streak milestones</h3>
      <section className="card milestones">
        {STREAK_MILESTONES.map((m) => {
          const done = stats.best >= m
          return (
            <div key={m} className={`milestone ${done ? 'done' : ''}`}>
              <div className="milestone-badge">
                <Flame size={28} lit={done} />
              </div>
              <b>{m} days</b>
              <small>{m === 3 ? 'Kitty Ears' : m === 7 ? 'Superstar Fit' : m === 14 ? 'Crown' : 'Galaxy + Rockets'}</small>
            </div>
          )
        })}
      </section>
    </div>
  )
}
