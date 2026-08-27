import type { Locator, Page } from '@playwright/test';

export class BasePage {
	readonly page: Page;
	readonly url: string;
	readonly menuButton: Locator;
	readonly navMenu: Locator;
	readonly closeMenuButton: Locator;

	constructor(page: Page, url: string = '/') {
		this.page = page;
		this.url = url;

		// Adjust these locators based on actual application HTML structure
		this.menuButton = page.locator('button[aria-label="Menu"]').first();
		this.navMenu = page.locator('.c-mobile-navigation');
		this.closeMenuButton = page.locator('.c-mobile-navigation .c-hamburger');
	}

	async goto() {
		await this.page.goto(this.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
	}

	async getTitle() {
		return this.page.title();
	}

	async openMenu() {
		const isMenuActive = await this.navMenu.evaluate((node) =>
			node.classList.contains('is-active'),
		);
		if (!isMenuActive) {
			// Sometimes it's the hamburger, sometimes it's nested
			const btn = this.page.locator('.js-hamburger').first();
			await btn.click({ force: true });
			await this.page.waitForTimeout(1500); // wait for menu animation to fully complete
		}
	}

	async closeMenu() {
		const isMenuActive = await this.navMenu.evaluate((node) =>
			node.classList.contains('is-active'),
		);
		if (isMenuActive && (await this.closeMenuButton.isVisible())) {
			await this.closeMenuButton.click({ force: true });
			await this.page.waitForTimeout(1000); // wait for menu animation
		}
	}

	async navigateTo(linkText: string) {
		await this.openMenu();
		const linkLocator = this.page
			.locator(`.c-mobile-navigation__list a:has-text("${linkText}")`)
			.first();

		const href = await linkLocator.getAttribute('href');

		// Set up transition wait exactly as requested initially. Astro relies on history state + before-swap
		const transitionPromise = this.page.evaluate(() => {
			return new Promise<void>((resolve) => {
				const timer = setTimeout(resolve, 5000);
				document.addEventListener(
					'astro:before-swap',
					(e: any) => {
						if (e.viewTransition && e.viewTransition.ready) {
							e.viewTransition.ready
								.then(() => {
									clearTimeout(timer);
									resolve();
								})
								.catch(() => {
									clearTimeout(timer);
									resolve();
								});
						} else {
							clearTimeout(timer);
							resolve();
						}
					},
					{ once: true },
				);
			});
		});

		await linkLocator.click({ force: true });

		// Wait for the view transition to actually complete
		await transitionPromise;

		// Because Astro's View Transitions sometimes mess up Playwright's `goto` resolution and history pushes
		// Wait for URL directly
		if (href) {
			await this.page.waitForURL(`**${href}**`, { timeout: 10000 }).catch(() => {});
		}
	}
}
