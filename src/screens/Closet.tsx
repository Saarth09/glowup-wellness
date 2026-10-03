import { Avatar } from '../components/Avatar'
import { Customizer } from '../components/Customizer'
import { ITEMS } from '../data/items'
import { unlockedIds } from '../lib/game'
import type { Game } from '../lib/store'
import { TopBar } from './Home'

export function Closet({ game }: { game: Game }) {
  const { state, stats, update } = game
  const unlocked = unlockedIds(stats)

  return (
    <div className="screen closet">
      <TopBar game={game} />
      <div className="closet-stage">
        <Avatar config={state.avatar} pose="wave" />
        <div className="closet-count">
          👗 {unlocked.length} / {ITEMS.length} unlocked
        </div>
      </div>
      <Customizer config={state.avatar} onChange={(avatar) => update({ avatar })} stats={stats} seen={state.seen} />
    </div>
  )
}
