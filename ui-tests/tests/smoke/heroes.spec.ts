import { test, expect } from '@playwright/test';
import { HeroesPage } from '../../pages/HeroesPage';

test.describe('Marvel Rivals Heroes', () => {
  test('UI-01 @smoke página de heróis carrega com sucesso', async ({ page }) => {
    const heroesPage = new HeroesPage(page);

    const response = await heroesPage.goto();

    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    await expect(page).toHaveTitle(/Marvel Rivals/i);
    await expect(heroesPage.heroDetails).toBeVisible();
  });

  test('UI-02 @smoke seletor apresenta a lista de heróis', async ({ page }) => {
    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();

    const totalCards = await heroesPage.heroCards.count();

    expect(totalCards).toBeGreaterThan(1);

    await heroesPage.openHeroSelector();

    const visibleCards = await heroesPage.visibleHeroCards().count();

    expect(visibleCards).toBe(totalCards);
  });

  test('UI-03 @smoke @regression seleção de herói atualiza URL e detalhe', async ({
    page
  }) => {
    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();

    const initialDetails = await heroesPage.getHeroDetailsText();

    await heroesPage.openHeroSelector();

    const selectedHeroId = await heroesPage.selectVisibleHero(1);

    expect(selectedHeroId).not.toBe('');

    await expect
      .poll(() => heroesPage.getHeroDetailsText())
      .not.toBe(initialDetails);
  });

  test('UI-05 @regression detalhe apresenta informações funcionais do herói', async ({
    page
  }) => {
    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();

    const details = await heroesPage.getHeroDetailsText();

    expect(details.length).toBeGreaterThan(50);
    expect(details).toMatch(/VANGUARD|DUELIST|STRATEGIST/i);

    await expect(heroesPage.abilitiesButton).toBeVisible();
    await expect(heroesPage.loreButton).toBeVisible();
  });

  test('UI-10 @regression fluxo principal não gera erros críticos no console', async ({
    page
  }) => {
    const consoleErrors: string[] = [];

    page.on('console', message => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();
    await heroesPage.openHeroSelector();
    await heroesPage.selectVisibleHero(1);

    await expect(heroesPage.heroDetails).toBeVisible();

    expect(
      consoleErrors,
      `Erros encontrados no console:\n${consoleErrors.join('\n')}`
    ).toEqual([]);
  });

  test('UI-11 @regression fluxo principal não apresenta falhas HTTP críticas', async ({
    page
  }) => {
    const httpErrors: string[] = [];

    const criticalResourceTypes = new Set([
      'document',
      'script',
      'stylesheet',
      'xhr',
      'fetch'
    ]);

    page.on('response', response => {
      const resourceType = response.request().resourceType();

      if (
        response.status() >= 400 &&
        criticalResourceTypes.has(resourceType)
      ) {
        httpErrors.push(
          `${response.status()} ${resourceType} ${response.url()}`
        );
      }
    });

    const heroesPage = new HeroesPage(page);

    const response = await heroesPage.goto();

    expect(response).not.toBeNull();
    expect(response!.status()).toBeLessThan(400);

    await heroesPage.openHeroSelector();
    await heroesPage.selectVisibleHero(1);

    await expect(heroesPage.heroDetails).toBeVisible();

    expect(
      httpErrors,
      `Falhas HTTP críticas encontradas:\n${httpErrors.join('\n')}`
    ).toEqual([]);
  });


  test('UI-06 @regression imagens principais dos heróis carregam corretamente', async ({
    page
  }) => {
    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();
    await heroesPage.openHeroSelector();

    const totalCards = await heroesPage.visibleHeroCards().count();
    const cardsWithoutImage = await heroesPage.countVisibleCardsWithoutImage();

    expect(totalCards).toBeGreaterThan(0);
    expect(cardsWithoutImage).toBe(0);

    const images = heroesPage.visibleHeroImages();
    const sampleSize = Math.min(5, await images.count());

    expect(sampleSize).toBeGreaterThan(0);

    for (let index = 0; index < sampleSize; index++) {
      const image = images.nth(index);

      await image.scrollIntoViewIfNeeded();

      const src = await image.getAttribute('src');
      expect(src).toBeTruthy();

      await expect
        .poll(
          () =>
            image.evaluate(
              (img: HTMLImageElement) =>
                img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
            ),
          { timeout: 10_000 }
        )
        .toBe(true);
    }
  });

});
