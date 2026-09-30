import { test, expect } from '@playwright/test';
import { searchCtaForPath } from '../src/lib/search-ctas';

const paths = [
  '/teer', '/teer/teer-3',
  '/blog/how-is-foreign-income-taxed-in-canada',
  '/blog/how-to-find-a-family-doctor-in-bc-as-a-newcomer',
  '/blog/the-easiest-skilled-jobs-to-transition-into-teer-3-for-pr-purposes-in-canada',
];

for (const path of paths) {
  test(`${path}: relevant accessible links and fluid desktop/mobile layout`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    const cta = searchCtaForPath(path)!;
    const callouts = page.locator('[data-search-cta]');
    await expect(callouts).toHaveCount(2);
    for (const placement of ['intro', 'end']) {
      const callout = page.locator(`[data-search-cta][data-placement="${placement}"]`);
      await expect(callout).toHaveAttribute('data-source-path', path);
      await expect(callout.locator('h2')).toHaveText(cta.title);
      await expect(callout.getByRole('link', { name: cta.label })).toHaveAttribute('href', `https://app.unifysocial.ca${cta.destination}`);
      await expect(callout.getByRole('link', { name: cta.label })).not.toHaveAttribute('target', '_blank');
      await expect(callout.getByRole('link', { name: 'Download Unify on the App Store' })).toHaveAttribute('href', 'https://apps.apple.com/ca/app/unify-newcomer-support/id6754875762');
    }
    // Sweep widths, including both sides of the site's breakpoints. CTA bounds
    // and intrinsic button wrapping must hold throughout, not just screenshots.
    const widths = [...new Set([...Array.from({ length: 81 }, (_, i) => 320 + i * 20), 375, 809, 810, 1399, 1400])].sort((a, b) => a - b);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await callouts.evaluateAll((nodes) => nodes.map((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, scrollWidth: node.scrollWidth, width: box.width,
          controls: [...node.querySelectorAll('a')].map((a) => ({ width: a.getBoundingClientRect().width, height: a.getBoundingClientRect().height })) };
      }));
      for (const box of layout) {
        expect(box.left, `${path} at ${width}`).toBeGreaterThanOrEqual(0);
        expect(box.right, `${path} at ${width}`).toBeLessThanOrEqual(width + 1);
        expect(box.scrollWidth).toBeLessThanOrEqual(Math.ceil(box.width) + 1);
        for (const control of box.controls) {
          expect(control.width).toBeGreaterThanOrEqual(44);
          expect(control.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await callouts.first().scrollIntoViewIfNeeded();
      await callouts.first().screenshot({ path: testInfo.outputPath(`cta-${width}.png`) });
    }
    const primary = callouts.first().getByRole('link', { name: cta.label });
    await primary.focus();
    expect(await primary.evaluate((a) => getComputedStyle(a).outlineStyle)).toBe('solid');
  });
}

test('only selected pages receive contextual CTAs and homepage keeps its web choice', async ({ page }) => {
  await page.goto('/teer/teer-2');
  await expect(page.locator('[data-search-cta]')).toHaveCount(0);
  await page.goto('/');
  await expect(page.locator('section.platform a.webapp-badge')).toHaveAttribute('href', 'https://app.unifysocial.ca');
  await expect(page.locator('[data-search-cta]')).toHaveCount(0);
});

test('GA content metadata records one click after ClientRouter swaps; analytics failure never blocks links', async ({ page }) => {
  await page.goto('/teer');
  await page.evaluate(() => {
    const win = window as Window & { events: unknown[]; gtag: (...args: unknown[]) => void };
    win.events = [];
    win.gtag = (...args) => win.events.push(args);
    document.addEventListener('click', (e) => {
      if ((e.target as Element).closest('[data-cta-platform]')) e.preventDefault();
    }, { capture: true });
  });
  const callout = page.locator('[data-search-cta][data-placement="intro"]');
  await callout.scrollIntoViewIfNeeded();
  await callout.locator('a[data-cta-platform="web"]').click();
  await page.locator('a.teer-card[href="/teer/teer-3"]').click();
  await expect(page).toHaveURL(/\/teer\/teer-3$/);
  const nextCallout = page.locator('[data-search-cta][data-placement="intro"]');
  await nextCallout.scrollIntoViewIfNeeded();
  await nextCallout.locator('a[data-cta-platform="web"]').focus();
  await page.keyboard.press('Enter');
  const events = await page.evaluate(() => (window as Window & { events: unknown[][] }).events);
  const clicks = events.filter((event) => event[1] === 'search_cta_click');
  expect(clicks).toHaveLength(2);
  expect(clicks[1][2]).toEqual({
    source_path: '/teer/teer-3', topic: 'pr-pathways',
    destination_path: searchCtaForPath('/teer/teer-3')!.destination,
    placement: 'intro', platform: 'web', transport_type: 'beacon',
  });
  expect(events.filter((event) => event[1] === 'search_cta_view' && (event[2] as { source_path: string; placement: string }).source_path === '/teer/teer-3' && (event[2] as { placement: string }).placement === 'intro')).toHaveLength(1);
  await page.evaluate(() => { (window as Window & { gtag: () => void }).gtag = () => { throw new Error('measurement unavailable'); }; });
  await nextCallout.locator('a[data-cta-platform="web"]').click();
  await expect(nextCallout.locator('a[data-cta-platform="web"]')).toHaveAttribute('href', `https://app.unifysocial.ca${searchCtaForPath('/teer/teer-3')!.destination}`);
});
