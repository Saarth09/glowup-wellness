import { chromium } from 'playwright-core'

const url = process.argv[2] ?? 'http://localhost:5180/'
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 420, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
const shot = (n, full = false) => page.screenshot({ path: `screenshots/${n}.png`, fullPage: full })

const day = (o) => {
  const d = new Date()
  d.setDate(d.getDate() + o)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const log = []
let n = 0
for (let i = 9; i >= 1; i--) {
  for (const [cat, a] of [['move', 'hiit'], ['calm', 'box'], ['unwind', 'story']]) {
    log.push({ id: `x${n++}`, activityId: a, cat, xp: 70, minutes: 5, day: day(-i), ts: Date.now() - i * 864e5 })
  }
}
const avatars = [
  { skin: '#F7C9A6', hairColor: '#2B2118', hair: 'long', top: 'tee', bottom: 'skirt', shoes: 'boots', accessory: 'horns', background: 'burst' },
  { skin: '#8F5A32', hairColor: '#F49AC1', hair: 'curly', top: 'hoodie', bottom: 'joggers', shoes: 'hightops', accessory: 'headphones', background: 'meadow' },
  { skin: '#FFE0CC', hairColor: '#5B3A29', hair: 'bob', top: 'sweater', bottom: 'plaid', shoes: 'loafers', accessory: 'flower', background: 'sunset' },
  { skin: '#C98A55', hairColor: '#8C8FFF', hair: 'buns', top: 'startop', bottom: 'leggings', shoes: 'rocket', accessory: 'crown', background: 'galaxy' },
  { skin: '#E9AC80', hairColor: '#A9532B', hair: 'ponytail', top: 'jersey', bottom: 'shorts', shoes: 'sneakers', accessory: 'catears', background: 'rainbowbg' },
  { skin: '#5E3B22', hairColor: '#E8E4DC', hair: 'short', top: 'pj', bottom: 'pjpants', shoes: 'slippers', accessory: 'mask', background: 'night' },
  { skin: '#F7C9A6', hairColor: '#5FC9A8', hair: 'long', top: 'rainbow', bottom: 'skirt', shoes: 'boots', accessory: 'halo', background: 'mint' },
  { skin: '#FFE0CC', hairColor: '#EBC57C', hair: 'short', top: 'tank', bottom: 'shorts', shoes: 'sneakers', accessory: 'glasses', background: 'sky' },
]
const state = (avatar, extra = {}) => ({
  onboarded: true, name: 'Neeharika', avatar, log, seen: [], dayOffset: 0, demoSpeed: true, sound: false, unwindSwap: null, ...extra,
})

await page.goto(url)
for (let i = 0; i < avatars.length; i++) {
  await page.evaluate((s) => localStorage.setItem('glowup-state-v1', JSON.stringify(s)), state(avatars[i]))
  await page.reload()
  await page.waitForTimeout(300)
  await page.locator('.hero-avatar').screenshot({ path: `screenshots/av-${i}.png` })
}
await page.evaluate((s) => localStorage.setItem('glowup-state-v1', JSON.stringify(s)), state(avatars[1]))
await page.reload()
await page.waitForTimeout(400)
await shot('20-home-adv')
await page.locator('.nav-btn').nth(1).click()
await page.waitForTimeout(400)
await shot('21-closet')
await page.getByText('Tops', { exact: true }).click()
await page.waitForTimeout(300)
await shot('21b-closet-tops', true)
await page.locator('.nav-btn').nth(2).click()
await page.waitForTimeout(400)
await shot('22-progress', true)
await page.locator('.nav-btn').nth(3).click()
await page.waitForTimeout(400)
await shot('23-me', true)
await page.locator('.nav-btn').nth(0).click()
await page.locator('.cat-unwind').click()
await page.waitForTimeout(500)
await shot('24-unwind', true)
await page.locator('.unwind .btn').click()
await page.waitForTimeout(4000)
await shot('25-unwind-player')
// breathing via calm
await page.goto(url)
await page.waitForTimeout(300)
await page.locator('.mood').nth(1).click()
await page.waitForTimeout(400)
await shot('26-mood-sheet')
await page.locator('.act-sheet .btn').click()
await page.waitForTimeout(2500)
await shot('27-breath')
await page.goto(url)
await page.locator('.cat-calm').click()
await page.waitForTimeout(300)
await page.locator('.path-node').nth(1).click()
await page.locator('.act-sheet .btn').click()
await page.waitForTimeout(1500)
await shot('28-calm-steps')
console.log('errors', errors)
await browser.close()
