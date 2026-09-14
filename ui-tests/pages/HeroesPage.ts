import { expect, Locator, Page, Response } from '@playwright/test';

export class HeroesPage {
  readonly page: Page;
  readonly heroDetails: Locator;
  readonly moreButton: Locator;
  readonly heroCards: Locator;
  readonly abilitiesButton: Locator;
  readonly loreButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroDetails = page.locator('.hero-details');
    this.moreButton = page.locator('a.more-btn');
    this.heroCards = page.locator('li[data-id][data-index]');
    this.abilitiesButton = page.locator('a.abilties');
    this.loreButton = page.locator('a.btn-lore');
  }

  async goto(): Promise<Response | null> {
    return this.page.goto('/heroes/index.html', {
      waitUntil: 'domcontentloaded'
    });
  }

  async openHeroSelector(): Promise<void> {
    await expect(this.moreButton).toBeVisible();

    // The control has continuous animation and does not reach Playwright's
    // stable state. force is intentionally limited to this known UI control.
    await this.moreButton.click({ force: true });

    await expect(this.visibleHeroCards().first()).toBeVisible();
  }

  visibleHeroCards(): Locator {
    return this.page.locator('li[data-id][data-index]:visible');
  }

  visibleHeroImages(): Locator {
    return this.page.locator('li[data-id][data-index]:visible img');
  }

  async countVisibleCardsWithoutImage(): Promise<number> {
    return this.visibleHeroCards().evaluateAll(cards =>
      cards.filter(card => !card.querySelector('img[src]')).length
    );
  }

  async getHeroDetailsText(): Promise<string> {
    await expect(this.heroDetails).toBeVisible();

    await expect
      .poll(async () => {
        const text = (await this.heroDetails.innerText())
          .replace(/\s+/g, ' ')
          .trim();

        return text.length;
      })
      .toBeGreaterThan(0);

    return (await this.heroDetails.innerText())
      .replace(/\s+/g, ' ')
      .trim();
  }

  async selectVisibleHero(index: number): Promise<string> {
    const cards = this.visibleHeroCards();
    const count = await cards.count();

    expect(count).toBeGreaterThan(index);

    const card = cards.nth(index);
    const heroId = await card.getAttribute('data-id');

    expect(heroId).toBeTruthy();

    await card.click();

    await expect
      .poll(() => new URL(this.page.url()).searchParams.get('id'))
      .toBe(heroId);

    return heroId!;
  }
}
