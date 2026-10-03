import { useCallback, useEffect, useState } from 'react'
import { xpFor, type Activity } from './data/activities'
import { itemsFor, type Category, type Item } from './data/items'
import { Icon } from './components/ui'
import { computeStats, dayKey, isUnlocked, unlockedIds } from './lib/game'
import { setSoundEnabled } from './lib/sound'
import { useGame } from './lib/store'
import { ActivitySheet, CategoryScreen } from './screens/Category'
import { Closet } from './screens/Closet'
import { Home } from './screens/Home'
import { Me } from './screens/Me'
import { Onboarding } from './screens/Onboarding'
import { Player } from './screens/Player'
import { Progress } from './screens/Progress'
import { Rewards, type Result } from './screens/Rewards'
import { UnwindScreen } from './screens/Unwind'

type Tab = 'home' | 'closet' | 'progress' | 'me'
type Overlay =
  | { type: 'category'; cat: Exclude<Category, 'unwind'> }
  | { type: 'unwind' }
  | { type: 'player'; activity: Activity; minutes: number; from: Overlay | null }
  | { type: 'rewards'; result: Result; from: Overlay | null }
  | null

const TABS: { id: Tab; label: string; icon: 'home' | 'closet' | 'chart' | 'user' }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'closet', label: 'Closet', icon: 'closet' },
  { id: 'progress', label: 'Progress', icon: 'chart' },
  { id: 'me', label: 'Me', icon: 'user' },
]

export default function App() {
  const game = useGame()
  const { state, stats, update } = game
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [detail, setDetail] = useState<Activity | null>(null)

  useEffect(() => {
    setSoundEnabled(state.sound)
  }, [state.sound])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab, overlay])

  const unseen = itemsFor(state.avatar.body).filter((i) => i.unlock && isUnlocked(i, stats) && !state.seen.includes(i.id)).length

  const switchTab = (t: Tab) => {
    if (tab === 'closet' && t !== 'closet') update((s) => ({ seen: [...new Set([...s.seen, ...unlockedIds(computeStats(s), s.avatar.body)])] }))
    setTab(t)
  }

  const start = (activity: Activity, minutes: number) => {
    setDetail(null)
    setOverlay((cur) => ({ type: 'player', activity, minutes, from: cur }))
  }

  const complete = useCallback(
    (activity: Activity, minutes: number, from: Overlay | null) => {
      const xp = xpFor(activity.difficulty, minutes)
      const before = computeStats(state)
      const entry = { id: `${Date.now()}`, activityId: activity.id, cat: activity.category, xp, minutes, day: dayKey(state.dayOffset), ts: Date.now() }
      const after = computeStats({ ...state, log: [...state.log, entry] })
      const newItems = itemsFor(state.avatar.body).filter((i) => i.unlock && isUnlocked(i, after) && !state.seen.includes(i.id))
      game.logActivity(activity.id, activity.category, xp, minutes)
      update((s) => ({ seen: [...new Set([...s.seen, ...newItems.map((i) => i.id)])] }))
      setOverlay({ type: 'rewards', result: { activity, minutes, xp, before, after, newItems }, from })
    },
    [state, game, update],
  )

  const equip = (item: Item) => update((s) => ({ avatar: { ...s.avatar, [item.slot]: item.id } }))

  if (!state.onboarded) return <div className="app"><Onboarding game={game} /></div>

  if (overlay?.type === 'player') {
    const { activity, minutes, from } = overlay
    return (
      <div className="app">
        <Player
          key={activity.id}
          activity={activity}
          minutes={minutes}
          avatar={state.avatar}
          demoSpeed={state.demoSpeed}
          soundOn={state.sound}
          onToggleSpeed={() => update({ demoSpeed: !state.demoSpeed })}
          onExit={() => setOverlay(from)}
          onComplete={() => complete(activity, minutes, from)}
        />
      </div>
    )
  }

  if (overlay?.type === 'rewards') {
    const back = overlay.result.activity.category === 'unwind' ? ({ type: 'unwind' } as const) : overlay.from
    return (
      <div className="app">
        <Rewards result={overlay.result} avatar={state.avatar} onEquip={equip} onDone={() => setOverlay(back)} />
      </div>
    )
  }

  return (
    <div className={`app ${overlay?.type === 'unwind' ? 'app-dark' : ''}`}>
      {overlay?.type === 'category' ? (
        <CategoryScreen game={game} cat={overlay.cat} onBack={() => setOverlay(null)} onStart={start} />
      ) : overlay?.type === 'unwind' ? (
        <UnwindScreen game={game} onBack={() => setOverlay(null)} onStart={start} />
      ) : (
        <>
          {tab === 'home' && (
            <Home
              game={game}
              onCategory={(c) => setOverlay(c === 'unwind' ? { type: 'unwind' } : { type: 'category', cat: c })}
              onActivity={setDetail}
              onCloset={() => switchTab('closet')}
            />
          )}
          {tab === 'closet' && <Closet game={game} />}
          {tab === 'progress' && <Progress game={game} />}
          {tab === 'me' && <Me game={game} />}
          <nav className="bottom-nav">
            {TABS.map((t) => (
              <button key={t.id} className={`nav-btn ${tab === t.id ? 'active' : ''}`} onClick={() => switchTab(t.id)}>
                <Icon name={t.icon} size={20} />
                <span className="nav-label">{t.label}</span>
                {t.id === 'closet' && unseen > 0 && <span className="nav-badge">{unseen}</span>}
              </button>
            ))}
          </nav>
        </>
      )}
      {detail && (
        <ActivitySheet
          activity={detail}
          timesDone={state.log.filter((e) => e.activityId === detail.id).length}
          onClose={() => setDetail(null)}
          onStart={start}
        />
      )}
    </div>
  )
}
