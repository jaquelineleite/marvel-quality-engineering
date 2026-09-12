import { test, expect } from '@playwright/test';
import { HeroesPage } from '../../pages/HeroesPage';

test.use({
  viewport: {
    width: 390,
    height: 844
  }
});

test.describe('Marvel Rivals Heroes - Responsive', () => {
  test('RESP-01 @responsive conteúdo principal permanece disponível em viewport mobile', async ({
    page
  }) => {
    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();

    const details = await heroesPage.getHeroDetailsText();

    expect(details.length).toBeGreaterThan(0);
    await expect(heroesPage.heroDetails).toBeVisible();

    expect(page.viewportSize()).toEqual({
      width: 390,
      height: 844
    });
  });

  test('RESP-02 @responsive @known-issue página não deveria apresentar overflow horizontal em mobile', async ({
    page
  }) => {
    test.fail(
      true,
      'Known issue: mobile viewport renders a desktop-width layout and causes horizontal overflow.'
    );

    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();
    await heroesPage.getHeroDetailsText();

    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));

    console.log('RESPONSIVE_LAYOUT=', layout);

    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 2);
  });
});

test('RESP-03 @responsive @known-issue seletor de heróis deveria permanecer acessível no viewport mobile', async ({
  page
}) => {
  test.fail(
    true,
    'Known issue: hero selector control is rendered outside the mobile viewport.'
  );

  const heroesPage = new HeroesPage(page);

  await heroesPage.goto();
  await heroesPage.getHeroDetailsText();

  const box = await heroesPage.moreButton.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();

  console.log('MORE_BUTTON_BOUNDING_BOX=', box);
  console.log('MOBILE_VIEWPORT=', viewport);

  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
});
