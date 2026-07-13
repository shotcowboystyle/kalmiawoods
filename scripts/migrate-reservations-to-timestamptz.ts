/**
 * One-time migration: convert reservations.check_in / check_out from DATE to TIMESTAMPTZ.
 *
 * Existing DATE rows get 15:00 (check-in) and 11:00 (check-out) in America/New_York.
 * Idempotent — if columns are already TIMESTAMPTZ, the script is a no-op.
 *
 * Usage:
 *   KW_STORAGE_DATABASE_URL="postgres://..." npx tsx scripts/migrate-reservations-to-timestamptz.ts
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.KW_STORAGE_DATABASE_URL;
if (!DATABASE_URL) {
	console.error('ERROR: KW_STORAGE_DATABASE_URL environment variable is required');
	process.exit(1);
}

const sql = neon(DATABASE_URL);

async function columnType(column: string): Promise<string | null> {
	const rows = (await sql`
		SELECT data_type
		FROM information_schema.columns
		WHERE table_name = 'reservations' AND column_name = ${column}
		LIMIT 1
	`) as { data_type: string }[];
	return rows[0]?.data_type ?? null;
}

const checkInType = await columnType('check_in');
const checkOutType = await columnType('check_out');

if (!checkInType || !checkOutType) {
	console.error('ERROR: reservations table does not have check_in / check_out columns');
	process.exit(1);
}

console.log(`Current types: check_in=${checkInType}, check_out=${checkOutType}`);

if (checkInType === 'date') {
	console.log('Converting check_in DATE -> TIMESTAMPTZ (15:00 America/New_York)...');
	await sql`
		ALTER TABLE reservations
		ALTER COLUMN check_in TYPE TIMESTAMPTZ
		USING ((check_in::text || ' 15:00:00')::timestamp AT TIME ZONE 'America/New_York')
	`;
} else {
	console.log('check_in already non-DATE, skipping.');
}

if (checkOutType === 'date') {
	console.log('Converting check_out DATE -> TIMESTAMPTZ (11:00 America/New_York)...');
	await sql`
		ALTER TABLE reservations
		ALTER COLUMN check_out TYPE TIMESTAMPTZ
		USING ((check_out::text || ' 11:00:00')::timestamp AT TIME ZONE 'America/New_York')
	`;
} else {
	console.log('check_out already non-DATE, skipping.');
}

console.log('Creating overlap-query index if missing...');
await sql`
	CREATE INDEX IF NOT EXISTS idx_reservations_property_dates
	ON reservations (property, check_in, check_out)
`;

console.log('Migration complete.');
