import type { endpointsToOperations } from '@/pages/api/[...entity]';
// import type { playgroundActions } from '../pages/playground/_actions.js';

export type EndpointsToOperations = typeof endpointsToOperations;
export type Endpoint = keyof EndpointsToOperations;

export type Users = User[];
export interface User {
	id: number;
	name: string;
	avatar: string;
	email: string;
	biography: string;
	position: string;
	country: string;
	status: string;
}

// export type PlaygroundAction = (typeof playgroundActions)[number];
