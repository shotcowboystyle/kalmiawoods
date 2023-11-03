// src/lucia.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import('@/lib/lucia').Auth;
	type DatabaseUserAttributes = {
		// name?: string;
		email: string;
		email_verified: boolean;
		role: 'USER' | 'ADMIN';
	};
	// eslint-disable-next-line @typescript-eslint/ban-types
	type DatabaseSessionAttributes = {};
}
