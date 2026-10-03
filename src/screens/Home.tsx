import { Avatar } from '../components/Avatar'
import { Bar, Flame, Gem, Icon, Moon, PALETTE, WeekStrip } from '../components/ui'
import { ACTIVITY_BY_ID, CATEGORY_INFO, type Activity } from '../data/activities'
import { describeUnlock, type Category } from '../data/items'
import { DAILY_GOAL, STREAK_MILESTONES, nextReward } from '../lib/game'
import type { Game } from '../lib/store'

const MOODS: { label: string; activity: string }[] = [
  { label: 'Stiff', activity: 'desk' },
  { label: 'Stressed', activity: 'box' },
  { label: 'Sluggish', activity: 'wakeup' },
  { label: 'Restless', activity: 'hiit' },
  { label: 'Scattered', activity: 'ground' },
  { label: "Can't sleep", activity: 'sleepy478' },
]

export function TopBar({ game }: { game: Game }) {
  const { stats } = game
  return (
    <header className="topbar">
      <span className="stat-pill" title="Level">
        Lv <b>{stats.level}</b>
      </span>
      <span className={`stat-pill ${stats.streak ? '' : 'dim'}`} title="Daily streak">
        <Flame size={18} lit={stats.streak > 0} /> <b>{stats.streak}</b>
      </span>
      <span className={`stat-pill ${stats.unwindStreak ? '' : 'dim'}`} title="Wind-down streak">
        <Moon size={17} lit={stats.unwindStreak > 0} /> <b>{stats.unwindStreak}</b>
      </span>
      <span className="stat-pill" title="Total XP">
        <Gem size={17} /> <b>{stats.xp.toLocaleString()}</b>
      </span>
    </header>
  )
}

function greeting(hour: number) {
  if (hour < 4) return 'Up late'
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  if (hour < 21) return 'Good evening'
  return 'Up late'
}

interface Props {
  game: Game
  onCategory: (c: Category) => void
  onActivity: (a: Activity) => void
  onCloset: () => void
}

export function Home({ game, onCategory, onActivity, onCloset }: Props) {
  const { state, stats } = game
  const now = new Date()
  const hour = now.getHours()
  const night = hour >= 20 || hour < 4
  const reward = nextReward(stats, state.avatar.body)
  const goalPct = Math.min(1, stats.todayXp / DAILY_GOAL)
  const todayCat = (c: Category) => state.log.filter((e) => e.day === stats.today && e.cat === c).reduce((a, e) => a + e.xp, 0)

  return (
    <div className="screen home">
      <header className="home-head">
        <div>
          <small className="eyebrow">{now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</small>
          <h1 className="display">
            {greeting(hour)},
            <br />
            {state.name}
          </h1>
        </div>
      </header>

      <WeekStrip today={stats.today} active={stats.activeDays} />

      <section className="hero-card" onClick={onCloset}>
        <div className="hero-avatar">
          <Avatar config={state.avatar} pose={goalPct >= 1 ? 'cheer' : 'wave'} />
        </div>
        <div className="hero-info">
          <small className="eyebrow dark">Level {stats.level}</small>
          <div className="hero-xp">{stats.xp.toLocaleString()} XP</div>
          <Bar value={stats.levelProgress} max={stats.levelNeed} color="#0C0C0E" height={10} />
          <small className="hero-sub">{stats.levelNeed - stats.levelProgress} XP to level {stats.level + 1}</small>
          <div className="hero-stats">
            <span>
              <Flame size={18} lit={stats.streak > 0} /> {stats.streak} day{stats.streak === 1 ? '' : 's'}
            </span>
            <span>
              <Moon size={16} lit={stats.unwindStreak > 0} /> {stats.unwindStreak} night{stats.unwindStreak === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </section>

      <h3 className="section-title">Today</h3>
      <div className="pill-list">
        <div className={`goal-pill ${goalPct >= 1 ? 'done' : ''}`}>
          {['base', 'fill'].map((layer) => (
            <div key={layer} className={`pill goal-layer ${layer}`} style={layer === 'fill' ? { clipPath: `inset(0 ${100 - goalPct * 100}% 0 0 round 999px)` } : undefined}>
              <span className="pill-name">{goalPct >= 1 ? 'Daily goal smashed' : 'Daily goal'}</span>
              <span className="pill-num">
                {Math.min(stats.todayXp, DAILY_GOAL)}/{DAILY_GOAL} XP
              </span>
            </div>
          ))}
        </div>
        {(['move', 'calm', 'unwind'] as Category[]).map((c) => {
          const info = CATEGORY_INFO[c]
          const xp = todayCat(c)
          return (
            <button key={c} className={`pill cat-pill ${xp ? 'done' : ''} ${c === 'unwind' && night && !xp ? 'glow' : ''}`} style={{ background: info.color }} onClick={() => onCategory(c)}>
              <span className="pill-text">
                <span className="pill-name">{info.name}</span>
                <small>{c === 'unwind' && night && !xp ? "Tonight's pick is ready" : info.tagline}</small>
              </span>
              <span className="pill-num">{xp ? `+${xp}` : <Icon name="arrow" />}</span>
            </button>
          )
        })}
      </div>

      <h3 className="section-title">How do you feel?</h3>
      <section className="moods">
        {MOODS.map((m, i) => (
          <button key={m.label} className="mood" style={{ ['--mc' as string]: PALETTE[(i * 3) % PALETTE.length] }} onClick={() => onActivity(ACTIVITY_BY_ID[m.activity])}>
            {m.label}
          </button>
        ))}
      </section>

      {reward && reward.item.unlock && (
        <>
          <h3 className="section-title">Next reward</h3>
          <section className="card reward" onClick={onCloset}>
            <div className="reward-preview">
              <Avatar config={{ ...state.avatar, [reward.item.slot]: reward.item.id }} showBg={reward.item.slot === 'background'} anim="still" />
            </div>
            <div className="reward-info">
              <div className="reward-name">{reward.item.name}</div>
              <div className="reward-req">{describeUnlock(reward.item.unlock)}</div>
              <Bar value={reward.have} max={reward.need} color="#EDEB5E" height={8} />
            </div>
          </section>
        </>
      )}

      <h3 className="section-title">Streak milestones</h3>
      <section className="milestones">
        {STREAK_MILESTONES.map((m, i) => {
          const done = stats.best >= m
          return (
            <div key={m} className={`milestone ${done ? 'done' : ''}`} style={done ? { background: PALETTE[[0, 4, 3, 1][i]] } : undefined}>
              <b>{m}</b>
              <small>days</small>
              <span>{m === 3 ? 'Kitty Ears' : m === 7 ? 'Superstar Fit' : m === 14 ? 'Crown' : 'Galaxy'}</span>
            </div>
          )
        })}
      </section>
    </div>
  )
}
