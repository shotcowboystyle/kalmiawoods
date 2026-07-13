/**
 * One-time script to create the initial admin user.
 *
 * Usage:
 *   KW_STORAGE_DATABASE_URL="postgres://..." npx tsx scripts/seed-admin.ts
 *
 * You will be prompted for email and password, or pass them as env vars:
 *   ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="secret123" KW_STORAGE_DATABASE_URL="..." npx tsx scripts/seed-admin.ts
 */

import { neon } from '@neondatabase/serverless';

const KW_STORAGE_DATABASE_URL = process.env.KW_STORAGE_DATABASE_URL;
if (!KW_STORAGE_DATABASE_URL) {
	console.error('ERROR: KW_STORAGE_DATABASE_URL environment variable is required');
	process.exit(1);
}

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
	console.error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
	console.error(
		'Usage: ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="secret" KW_STORAGE_DATABASE_URL="..." npx tsx scripts/seed-admin.ts',
	);
	process.exit(1);
}

if (password.length < 8) {
	console.error('ERROR: Password must be at least 8 characters');
	process.exit(1);
}

async function pbkdf2Hash(pwd: string, salt: string): Promise<string> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pwd), 'PBKDF2', false, [
		'deriveBits',
	]);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt: enc.encode(salt), iterations: 100_000, hash: 'SHA-256' },
		keyMaterial,
		256,
	);
	return Array.from(new Uint8Array(bits))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

function generateToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

const sql = neon(KW_STORAGE_DATABASE_URL);

// Create tables if they don't exist
await sql`
	CREATE TABLE IF NOT EXISTS admin_users (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		salt TEXT NOT NULL,
		role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
		created_at TIMESTAMPTZ DEFAULT now()
	)
`;

await sql`
	ALTER TABLE admin_users
	ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'
	CHECK (role IN ('super_admin', 'admin'))
`;

await sql`
	UPDATE admin_users SET role = 'super_admin'
	WHERE NOT EXISTS (SELECT 1 FROM admin_users WHERE role = 'super_admin')
`;

await sql`
	ALTER TABLE admin_users
	ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT false
`;

await sql`
	CREATE TABLE IF NOT EXISTS admin_sessions (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		token TEXT UNIQUE NOT NULL,
		user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
		expires_at TIMESTAMPTZ NOT NULL,
		created_at TIMESTAMPTZ DEFAULT now()
	)
`;

await sql`
	CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token)
`;

await sql`
	CREATE TABLE IF NOT EXISTS reservations (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		name TEXT NOT NULL,
		check_in TIMESTAMPTZ NOT NULL,
		check_out TIMESTAMPTZ NOT NULL,
		property TEXT NOT NULL CHECK (property IN ('main_house', 'workshop', 'both')),
		created_at TIMESTAMPTZ DEFAULT now(),
		updated_at TIMESTAMPTZ DEFAULT now()
	)
`;

await sql`
	CREATE INDEX IF NOT EXISTS idx_reservations_property_dates
	ON reservations (property, check_in, check_out)
`;

// Create admin user
const salt = generateToken();
const hash = await pbkdf2Hash(password, salt);

const existing = await sql`SELECT id FROM admin_users WHERE email = ${email} LIMIT 1`;
if (existing.length > 0) {
	console.log(`Admin user ${email} already exists — updating password.`);
	await sql`UPDATE admin_users SET password_hash = ${hash}, salt = ${salt} WHERE email = ${email}`;
} else {
	await sql`INSERT INTO admin_users (email, password_hash, salt, role) VALUES (${email}, ${hash}, ${salt}, 'super_admin')`;
	console.log(`Admin user ${email} created.`);
}

console.log('Database tables created and admin user seeded.');
