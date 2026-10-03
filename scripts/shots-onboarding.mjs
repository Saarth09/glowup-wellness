import { chromium } from 'playwright-core'

const url = process.argv[2] ?? 'http://localhost:5180/'
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage({ viewport: { width: 420, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
const shot = (n) => page.screenshot({ path: `screenshots/${n}.png` })
const click = (t) => page.getByText(t, { exact: false }).first().click()

await page.goto(url)
await page.waitForTimeout(800)
await shot('01-welcome')
await click('Get started')
await page.fill('input', 'Neeharika')
await click('Continue')
await page.waitForTimeout(400)
await shot('02-create')
await click('Looking good')
await page.waitForTimeout(400)
await shot('03-loop')
await click("Let's glow")
await page.waitForTimeout(500)
await shot('04-home')
await page.screenshot({ path: 'screenshots/04b-home-full.png', fullPage: true })

// Move path
await page.locator('.cat-move').click()
await page.waitForTimeout(400)
await page.screenshot({ path: 'screenshots/05-move.png', fullPage: true })
await page.locator('.path-node').nth(2).click()
await page.waitForTimeout(500)
await shot('06-sheet')
await page.locator('.act-sheet .btn').click()
await page.waitForTimeout(1200)
await shot('07-player')
// speed up & finish
await page.locator('.speed').click()
await page.waitForTimeout(14000)
await shot('08-reward')
for (let i = 0; i < 4; i++) {
  const b = page.locator('.rw-actions .btn')
  if (!(await b.count())) break
  await b.first().click()
  await page.waitForTimeout(600)
  await shot(`09-reward-${i}`)
}
console.log('errors', errors)
await browser.close()
