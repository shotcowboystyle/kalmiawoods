import { expect, test } from '../fixtures';

test.describe('Navigation Menu', () => {
	// Skip the flaky tests due to Astro ViewTransitions on mobile
	test.skip('should navigate from home to rooms page using the menu', async ({
		homePage,
		page,
	}) => {
		await homePage.goto();

		await homePage.navigateTo('Rooms & Suites');
		await expect(page).toHaveURL(/.*\/rooms/);

		const title = await page.title();
		expect(title).toContain('Rooms');
	});

	// Skip the flaky tests due to Astro ViewTransitions on mobile
	test.skip('should navigate from rooms to contact page using the menu', async ({
		roomsPage,
		page,
	}) => {
		await roomsPage.goto();

		await roomsPage.navigateTo('Contact');
		await expect(page).toHaveURL(/.*\/contact/);

		const title = await page.title();
		expect(title).toContain('Contact');
	});
});
