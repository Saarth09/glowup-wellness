import { useState } from 'react'
import { HAIR_COLORS, ITEMS, SKIN_TONES, SLOT_LABELS, describeUnlock, type AvatarConfig, type Item, type Slot } from '../data/items'
import { isUnlocked, unlockProgress, type Stats } from '../lib/game'
import { sfx } from '../lib/sound'
import { Avatar } from './Avatar'
import { Bar } from './ui'

const SLOTS: Slot[] = ['hair', 'top', 'bottom', 'shoes', 'accessory', 'background']

interface Props {
  config: AvatarConfig
  onChange: (c: AvatarConfig) => void
  /** When omitted, only starter items are shown (onboarding). */
  stats?: Stats
  seen?: string[]
}

export function Customizer({ config, onChange, stats, seen }: Props) {
  const [slot, setSlot] = useState<Slot>('hair')
  const items = ITEMS.filter((i) => i.slot === slot && (stats || !i.unlock))

  const equip = (item: Item) => {
    sfx.step()
    onChange({ ...config, [item.slot]: item.id })
  }

  const newIn = (s: Slot) =>
    stats && seen ? ITEMS.some((i) => i.slot === s && i.unlock && isUnlocked(i, stats) && !seen.includes(i.id)) : false

  return (
    <div className="customizer">
      <div className="slot-tabs" role="tablist">
        {SLOTS.map((s) => (
          <button key={s} role="tab" aria-selected={slot === s} className={`slot-tab ${slot === s ? 'active' : ''}`} onClick={() => setSlot(s)}>
            {SLOT_LABELS[s]}
            {newIn(s) && <span className="dot" />}
          </button>
        ))}
      </div>

      {slot === 'hair' && (
        <div className="swatch-rows">
          <div className="swatch-row">
            <span className="swatch-label">Skin</span>
            {SKIN_TONES.map((c) => (
              <button
                key={c}
                aria-label={`Skin tone ${c}`}
                className={`swatch ${config.skin === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => onChange({ ...config, skin: c })}
              />
            ))}
          </div>
          <div className="swatch-row">
            <span className="swatch-label">Hair</span>
            {HAIR_COLORS.map((c) => (
              <button
                key={c}
                aria-label={`Hair colour ${c}`}
                className={`swatch ${config.hairColor === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => onChange({ ...config, hairColor: c })}
              />
            ))}
          </div>
        </div>
      )}

      <div className="item-grid">
        {items.map((item) => {
          const unlocked = !stats || isUnlocked(item, stats)
          const equipped = config[item.slot] === item.id
          const preview = { ...config, [item.slot]: item.id }
          const isNew = stats && seen && item.unlock && unlocked && !seen.includes(item.id)
          const prog = stats && item.unlock && !unlocked ? unlockProgress(item.unlock, stats) : null
          return (
            <button
              key={item.id}
              className={`item-tile ${equipped ? 'equipped' : ''} ${unlocked ? '' : 'locked'}`}
              onClick={() => unlocked && equip(item)}
              aria-disabled={!unlocked}
              title={item.unlock && !unlocked ? describeUnlock(item.unlock) : item.name}
            >
              {isNew && <span className="new-badge">NEW</span>}
              <div className="item-preview">
                <Avatar config={preview} showBg={slot === 'background'} anim="still" />
              </div>
              <div className="item-name">{item.name}</div>
              {prog && item.unlock && (
                <div className="item-lock">
                  <span>🔒 {describeUnlock(item.unlock)}</span>
                  <Bar value={prog.have} max={prog.need} height={8} color="#FFC800" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
