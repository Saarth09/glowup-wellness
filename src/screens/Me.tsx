import { useState } from 'react'
import { Button, Pip } from '../components/ui'
import { COMPLETION_BONUS } from '../data/activities'
import { levelStart } from '../lib/game'
import type { Game } from '../lib/store'
import { TopBar } from './Home'

export function Me({ game }: { game: Game }) {
  const { state, update, demo } = game
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className="screen me">
      <TopBar game={game} />
      <h2 className="page-title">Me</h2>

      <section className="card settings">
        <label className="setting">
          <span>Name</span>
          <input className="text-input small" maxLength={16} value={state.name} onChange={(e) => update({ name: e.target.value })} />
        </label>
        <label className="setting">
          <span>Sound effects & ambience</span>
          <input type="checkbox" className="toggle" checked={state.sound} onChange={(e) => update({ sound: e.target.checked })} />
        </label>
        <label className="setting">
          <span>
            Demo speed <small>timers run 10× faster</small>
          </span>
          <input type="checkbox" className="toggle" checked={state.demoSpeed} onChange={(e) => update({ demoSpeed: e.target.checked })} />
        </label>
      </section>

      <h3 className="section-title">Demo tools</h3>
      <section className="card demo">
        <p>Trying Glowup for a review? Skip the waiting and see streaks, levels and unlocks in action.</p>
        <div className="demo-grid">
          <Button small variant="white" onClick={() => demo.backfill(6)}>
            🔥 Add 6 past days
          </Button>
          <Button small variant="white" onClick={() => demo.nextDay()}>
            📅 Jump to tomorrow
          </Button>
          <Button small variant="white" onClick={() => demo.boost(250)}>
            ⚡ +250 XP
          </Button>
          <Button small variant="white" onClick={() => update({ demoSpeed: !state.demoSpeed })}>
            ⏩ Speed {state.demoSpeed ? 'on' : 'off'}
          </Button>
        </div>
        {state.dayOffset > 0 && <p className="tiny-note">Time-travelled {state.dayOffset} day(s) into the future.</p>}
      </section>

      <h3 className="section-title">How XP works</h3>
      <section className="card howto">
        <p>
          <b>XP = minutes × 8 × difficulty + {COMPLETION_BONUS} for finishing.</b> Easy ×1, Medium ×1.5, Hard ×2.2.
        </p>
        <p>Any activity keeps your 🔥 daily streak alive. Unwind activities also build your 🌙 wind-down streak.</p>
        <p>
          Levels: L2 at {levelStart(2)} XP, L3 at {levelStart(3)}, L5 at {levelStart(5)}, L10 at {levelStart(10).toLocaleString()}.
        </p>
        <p>Your progress is saved privately on this device. No account needed.</p>
      </section>

      <div className="me-footer">
        <Pip mood="happy" size={70} />
        {confirmReset ? (
          <div className="reset-confirm">
            <span>Erase everything?</span>
            <Button small variant="red" onClick={demo.reset}>
              Yes, reset
            </Button>
            <Button small variant="white" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <button className="link-btn danger" onClick={() => setConfirmReset(true)}>
            Reset all progress
          </button>
        )}
      </div>
    </div>
  )
}
