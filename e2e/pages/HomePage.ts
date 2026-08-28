import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
	readonly heroSection: Locator;
	readonly welcomeSection: Locator;
	readonly roomsSection: Locator;
	readonly bookNowButton: Locator;

	constructor(page: Page) {
		super(page, '/');
		this.heroSection = page.locator('#hero-section');
		this.welcomeSection = page.locator('#welcome');
		this.roomsSection = page.locator('#rooms, section:has(h2:has-text("Rooms"))').first();
		this.bookNowButton = page.locator('a[href="/book-now"]:visible').first();
	}

	async getHeroText() {
		return this.welcomeSection.locator('.c-animated-big-text__text-line').first().textContent();
	}

	async clickBookNow() {
		await this.bookNowButton.click();
		await this.page.waitForLoadState('networkidle');
	}
}
