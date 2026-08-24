import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

/**
 * Files hashed to produce the local build id. `src/**` is included rather than the
 * emitted `_astro/*` filenames because asset hashes do not move for an HTML-only
 * edit — change a label in AdminLayout.astro and the CSS/JS hashes stay identical,
 * so the update would never reach an installed client.
 */
const HASHED_DIRS = ['src'];
const HASHED_FILES = ['package.json'];

function walk(dir, out) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			walk(full, out);
		} else if (entry.isFile()) {
			out.push(full);
		}
	}
	return out;
}

let cached;

export function getBuildId() {
	if (cached) return cached;

	// Vercel exposes the commit SHA at build time; it is already a content-addressed
	// identifier for the whole tree, so there is nothing to hash.
	const sha = process.env.VERCEL_GIT_COMMIT_SHA;
	if (sha) {
		cached = sha.slice(0, 12);
		return cached;
	}

	const files = [];
	for (const dir of HASHED_DIRS) {
		const abs = join(ROOT, dir);
		if (statSync(abs, { throwIfNoEntry: false })) walk(abs, files);
	}
	for (const file of HASHED_FILES) {
		const abs = join(ROOT, file);
		if (statSync(abs, { throwIfNoEntry: false })) files.push(abs);
	}

	const hash = createHash('sha256');
	// Sort by repo-relative path so the id does not depend on readdir order or checkout location.
	for (const file of files.map((f) => relative(ROOT, f)).sort()) {
		hash.update(file);
		hash.update(readFileSync(join(ROOT, file)));
	}

	cached = hash.digest('hex').slice(0, 12);
	return cached;
}
