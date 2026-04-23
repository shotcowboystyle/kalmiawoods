import { getDb } from './db';

const SESSION_COOKIE = 'admin_session';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

async function pbkdf2Hash(password: string, salt: string): Promise<string> {
	const enc = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
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

export async function verifyLogin(
	email: string,
	password: string,
): Promise<{ id: string; email: string } | null> {
	const sql = getDb();
	const rows = await sql`
		SELECT id, email, password_hash, salt
		FROM admin_users
		WHERE email = ${email}
		LIMIT 1
	`;
	if (rows.length === 0) return null;

	const user = rows[0];
	const hash = await pbkdf2Hash(password, user.salt);
	if (hash !== user.password_hash) return null;

	return { id: user.id, email: user.email };
}

export async function createSession(userId: string): Promise<string> {
	const sql = getDb();
	const token = generateToken();
	const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
	await sql`
		INSERT INTO admin_sessions (token, user_id, expires_at)
		VALUES (${token}, ${userId}, ${expiresAt.toISOString()})
	`;
	return token;
}

export async function validateSession(
	token: string,
): Promise<{ id: string; email: string } | null> {
	const sql = getDb();
	const rows = await sql`
		SELECT u.id, u.email
		FROM admin_sessions s
		JOIN admin_users u ON u.id = s.user_id
		WHERE s.token = ${token} AND s.expires_at > now()
		LIMIT 1
	`;
	return rows.length > 0 ? { id: rows[0].id, email: rows[0].email } : null;
}

export async function deleteSession(token: string): Promise<void> {
	const sql = getDb();
	await sql`DELETE FROM admin_sessions WHERE token = ${token}`;
}

export function sessionCookieName(): string {
	return SESSION_COOKIE;
}

export function sessionCookieOptions(): Record<string, unknown> {
	return {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
		maxAge: SESSION_MAX_AGE_MS / 1000,
	};
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
	const salt = generateToken();
	const hash = await pbkdf2Hash(password, salt);
	return { hash, salt };
}
