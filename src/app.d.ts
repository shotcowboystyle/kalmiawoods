declare namespace App {
	interface Locals {
		auth: import('lucia').AuthRequest;
		user: {
			userId: string;
			email: string;
			isAdmin: boolean;
		};
	}
}
