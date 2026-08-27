import { test as base } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import { HomePage } from '../pages/HomePage';
import { RoomsPage } from '../pages/RoomsPage';

type MyFixtures = {
	homePage: HomePage;
	roomsPage: RoomsPage;
	contactPage: ContactPage;
};

export const test = base.extend<MyFixtures>({
	homePage: async ({ page }, use) => {
		await use(new HomePage(page));
	},
	roomsPage: async ({ page }, use) => {
		await use(new RoomsPage(page));
	},
	contactPage: async ({ page }, use) => {
		await use(new ContactPage(page));
	},
});

export { expect } from '@playwright/test';
