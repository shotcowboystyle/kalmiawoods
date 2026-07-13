import type { getDb } from './db';

export const PROPERTY_TIMEZONE = 'America/New_York';
export const CHECK_IN_HOUR = 15;
export const CHECK_OUT_HOUR = 11;

export type Property = 'main_house' | 'workshop' | 'both';

export const PROPERTIES: { value: Property; label: string }[] = [
	{ value: 'main_house', label: 'Main House' },
	{ value: 'workshop', label: 'Workshop' },
	{ value: 'both', label: 'Both' },
];

const PROPERTY_VALUES = new Set<string>(PROPERTIES.map((p) => p.value));

export function isProperty(value: string): value is Property {
	return PROPERTY_VALUES.has(value);
}

export function propertyLabel(value: string): string {
	return PROPERTIES.find((p) => p.value === value)?.label ?? value;
}

/**
 * Wall-clock hour in PROPERTY_TIMEZONE for the given date, returned as a UTC Date.
 * Handles DST correctly via Intl.
 */
export function combineDateAndTime(dateYYYYMMDD: string, hour: number): Date {
	const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
	const utcGuess = new Date(Date.UTC(y, m - 1, d, hour, 0, 0));
	const offMin = tzOffsetMinutes(PROPERTY_TIMEZONE, utcGuess);
	return new Date(utcGuess.getTime() - offMin * 60000);
}

function tzOffsetMinutes(zone: string, at: Date): number {
	const dtf = new Intl.DateTimeFormat('en-US', {
		timeZone: zone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	});
	const map: Record<string, string> = {};
	for (const p of dtf.formatToParts(at)) map[p.type] = p.value;
	const asUTC = Date.UTC(
		Number(map.year),
		Number(map.month) - 1,
		Number(map.day),
		Number(map.hour === '24' ? '0' : map.hour),
		Number(map.minute),
		Number(map.second),
	);
	return (asUTC - at.getTime()) / 60000;
}

/**
 * Format a TIMESTAMPTZ (as ISO string or Date) as a wall-clock string in PROPERTY_TIMEZONE.
 */
export function formatReservationDateTime(value: string | Date): string {
	const d = value instanceof Date ? value : new Date(value);
	return d.toLocaleString('en-US', {
		timeZone: PROPERTY_TIMEZONE,
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
}

export function formatReservationDate(value: string | Date): string {
	const d = value instanceof Date ? value : new Date(value);
	return d.toLocaleDateString('en-US', {
		timeZone: PROPERTY_TIMEZONE,
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

/**
 * Return YYYY-MM-DD for the wall-clock date in PROPERTY_TIMEZONE of a stored timestamp.
 * Used to hydrate <input type="date"> from a TIMESTAMPTZ row.
 */
export function toDateInputValue(value: string | Date): string {
	const d = value instanceof Date ? value : new Date(value);
	const dtf = new Intl.DateTimeFormat('en-CA', {
		timeZone: PROPERTY_TIMEZONE,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	});
	return dtf.format(d);
}

export type ReservationFormInput = {
	name: string;
	checkInDate: string;
	checkOutDate: string;
	property: string;
};

export type ReservationFieldErrors = {
	name?: string;
	checkInDate?: string;
	checkOutDate?: string;
	property?: string;
	_form?: string;
};

export function validateReservationInput(input: ReservationFormInput): ReservationFieldErrors {
	const errors: ReservationFieldErrors = {};
	const name = input.name.trim();
	if (!name) {
		errors.name = 'Guest name is required.';
	} else if (name.length > 200) {
		errors.name = 'Guest name must be 200 characters or fewer.';
	}

	if (!input.checkInDate) errors.checkInDate = 'Check-in date is required.';
	if (!input.checkOutDate) errors.checkOutDate = 'Check-out date is required.';

	if (!input.property) {
		errors.property = 'Property is required.';
	} else if (!isProperty(input.property)) {
		errors.property = 'Invalid property.';
	}

	if (!errors.checkInDate && !errors.checkOutDate) {
		if (input.checkOutDate <= input.checkInDate) {
			errors.checkOutDate = 'Check-out must be after check-in.';
		}
	}

	return errors;
}

export type ExistingReservationLite = {
	id: string;
	property: Property;
	checkIn: string;
	checkOut: string;
};

/**
 * Return the Property values that would conflict with any of the given existing
 * reservations for the candidate window. Mirrors the SQL predicate used by
 * findConflictingReservation:
 *   (candidate = existing.property OR existing.property = 'both' OR candidate = 'both')
 *   AND candidate.checkIn < existing.checkOut AND candidate.checkOut > existing.checkIn
 */
export function getBlockedProperties(
	candidateStart: Date,
	candidateEnd: Date,
	reservations: ReadonlyArray<ExistingReservationLite>,
	excludeId?: string | null,
): Set<Property> {
	const blocked = new Set<Property>();
	const cs = candidateStart.getTime();
	const ce = candidateEnd.getTime();
	if (!(cs < ce)) return blocked;

	for (const r of reservations) {
		if (excludeId && r.id === excludeId) continue;
		const rs = new Date(r.checkIn).getTime();
		const re = new Date(r.checkOut).getTime();
		if (!(cs < re && ce > rs)) continue;

		if (r.property === 'both') {
			blocked.add('main_house');
			blocked.add('workshop');
			blocked.add('both');
		} else {
			blocked.add(r.property);
			blocked.add('both');
		}
	}
	return blocked;
}

export type ConflictingReservation = {
	id: string;
	name: string;
	property: Property;
	check_in: string;
	check_out: string;
};

/**
 * Find the first reservation that overlaps the given window on the same property.
 * "both" bookings conflict with any other property (and vice versa).
 * Adjacent bookings (previous check_out == new check_in) are allowed because
 * 11:00 AM check-out precedes 3:00 PM check-in.
 */
export async function findConflictingReservation(
	sql: ReturnType<typeof getDb>,
	args: { property: Property; checkIn: Date; checkOut: Date; excludeId?: string | null },
): Promise<ConflictingReservation | null> {
	const excludeId = args.excludeId ?? null;
	const rows = (await sql`
		SELECT id, name, property, check_in, check_out
		FROM reservations
		WHERE (${excludeId}::uuid IS NULL OR id <> ${excludeId}::uuid)
		  AND (property = ${args.property} OR property = 'both' OR ${args.property} = 'both')
		  AND check_in  < ${args.checkOut.toISOString()}
		  AND check_out > ${args.checkIn.toISOString()}
		ORDER BY check_in ASC
		LIMIT 1
	`) as ConflictingReservation[];
	return rows[0] ?? null;
}
