import { useState } from 'react'
import { Avatar } from '../components/Avatar'
import { Customizer } from '../components/Customizer'
import { Button, Pip, Speech } from '../components/ui'
import { HAIR_COLORS, ITEMS, SKIN_TONES, type AvatarConfig, type Slot } from '../data/items'
import type { Game } from '../lib/store'

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

function shuffle(c: AvatarConfig): AvatarConfig {
  const free = (s: Slot) => ITEMS.filter((i) => i.slot === s && !i.unlock).map((i) => i.id)
  return {
    ...c,
    skin: pick(SKIN_TONES),
    hairColor: pick(HAIR_COLORS),
    hair: pick(free('hair')),
    top: pick(free('top')),
    bottom: pick(free('bottom')),
    shoes: pick(free('shoes')),
    accessory: pick(free('accessory')),
    background: pick(free('background')),
  }
}

export function Onboarding({ game }: { game: Game }) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<AvatarConfig>(game.state.avatar)

  const finish = () => game.update({ onboarded: true, name: name.trim() || 'Friend', avatar })

  return (
    <div className="onboarding">
      <div className="ob-progress">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i <= step ? 'on' : ''} />
        ))}
      </div>

      {step === 0 && (
        <div className="ob-step ob-center">
          <div className="logo">glowup</div>
          <div className="ob-pip">
            <Speech tail="bottom">Hi! I'm Pip 👋 Let's make taking care of yourself feel like a game.</Speech>
            <Pip mood="wave" size={150} />
          </div>
          <p className="ob-sub">Move, breathe and wind down to earn XP, build streaks and dress up a character that's all yours.</p>
          <div className="ob-actions">
            <Button block onClick={() => setStep(1)}>Get started</Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="ob-step ob-center">
          <div className="ob-pip">
            <Speech tail="bottom">First things first — what should I call you?</Speech>
            <Pip mood="happy" size={120} />
          </div>
          <input
            className="text-input"
            autoFocus
            maxLength={16}
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(2)}
          />
          <div className="ob-actions">
            <Button block disabled={!name.trim()} onClick={() => setStep(2)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="ob-step">
          <h2 className="ob-title">Make your character</h2>
          <p className="ob-sub small">This is you! Earn XP to unlock way more outfits later.</p>
          <div className="ob-avatar">
            <Avatar config={avatar} pose="wave" />
            <button className="shuffle" onClick={() => setAvatar(shuffle(avatar))} aria-label="Randomise">🎲</button>
          </div>
          <Customizer config={avatar} onChange={setAvatar} />
          <div className="ob-actions sticky">
            <Button block onClick={() => setStep(3)}>Looking good!</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="ob-step ob-center">
          <h2 className="ob-title">Here's the game, {name.trim() || 'friend'}</h2>
          <div className="loop">
            {[
              ['🤸', 'Do a Move, Calm or Unwind activity'],
              ['⚡', 'Earn XP — harder & longer = more'],
              ['🔥', 'Show up daily to build your streak'],
              ['🎁', 'Unlock clothes, shoes & worlds'],
              ['✨', 'Glow up your character'],
            ].map(([e, t], i) => (
              <div key={i} className="loop-row" style={{ animationDelay: `${i * 0.12}s` }}>
                <span className="loop-emoji">{e}</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="ob-actions">
            <Button block onClick={finish}>Let's glow!</Button>
          </div>
        </div>
      )}
    </div>
  )
}
