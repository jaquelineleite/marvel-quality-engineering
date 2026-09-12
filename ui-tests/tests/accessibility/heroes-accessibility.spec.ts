import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HeroesPage } from '../../pages/HeroesPage';

test.describe('Marvel Rivals Heroes - Accessibility', () => {
  test('A11Y-01 @accessibility não apresenta novas violações críticas além do baseline conhecido', async ({
    page
  }) => {
    const heroesPage = new HeroesPage(page);

    await heroesPage.goto();
    await heroesPage.getHeroDetailsText();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    const violationSummary = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      nodes: violation.nodes.length
    }));

    console.log('ACCESSIBILITY_VIOLATIONS=', violationSummary);

    const criticalViolations = results.violations.filter(
      (violation) => violation.impact === 'critical'
    );

    const knownCriticalViolationIds = new Set([
      'image-alt'
    ]);

    const knownCriticalViolations = criticalViolations.filter((violation) =>
      knownCriticalViolationIds.has(violation.id)
    );

    const unexpectedCriticalViolations = criticalViolations.filter(
      (violation) => !knownCriticalViolationIds.has(violation.id)
    );

    console.log(
      'KNOWN_CRITICAL_ACCESSIBILITY_VIOLATIONS=',
      knownCriticalViolations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.length,
        targets: violation.nodes.map((node) => node.target)
      }))
    );

    console.log(
      'UNEXPECTED_CRITICAL_ACCESSIBILITY_VIOLATIONS=',
      unexpectedCriticalViolations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.length
      }))
    );

    expect(unexpectedCriticalViolations).toEqual([]);
  });
});
