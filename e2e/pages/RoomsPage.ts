import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RoomsPage extends BasePage {
	readonly roomsList: Locator;
	readonly roomItems: Locator;

	constructor(page: Page) {
		super(page, '/rooms');
		this.roomsList = page.locator('.c-link-list-big__list');
		this.roomItems = page.locator('.c-link-list-big__item');
	}

	async getRoomCount() {
		return this.roomItems.count();
	}
}
