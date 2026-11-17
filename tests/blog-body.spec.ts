import { test, expect, type Page } from '@playwright/test'
import { renderBlogBody } from '../src/lib/sanity/blog-body'
import { articleBody, FIXTURE_SLUG, LARGE_REF, PHOTO_ALT, PHOTO_CAPTION, SMALL_REF, textBlock } from './support/blog-fixtures'

const articlePath = `/blog/${FIXTURE_SLUG}`

async function localImages(page: Page) {
  await page.route('https://cdn.sanity.io/images/**', async (route) => {
    const url = new URL(route.request().url())
    const original = /-(\d+)x(\d+)\./.exec(url.pathname)!
    const rect = url.searchParams.get('rect')?.split(',').map(Number)
    const width = Number(url.searchParams.get('w') ?? original[1])
    const ratio = rect ? rect[2] / rect[3] : Number(original[1]) / Number(original[2])
    await route.fulfill({
      contentType: 'image/svg+xml',
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${Math.round(width / ratio)}"><rect width="100%" height="100%" fill="#f3ecd9"/><text x="20" y="40" fill="#171616" font-size="20">Local photo fixture</text></svg>`,
    })
  })
}

async function expectLanding(page: Page, id: string) {
  await expect.poll(() => page.evaluate((targetId) => {
    const target = document.getElementById(targetId)!
    const nav = document.querySelector('.nav-wrap')!
    const top = target.getBoundingClientRect().top
    const clearance = top - nav.getBoundingClientRect().bottom
    return { visible: top < 125, clear: clearance >= 16 }
  }, id)).toEqual({ visible: true, clear: true })
}

test.describe('article body renderer', () => {
  test('creates matching contents and headings while retaining marks', () => {
    const { html, contents } = renderBlogBody(articleBody())
    expect(contents.map(({ level, text }) => [level, text])).toEqual([
      [2, 'Start here!'],
      [3, 'Bring your documents & a plan'],
      [2, 'Start here!'],
      [2, '到达加拿大：第一步'],
      [3, '!!!'],
      [2, '<script>window.injected=true</script> " & <img src=x onerror=alert(1)>'],
      [3, 'A'.repeat(180)],
    ])
    expect(new Set(contents.map(({ id }) => id)).size).toBe(contents.length)
    for (const { id } of contents) expect(html).toContain(`id="${id}" tabindex="-1"`)
    expect(html).toContain('<strong><em>your documents</em></strong>')
    expect(html).toContain('<a href="https://example.com/checklist"> &amp; a plan</a>')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<img src=x')
  })

  test('keeps keyed IDs across edits, insertion and reordering without changing input', () => {
    const first = textBlock('Original title', 'h2', 'fixed')
    const second = textBlock('A different title', 'h3', 'second')
    const before = JSON.stringify([first, second])
    const initial = renderBlogBody([first, second]).contents
    const edited = renderBlogBody([textBlock('New heading', 'h2', 'new'), second, { ...first, children: textBlock('Changed title').children }]).contents
    expect(edited[1].id).toBe(initial[1].id)
    expect(edited[2].id).toBe(initial[0].id)
    expect(JSON.stringify([first, second])).toBe(before)
  })

  test('handles unkeyed duplicates, normalization, punctuation and reserved suffixes', () => {
    const blocks = [
      textBlock('Same!', 'h2'), textBlock('Same?', 'h3'), textBlock('Same 2', 'h2'),
      textBlock('日本語 中文', 'h2'), textBlock('!!!', 'h3'),
      textBlock('Café', 'h2'), textBlock('Cafe\u0301', 'h2'),
      textBlock('One', 'h2', 'key'), textBlock('Two', 'h2', 'key'), textBlock('Three', 'h2', 'key-2'),
    ]
    expect(renderBlogBody(blocks).contents.map(({ id }) => id)).toEqual([
      'heading-same', 'heading-same-3', 'heading-same-2', 'heading-日本語-中文',
      'heading-section', 'heading-café', 'heading-café-2', 'section-key', 'section-key-3', 'section-key-2',
    ])
    const listed = { ...textBlock('List heading', 'h2', 'listed'), listItem: 'bullet', level: 1 }
    expect(renderBlogBody([listed]).html).toContain('id="section-listed"')
  })

  test('returns no contents for empty, normal, H4 or whitespace-only content', () => {
    for (const body of [null, undefined, [], [textBlock('Only text')], [textBlock('Other heading', 'h4'), textBlock(' \n ', 'h2')]]) {
      expect(renderBlogBody(body).contents).toEqual([])
    }
  })

  test('builds cropped, bounded image URLs and skips invalid references', () => {
    const { html } = renderBlogBody(articleBody())
    expect(html.match(/<figure /g)).toHaveLength(3)
    expect(html).toContain('width="1680" height="1200"')
    expect(html).toContain('rect=240,200,1680,1200')
    expect(html).toContain('1440w')
    expect(html).not.toContain('1680w')
    expect(html).toContain('fit=max')
    expect(html).toContain('auto=format')
    expect(html).toContain('min(720px, calc(100vw - 3rem))')
    expect(html).toContain('loading="lazy" decoding="async"')
    expect(html).toContain('width="240" height="160" alt=""')
    expect(html).toContain('alt="A map of local services"')
    expect(html).not.toContain('window.injected=true">')
    const badRefs = ['', 'https://evil.test/photo.jpg', 'image-a-0x10-jpg', 'image-a-10x0-jpg', 'image-a-99999999999999999999x10-jpg', 'image-../a-10x10-jpg', 'image-a-10x10-jpg" onerror="alert(1)']
    for (const ref of badRefs) expect(renderBlogBody([{ _type: 'image', asset: { _ref: ref } }]).html).toBe('')
    const malformedCrop = renderBlogBody([{ _type: 'image', asset: { _ref: SMALL_REF }, crop: { left: 1, right: 1, top: 0, bottom: 0 } }]).html
    expect(malformedCrop).toContain('width="240" height="160"')
    expect(malformedCrop).not.toContain('rect=')
    const noCrop = { _type: 'image', asset: { _ref: LARGE_REF } }
    const hotspot = { ...noCrop, hotspot: { x: 0.9, y: 0.1, width: 0.1, height: 0.1 } }
    expect(renderBlogBody([hotspot]).html).toBe(renderBlogBody([noCrop]).html)
  })
})

test.describe('article contents and photos in the production page', () => {
  test.use({ extraHTTPHeaders: { 'x-blog-fixture': 'article' } })
  test.beforeEach(async ({ page }) => localImages(page))

  test('renders safe semantic contents, photos and both table formats', async ({ page }) => {
    const response = await page.goto(articlePath)
    expect(response?.status()).toBe(200)
    const contents = page.getByRole('navigation', { name: 'Table of contents' })
    const links = contents.getByRole('link')
    await expect(links).toHaveCount(7)
    await expect(page.locator('.post-contents-subsection')).toHaveCount(3)
    for (const link of await links.all()) {
      const id = decodeURIComponent((await link.getAttribute('href'))!.slice(1))
      const heading = page.locator('article :is(h2,h3)[id]').filter({ hasText: await link.innerText() })
      expect(await page.evaluate((target) => document.getElementById(target)?.textContent, id)).toBe(await link.innerText())
      expect(await heading.count()).toBeGreaterThan(0)
    }
    await expect(page.locator('#section-marked strong em')).toHaveText('your documents')
    await expect(page.locator('#section-marked a')).toHaveAttribute('href', 'https://example.com/checklist')
    const photos = page.locator('article figure')
    await expect(photos).toHaveCount(3)
    await expect(photos.first().locator('img')).toHaveAttribute('alt', PHOTO_ALT)
    await expect(photos.first().locator('figcaption')).toHaveText(PHOTO_CAPTION)
    await expect(photos.first().locator('figcaption img')).toHaveCount(0)
    await expect(photos.nth(1).locator('figcaption')).toHaveCount(0)
    await expect(photos.nth(1).locator('img')).toHaveAttribute('alt', '')
    await expect(page.locator('article table')).toHaveCount(2)
    await expect(page.locator('article table').first().locator('th').nth(1)).toHaveText('<script>window.injected=true</script>')
    await expect(page.locator('article table').nth(1).locator('td strong')).toHaveText('Marked table cell')
    await expect(page.locator('article script, article [onerror], .post-contents script')).toHaveCount(0)
    expect(await page.evaluate(() => 'injected' in window)).toBe(false)
    expect(await page.locator('.post-hero-img').getAttribute('src')).not.toContain('aaaaaaaa')
    await photos.first().scrollIntoViewIfNeeded()
    await expect.poll(() => photos.first().locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
    await page.screenshot({ path: test.info().outputPath('article-desktop.png'), fullPage: true })
  })

  test('supports keyboard links and direct non-Latin hashes below the fixed navbar', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto(articlePath)
    const links = page.getByRole('navigation', { name: 'Table of contents' }).getByRole('link')
    await links.first().focus()
    expect(await links.first().evaluate((element) => getComputedStyle(element).outlineStyle)).toBe('solid')
    await page.keyboard.press('Tab')
    await expect(links.nth(1)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#section-marked$/)
    await expect(page.locator('#section-marked')).toBeFocused()
    await expectLanding(page, 'section-marked')
    const unicodeId = 'heading-到达加拿大-第一步'
    const direct = await page.context().newPage()
    await localImages(direct)
    await direct.goto(`${articlePath}#${encodeURIComponent(unicodeId)}`)
    await expectLanding(direct, unicodeId)
    await direct.screenshot({ path: test.info().outputPath('article-direct-hash.png') })
    await direct.reload()
    await expectLanding(direct, unicodeId)
    await direct.close()
  })

  test('wraps contents and photos during a continuous resize from 320 to 1920', async ({ page }) => {
    test.setTimeout(120_000)
    await page.goto(articlePath)
    await page.evaluate(() => document.fonts.ready)
    for (const photo of await page.locator('article figure img').all()) {
      await photo.scrollIntoViewIfNeeded()
      await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
    }
    const widths = [...new Set([...Array.from({ length: 201 }, (_, index) => 320 + index * 8), 809, 810, 1399, 1400])].sort((a, b) => a - b)
    const failures: { width: number; issues: string[] }[] = []
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 })
      const issues = await page.evaluate(async () => {
        await new Promise(requestAnimationFrame)
        const problems: string[] = []
        if (document.documentElement.scrollWidth > innerWidth) problems.push('page overflow')
        for (const element of document.querySelectorAll('.post-contents, .post-contents a, article h2, article h3, article figure, article figure img, article figcaption')) {
          const rect = element.getBoundingClientRect()
          if (rect.left < -1 || rect.right > innerWidth + 1 || element.scrollWidth > element.clientWidth + 1) problems.push(`${element.tagName} overflow`)
        }
        for (const image of document.querySelectorAll<HTMLImageElement>('article figure img')) {
          const rect = image.getBoundingClientRect()
          const ratio = Number(image.getAttribute('width')) / Number(image.getAttribute('height'))
          if (Math.abs(rect.width / rect.height - ratio) > 0.01) problems.push('photo ratio changed')
          if (getComputedStyle(image).objectFit === 'cover') problems.push('photo cropped by CSS')
          if (rect.width > Number(image.getAttribute('width')) + 1) problems.push('photo upscaled')
        }
        return problems
      })
      if (issues.length) failures.push({ width, issues })
    }
    expect(failures).toEqual([])
    await page.setViewportSize({ width: 320, height: 900 })
    await page.getByRole('link', { name: 'Bring your documents & a plan', exact: true }).click()
    await expectLanding(page, 'section-marked')
    await page.screenshot({ path: test.info().outputPath('article-mobile.png') })
    await test.info().attach('resize-evidence', { body: JSON.stringify({ widths, failures }), contentType: 'application/json' })
  })

  test('keeps contents usable with reduced motion and no JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', extraHTTPHeaders: { 'x-blog-fixture': 'article' } })
    const page = await context.newPage()
    await localImages(page)
    await page.goto(articlePath)
    await page.getByRole('link', { name: 'Start here!', exact: true }).first().click()
    await expect(page).toHaveURL(/#section-start$/)
    await expectLanding(page, 'section-start')
    await context.close()
  })
})

for (const mode of ['simple', 'empty']) {
  test(`hides contents for ${mode} articles`, async ({ page }) => {
    await localImages(page)
    await page.setExtraHTTPHeaders({ 'x-blog-fixture': mode })
    await page.goto(articlePath)
    await expect(page.locator('article')).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Table of contents' })).toHaveCount(0)
    await expect(page.locator('article figure')).toHaveCount(0)
  })
}
