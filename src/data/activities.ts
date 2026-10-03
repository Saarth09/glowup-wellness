import type { Category } from './items'

export type Pose = 'idle' | 'cheer' | 'yoga' | 'tree' | 'sit' | 'wave' | 'sleep' | 'reach'
export type Anim = 'bob' | 'bounce' | 'sway' | 'squat' | 'jump' | 'breathe' | 'still'
export type Kind = 'steps' | 'breath' | 'story' | 'sound' | 'journal'
export type Difficulty = 1 | 2 | 3

export interface Step {
  text: string
  seconds: number
  pose?: Pose
  anim?: Anim
}

export interface Activity {
  id: string
  category: Category
  title: string
  emoji: string
  difficulty: Difficulty
  minutes: number
  durations?: number[]
  blurb: string
  kind: Kind
  steps?: Step[]
  breath?: { inhale: number; hold: number; exhale: number; hold2: number }
  sound?: 'rain' | 'waves'
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
const DIFFICULTY_MULT: Record<Difficulty, number> = { 1: 1, 2: 1.5, 3: 2.2 }
export const COMPLETION_BONUS = 10

export function xpFor(difficulty: Difficulty, minutes: number): number {
  return Math.round(minutes * 8 * DIFFICULTY_MULT[difficulty]) + COMPLETION_BONUS
}

export const CATEGORY_INFO: Record<Category, { name: string; tagline: string; color: string; dark: string; light: string; emoji: string }> = {
  move: { name: 'Move', tagline: 'Stretch, flow & sweat a little', color: '#58CC02', dark: '#46A302', light: '#D7FFB8', emoji: '🤸' },
  calm: { name: 'Calm', tagline: 'Breathe, pause & reset', color: '#1CB0F6', dark: '#1899D6', light: '#DDF4FF', emoji: '🧘' },
  unwind: { name: 'Unwind', tagline: 'One slow thing before sleep', color: '#8B6CF6', dark: '#6F52D9', light: '#EEE8FF', emoji: '🌙' },
}

export const ACTIVITIES: Activity[] = [
  // ---------- MOVE ----------
  {
    id: 'wakeup', category: 'move', title: 'Wake-up Stretch', emoji: '🌤️', difficulty: 1, minutes: 2, kind: 'steps',
    blurb: 'A gentle full-body stretch to shake off the sleepies.',
    steps: [
      { text: 'Stand tall. Roll your shoulders back 5 times.', seconds: 20, pose: 'idle', anim: 'sway' },
      { text: 'Reach both arms up high and stretch toward the ceiling.', seconds: 25, pose: 'reach', anim: 'breathe' },
      { text: 'Lean gently to the left… and hold.', seconds: 20, pose: 'reach', anim: 'sway' },
      { text: 'Now lean to the right… and hold.', seconds: 20, pose: 'reach', anim: 'sway' },
      { text: 'Slowly roll down into a forward fold. Let your head hang.', seconds: 35, pose: 'idle', anim: 'squat' },
    ],
  },
  {
    id: 'desk', category: 'move', title: 'Desk Reset', emoji: '💻', difficulty: 1, minutes: 3, kind: 'steps',
    blurb: 'Undo the laptop hunch in three minutes flat.',
    steps: [
      { text: 'Circle your wrists 10 times each way.', seconds: 25, pose: 'idle', anim: 'bob' },
      { text: 'Clasp your hands behind you and open your chest.', seconds: 30, pose: 'idle', anim: 'breathe' },
      { text: 'Slow neck rolls — ear to shoulder, chin to chest.', seconds: 35, pose: 'idle', anim: 'sway' },
      { text: 'Seated twist to the left, hold the chair back.', seconds: 30, pose: 'sit', anim: 'sway' },
      { text: 'Seated twist to the right.', seconds: 30, pose: 'sit', anim: 'sway' },
      { text: 'Shrug shoulders up to your ears… and drop. x5', seconds: 30, pose: 'cheer', anim: 'bounce' },
    ],
  },
  {
    id: 'tree', category: 'move', title: 'Tree Pose Balance', emoji: '🌳', difficulty: 2, minutes: 2, kind: 'steps',
    blurb: 'Find your wobble, then find your balance.',
    steps: [
      { text: 'Stand on your left foot. Place your right foot on your calf or thigh.', seconds: 15, pose: 'tree', anim: 'sway' },
      { text: 'Hands together above your head. Hold steady!', seconds: 40, pose: 'tree', anim: 'sway' },
      { text: 'Switch! Stand on your right foot.', seconds: 15, pose: 'tree', anim: 'sway' },
      { text: 'Hands up, eyes on one spot. Hold!', seconds: 40, pose: 'tree', anim: 'sway' },
      { text: 'Shake it out. You stayed rooted 🌱', seconds: 10, pose: 'cheer', anim: 'bounce' },
    ],
  },
  {
    id: 'squats', category: 'move', title: '20 Squat Challenge', emoji: '🍑', difficulty: 2, minutes: 2, kind: 'steps',
    blurb: 'Twenty squats, two rounds, zero excuses.',
    steps: [
      { text: 'Feet hip-width, arms out in front. Ready?', seconds: 10, pose: 'idle', anim: 'bob' },
      { text: 'Round 1: 10 slow squats. Sit back like there\'s a chair.', seconds: 40, pose: 'reach', anim: 'squat' },
      { text: 'Quick breather. Shake your legs.', seconds: 20, pose: 'idle', anim: 'bounce' },
      { text: 'Round 2: 10 more squats. Chest proud!', seconds: 40, pose: 'reach', anim: 'squat' },
      { text: 'Done! Stand tall and breathe.', seconds: 10, pose: 'cheer', anim: 'bounce' },
    ],
  },
  {
    id: 'hips', category: 'move', title: 'Hip Mobility Flow', emoji: '🦋', difficulty: 2, minutes: 5, kind: 'steps',
    blurb: 'Open up tight hips from all that sitting.',
    steps: [
      { text: 'Big hip circles, 10 each direction.', seconds: 40, pose: 'idle', anim: 'sway' },
      { text: 'Sit down. Butterfly stretch — soles of feet together.', seconds: 50, pose: 'sit', anim: 'breathe' },
      { text: 'Low lunge, left leg forward. Sink your hips.', seconds: 45, pose: 'reach', anim: 'squat' },
      { text: 'Low lunge, right leg forward.', seconds: 45, pose: 'reach', anim: 'squat' },
      { text: '90/90 sit — rotate knees side to side slowly.', seconds: 60, pose: 'sit', anim: 'sway' },
      { text: 'Happy baby or just lie back and breathe.', seconds: 60, pose: 'sit', anim: 'breathe' },
    ],
  },
  {
    id: 'sunsal', category: 'move', title: 'Sun Salutation', emoji: '☀️', difficulty: 2, minutes: 4, kind: 'steps',
    blurb: 'The classic yoga flow, one breath per move.',
    steps: [
      { text: 'Mountain pose. Hands at heart.', seconds: 20, pose: 'idle', anim: 'breathe' },
      { text: 'Inhale, sweep arms up overhead.', seconds: 20, pose: 'yoga', anim: 'breathe' },
      { text: 'Exhale, fold forward.', seconds: 25, pose: 'idle', anim: 'squat' },
      { text: 'Step back to plank, lower down slowly.', seconds: 30, pose: 'reach', anim: 'still' },
      { text: 'Cobra — lift your chest, shoulders soft.', seconds: 30, pose: 'reach', anim: 'breathe' },
      { text: 'Downward dog. Pedal your feet.', seconds: 40, pose: 'reach', anim: 'sway' },
      { text: 'Step forward, rise up, arms overhead.', seconds: 35, pose: 'yoga', anim: 'breathe' },
      { text: 'Hands to heart. Beautiful. ☀️', seconds: 40, pose: 'idle', anim: 'breathe' },
    ],
  },
  {
    id: 'plank', category: 'move', title: 'Plank Ladder', emoji: '🪵', difficulty: 3, minutes: 3, kind: 'steps',
    blurb: 'Climb the ladder: 20s, 30s, 40s planks.',
    steps: [
      { text: 'Forearm plank — 20 seconds. Belly tight!', seconds: 20, pose: 'reach', anim: 'still' },
      { text: 'Rest on your knees.', seconds: 20, pose: 'sit', anim: 'breathe' },
      { text: 'Plank — 30 seconds. You\'ve got this.', seconds: 30, pose: 'reach', anim: 'still' },
      { text: 'Rest.', seconds: 20, pose: 'sit', anim: 'breathe' },
      { text: 'Final plank — 40 seconds! Breathe through it.', seconds: 40, pose: 'reach', anim: 'still' },
      { text: 'Collapse dramatically. You earned it. 🏆', seconds: 50, pose: 'cheer', anim: 'bounce' },
    ],
  },
  {
    id: 'hiit', category: 'move', title: 'Mini HIIT Party', emoji: '🔥', difficulty: 3, minutes: 7, kind: 'steps',
    blurb: '30 seconds on, 15 off. Get that heart pumping.',
    steps: [
      { text: 'Jumping jacks!', seconds: 30, pose: 'cheer', anim: 'jump' },
      { text: 'Rest', seconds: 15, pose: 'idle', anim: 'breathe' },
      { text: 'High knees!', seconds: 30, pose: 'wave', anim: 'jump' },
      { text: 'Rest', seconds: 15, pose: 'idle', anim: 'breathe' },
      { text: 'Squat jumps!', seconds: 30, pose: 'cheer', anim: 'jump' },
      { text: 'Rest', seconds: 15, pose: 'idle', anim: 'breathe' },
      { text: 'Mountain climbers!', seconds: 30, pose: 'reach', anim: 'bounce' },
      { text: 'Rest', seconds: 15, pose: 'idle', anim: 'breathe' },
      { text: 'Round 2 — jumping jacks!', seconds: 30, pose: 'cheer', anim: 'jump' },
      { text: 'Rest', seconds: 15, pose: 'idle', anim: 'breathe' },
      { text: 'Skaters side to side!', seconds: 30, pose: 'wave', anim: 'sway' },
      { text: 'Rest', seconds: 15, pose: 'idle', anim: 'breathe' },
      { text: 'Burpees (or step-backs)!', seconds: 30, pose: 'cheer', anim: 'jump' },
      { text: 'Rest', seconds: 15, pose: 'idle', anim: 'breathe' },
      { text: 'Final push — fast feet!', seconds: 30, pose: 'wave', anim: 'jump' },
      { text: 'Cool down. Walk it out and breathe.', seconds: 75, pose: 'idle', anim: 'sway' },
    ],
  },
  {
    id: 'warrior', category: 'move', title: 'Warrior Flow', emoji: '⚔️', difficulty: 3, minutes: 8, kind: 'steps',
    blurb: 'Strong, steady standing yoga for brave days.',
    steps: [
      { text: 'Mountain pose. Ground through your feet.', seconds: 40, pose: 'idle', anim: 'breathe' },
      { text: 'Warrior I, left leg forward. Arms high.', seconds: 60, pose: 'yoga', anim: 'still' },
      { text: 'Warrior II — open arms wide, gaze forward.', seconds: 60, pose: 'reach', anim: 'still' },
      { text: 'Reverse warrior — lean back, reach up.', seconds: 50, pose: 'yoga', anim: 'sway' },
      { text: 'Switch sides. Warrior I, right leg forward.', seconds: 60, pose: 'yoga', anim: 'still' },
      { text: 'Warrior II.', seconds: 60, pose: 'reach', anim: 'still' },
      { text: 'Reverse warrior.', seconds: 50, pose: 'yoga', anim: 'sway' },
      { text: 'Chair pose — sit back, arms up. Hold!', seconds: 40, pose: 'yoga', anim: 'squat' },
      { text: 'Child\'s pose. Rest and breathe.', seconds: 60, pose: 'sit', anim: 'breathe' },
    ],
  },

  // ---------- CALM ----------
  {
    id: 'box', category: 'calm', title: 'Box Breathing', emoji: '🟦', difficulty: 1, minutes: 2, durations: [1, 2, 4], kind: 'breath',
    blurb: 'In 4, hold 4, out 4, hold 4. Used by athletes & astronauts.',
    breath: { inhale: 4, hold: 4, exhale: 4, hold2: 4 },
  },
  {
    id: 'mindful1', category: 'calm', title: 'Mindful Minute', emoji: '🫧', difficulty: 1, minutes: 1, kind: 'steps',
    blurb: 'Sixty seconds of just… being here.',
    steps: [
      { text: 'Get comfy. Let your shoulders drop.', seconds: 12, pose: 'sit', anim: 'breathe' },
      { text: 'Notice the air moving in and out of your nose.', seconds: 16, pose: 'sit', anim: 'breathe' },
      { text: 'If your mind wanders, that\'s okay. Gently come back.', seconds: 16, pose: 'sit', anim: 'breathe' },
      { text: 'One more slow breath. Smile a tiny bit.', seconds: 16, pose: 'sit', anim: 'breathe' },
    ],
  },
  {
    id: 'ground', category: 'calm', title: '5-4-3-2-1 Grounding', emoji: '🖐️', difficulty: 1, minutes: 3, kind: 'steps',
    blurb: 'A senses game that pulls you out of spiralling thoughts.',
    steps: [
      { text: 'Look around. Name 5 things you can SEE.', seconds: 40, pose: 'sit', anim: 'breathe' },
      { text: 'Notice 4 things you can FEEL — your feet, your clothes…', seconds: 40, pose: 'sit', anim: 'breathe' },
      { text: 'Listen for 3 things you can HEAR.', seconds: 35, pose: 'sit', anim: 'breathe' },
      { text: 'Find 2 things you can SMELL.', seconds: 30, pose: 'sit', anim: 'breathe' },
      { text: 'Notice 1 thing you can TASTE.', seconds: 20, pose: 'sit', anim: 'breathe' },
      { text: 'Take a deep breath. You\'re here. You\'re okay.', seconds: 15, pose: 'sit', anim: 'breathe' },
    ],
  },
  {
    id: '478', category: 'calm', title: '4-7-8 Breath', emoji: '🌬️', difficulty: 2, minutes: 3, durations: [2, 3, 5], kind: 'breath',
    blurb: 'A long, slow exhale that tells your body it\'s safe.',
    breath: { inhale: 4, hold: 7, exhale: 8, hold2: 0 },
  },
  {
    id: 'bodyscan', category: 'calm', title: 'Body Scan', emoji: '✨', difficulty: 2, minutes: 5, durations: [3, 5, 8], kind: 'steps',
    blurb: 'Travel from toes to head, softening as you go.',
    steps: [
      { text: 'Close your eyes. Take three slow breaths.', seconds: 30, pose: 'sit', anim: 'breathe' },
      { text: 'Bring attention to your feet and toes. Let them soften.', seconds: 35, pose: 'sit', anim: 'breathe' },
      { text: 'Move up to your calves and knees. Release any tension.', seconds: 35, pose: 'sit', anim: 'breathe' },
      { text: 'Your hips and lower back. Let them feel heavy.', seconds: 35, pose: 'sit', anim: 'breathe' },
      { text: 'Your belly rises and falls. Nothing to fix.', seconds: 35, pose: 'sit', anim: 'breathe' },
      { text: 'Your hands, arms, and shoulders. Let them melt.', seconds: 40, pose: 'sit', anim: 'breathe' },
      { text: 'Your jaw, your cheeks, the space between your eyebrows.', seconds: 40, pose: 'sit', anim: 'breathe' },
      { text: 'Feel your whole body at once. Rest here.', seconds: 30, pose: 'sit', anim: 'breathe' },
    ],
  },
  {
    id: 'kindness', category: 'calm', title: 'Loving Kindness', emoji: '💗', difficulty: 2, minutes: 4, kind: 'steps',
    blurb: 'Send good vibes to yourself, then the world.',
    steps: [
      { text: 'Hand on heart. Breathe in slowly.', seconds: 30, pose: 'sit', anim: 'breathe' },
      { text: 'Silently say: "May I be happy. May I be at ease."', seconds: 45, pose: 'sit', anim: 'breathe' },
      { text: 'Picture someone you love. "May you be happy."', seconds: 45, pose: 'sit', anim: 'breathe' },
      { text: 'Picture someone neutral — a barista, a neighbour. Same wish.', seconds: 45, pose: 'sit', anim: 'breathe' },
      { text: 'Now everyone, everywhere. "May all beings be at ease."', seconds: 45, pose: 'sit', anim: 'breathe' },
      { text: 'Notice how you feel. 💗', seconds: 30, pose: 'sit', anim: 'breathe' },
    ],
  },
  {
    id: 'focus', category: 'calm', title: 'Focus Flame', emoji: '🕯️', difficulty: 3, minutes: 6, durations: [4, 6, 10], kind: 'steps',
    blurb: 'Count breaths to ten without losing count. Harder than it sounds.',
    steps: [
      { text: 'Sit upright. Soft gaze at a single point.', seconds: 40, pose: 'sit', anim: 'still' },
      { text: 'Count each exhale: one… two… up to ten.', seconds: 60, pose: 'sit', anim: 'breathe' },
      { text: 'Lost count? No drama. Start again at one.', seconds: 60, pose: 'sit', anim: 'breathe' },
      { text: 'Keep going. Notice the pause after each exhale.', seconds: 60, pose: 'sit', anim: 'breathe' },
      { text: 'Let the counting go. Just watch the breath.', seconds: 60, pose: 'sit', anim: 'breathe' },
      { text: 'Slowly open your eyes. Sharp and steady. 🕯️', seconds: 80, pose: 'sit', anim: 'breathe' },
    ],
  },

  // ---------- UNWIND ----------
  {
    id: 'story', category: 'unwind', title: 'The Lighthouse Cat', emoji: '🐈', difficulty: 1, minutes: 5, kind: 'story',
    blurb: 'A slow, sleepy story. No cliffhangers, promise.',
  },
  {
    id: 'rain', category: 'unwind', title: 'Rain on the Window', emoji: '🌧️', difficulty: 1, minutes: 5, kind: 'sound', sound: 'rain',
    blurb: 'Soft rain sounds and a very slow breathing guide.',
  },
  {
    id: 'waves', category: 'unwind', title: 'Ocean Drift', emoji: '🌊', difficulty: 1, minutes: 5, kind: 'sound', sound: 'waves',
    blurb: 'Waves rolling in… and out… and in.',
  },
  {
    id: 'gratitude', category: 'unwind', title: 'Three Good Things', emoji: '📓', difficulty: 1, minutes: 3, kind: 'journal',
    blurb: 'Write down three small good things from today.',
  },
  {
    id: 'moonscan', category: 'unwind', title: 'Moonlight Body Scan', emoji: '🌙', difficulty: 1, minutes: 5, kind: 'steps',
    blurb: 'Lie down and let each part of you fall asleep first.',
    steps: [
      { text: 'Lie down. Let the bed hold all of your weight.', seconds: 40, pose: 'sleep', anim: 'breathe' },
      { text: 'Your toes are falling asleep… let them go.', seconds: 40, pose: 'sleep', anim: 'breathe' },
      { text: 'Your legs feel heavy and warm.', seconds: 40, pose: 'sleep', anim: 'breathe' },
      { text: 'Your belly softens with every breath.', seconds: 40, pose: 'sleep', anim: 'breathe' },
      { text: 'Your arms are heavy. Your hands are still.', seconds: 40, pose: 'sleep', anim: 'breathe' },
      { text: 'Your face relaxes. Your thoughts slow down.', seconds: 50, pose: 'sleep', anim: 'breathe' },
      { text: 'Nothing left to do today. Drift…', seconds: 50, pose: 'sleep', anim: 'breathe' },
    ],
  },
  {
    id: 'sleepy478', category: 'unwind', title: 'Sleepy 4-7-8', emoji: '😴', difficulty: 1, minutes: 4, kind: 'breath',
    blurb: 'The breathing pattern made for falling asleep.',
    breath: { inhale: 4, hold: 7, exhale: 8, hold2: 0 },
  },
]

export const ACTIVITY_BY_ID: Record<string, Activity> = Object.fromEntries(ACTIVITIES.map((a) => [a.id, a]))

export const STORY = [
  'Once upon a time, on a quiet island, there was a small white lighthouse.',
  'And in the lighthouse lived a round, sleepy cat named Biscuit.',
  'Every evening, Biscuit climbed the spiral stairs. Slowly. One step… at a time.',
  'At the top, the great lamp hummed softly, warm as a cup of tea.',
  'Biscuit curled up beside it and watched the sea turn from blue… to grey… to silver.',
  'Far away, a little fishing boat was heading home. Its lantern bobbed gently.',
  'The lamp turned, and turned, and turned, drawing slow circles of light on the water.',
  'Biscuit\'s eyes followed the light. Around… and around… and around.',
  'The waves below whispered against the rocks. Shhh… shhh… shhh.',
  'The little boat reached the harbour. Its lantern blinked out. Everyone was safe.',
  'Biscuit stretched one paw, then the other, and tucked her nose under her tail.',
  'The stars came out, one by one, like someone lighting tiny candles.',
  'There was nothing left to watch over. The lamp would keep turning on its own.',
  'Biscuit let out a long, slow breath… and closed her eyes.',
  'And so can you. Goodnight. 🌙',
]
