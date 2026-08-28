import { expect, test } from '../fixtures';

test.describe('Homepage', () => {
	test('should load successfully and have correct title', async ({ homePage }) => {
		await homePage.goto();

		const title = await homePage.getTitle();
		expect(title.length).toBeGreaterThan(0);
	});

	test('should display the hero section and welcome text', async ({ homePage }) => {
		await homePage.goto();

		await expect(homePage.heroSection).toBeVisible();
		await expect(homePage.welcomeSection).toBeVisible();

		const heroText = await homePage.getHeroText();
		const normalizedHeroText = heroText?.replace(/\s+/g, ' ');
		expect(normalizedHeroText).toContain('Kalmia');
	});

	test('should navigate to book now page when clicking book now button', async ({ homePage }) => {
		await homePage.goto();

		await expect(homePage.bookNowButton).toBeVisible();
		await expect(homePage.bookNowButton).toHaveAttribute('href', '/book-now');
	});
});
