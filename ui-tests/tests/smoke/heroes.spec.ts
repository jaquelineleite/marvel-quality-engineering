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
});
