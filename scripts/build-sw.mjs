/**
 * Emits the /admin service worker after `astro build`.
 *
 * Deliberately a post-build script rather than an Astro integration: both
 * astro-compress and @astrojs/vercel hook `astro:build:done`, and the adapter
 * moves the client output into .vercel/output/static during its own hook.
 * Relative hook ordering between a custom integration and the adapter is not
 * a thing to stake a deploy on; running after `astro build` has finished is
 * unambiguous.
 */

import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getBuildId } from './build-id.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TEMPLATE = join(ROOT, 'src/sw/sw.template.js');

// The Vercel adapter's output wins when present; `dist/client` is what a plain
// adapterless build produces and is the fallback for local inspection.
const CANDIDATE_DIRS = ['.vercel/output/static', 'dist/client', 'dist'];

function resolveOutDir() {
	for (const candidate of CANDIDATE_DIRS) {
		const abs = join(ROOT, candidate);
		if (statSync(abs, { throwIfNoEntry: false })?.isDirectory()) return { abs, rel: candidate };
	}
	throw new Error(
		`No build output found. Looked for: ${CANDIDATE_DIRS.join(', ')}. Run \`astro build\` first.`,
	);
}

const buildId = getBuildId();
const { abs: outDir, rel: outDirLabel } = resolveOutDir();

const template = readFileSync(TEMPLATE, 'utf8');
if (!template.includes('__BUILD_ID__')) {
	throw new Error(`${TEMPLATE} has no __BUILD_ID__ placeholder — the worker would never version.`);
}

const source = template.replaceAll('__BUILD_ID__', buildId);
const target = join(outDir, 'sw.js');
writeFileSync(target, source, 'utf8');

const bytes = Buffer.byteLength(source, 'utf8');
console.log(`[build-sw] wrote ${outDirLabel}/sw.js — build id ${buildId}, ${bytes} bytes`);
console.log(
	`[build-sw] reminder: /sw.js must be served with Cache-Control: no-cache (see vercel.json)`,
);
