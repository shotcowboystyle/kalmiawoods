/**
 * Install affordance for the /admin PWA.
 *
 * Loaded only via dynamic import, from a caller that has already checked the
 * app is not running standalone (see AdminLayout.astro). Nothing here is
 * precached: bytes that can only ever render for someone who has *not*
 * installed the app must not sit on the installed app's critical path.
 *
 * Two very different platforms:
 *  - Chromium fires `beforeinstallprompt` and exposes prompt().
 *  - iOS has no programmatic install at all, so the affordance is Share-sheet
 *    instructions.
 */

const DISMISSED_KEY = 'kw-install-dismissed';

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let root: HTMLElement | null = null;

function isIos(): boolean {
	// iPadOS 13+ reports as Mac, distinguished by touch support.
	const ua = navigator.userAgent;
	return /iPhone|iPad|iPod/.test(ua) || (ua.includes('Macintosh') && navigator.maxTouchPoints > 1);
}

function dismiss(): void {
	localStorage.setItem(DISMISSED_KEY, '1');
	root?.remove();
	root = null;
}

function render(body: string, action: HTMLButtonElement | null): void {
	if (root) return;

	root = document.createElement('div');
	root.id = 'kw-install-prompt';
	root.setAttribute('role', 'dialog');
	root.setAttribute('aria-label', 'Install KW Admin');
	root.className =
		'browser-only fixed inset-x-2 z-50 mx-auto max-w-md rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl flex flex-col gap-3';
	root.style.bottom = 'max(env(safe-area-inset-bottom), 0.5rem)';

	const text = document.createElement('p');
	text.className = 'text-sm text-base-content/80';
	text.textContent = body;

	const row = document.createElement('div');
	row.className = 'flex gap-2 justify-end';

	const later = document.createElement('button');
	later.type = 'button';
	later.className = 'btn btn-sm btn-ghost';
	later.textContent = 'Not now';
	later.addEventListener('click', dismiss);

	row.append(later);
	if (action) row.append(action);

	root.append(text, row);
	document.body.append(root);
}

function renderIosPrompt(): void {
	render(
		'Install KW Admin for offline access: tap the Share button, then "Add to Home Screen".',
		null,
	);
}

function renderChromiumPrompt(): void {
	const install = document.createElement('button');
	install.type = 'button';
	install.className = 'btn btn-sm btn-primary';
	install.textContent = 'Install';
	install.addEventListener('click', async () => {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		deferredPrompt = null;
		// A declined prompt is not offered again — the browser will not replay
		// beforeinstallprompt for this session anyway.
		if (outcome === 'dismissed') dismiss();
		else {
			root?.remove();
			root = null;
		}
	});

	render('Install KW Admin to open it offline from your home screen.', install);
}

export function mountInstallPrompt(): void {
	if (localStorage.getItem(DISMISSED_KEY)) return;

	window.addEventListener('appinstalled', () => {
		localStorage.setItem(DISMISSED_KEY, '1');
		root?.remove();
		root = null;
	});

	window.addEventListener('beforeinstallprompt', (event) => {
		event.preventDefault();
		deferredPrompt = event as BeforeInstallPromptEvent;
		renderChromiumPrompt();
	});

	// iOS never fires beforeinstallprompt, so there is nothing to wait for.
	// Restricted to touch devices: Share-sheet instructions are wrong on a Mac.
	if (isIos() && navigator.maxTouchPoints > 0) renderIosPrompt();
}
