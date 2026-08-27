import { expect, test } from '../fixtures';

test.describe('Contact Page', () => {
	test('should display contact header text and info cards', async ({ contactPage }) => {
		await contactPage.goto();

		// Check header text
		const headerText = await contactPage.getHeaderText();
		expect(headerText).toContain('Get in touch');

		// Check info cards count (should be at least 1, we expect 3 based on Departments.astro)
		await expect(contactPage.infoCards.first()).toBeVisible();
		const count = await contactPage.infoCards.count();
		expect(count).toBe(3);
	});
});
