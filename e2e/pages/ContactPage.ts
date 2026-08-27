import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
	readonly headerTitle: Locator;
	readonly infoCards: Locator;

	constructor(page: Page) {
		super(page, '/contact');
		this.headerTitle = page.locator('.c-animated-big-text__text-line').first();
		this.infoCards = page.locator('.c-info-cards__item');
	}

	async getHeaderText() {
		return this.headerTitle.textContent();
	}
}
