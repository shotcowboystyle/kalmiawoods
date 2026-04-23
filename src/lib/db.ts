import { neon } from '@neondatabase/serverless';

function getConnectionString(): string {
	const url = import.meta.env.KW_STORAGE_DATABASE_URL;
	if (!url) {
		throw new Error('KW_STORAGE_DATABASE_URL environment variable is not set');
	}
	return url;
}

export function getDb() {
	return neon(getConnectionString());
}
