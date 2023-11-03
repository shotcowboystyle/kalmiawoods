import { BuildingEnum, ReservationSchema } from '@/schemas/reservation';
import { z } from 'zod';

export type Reservation = z.infer<typeof ReservationSchema>;
export type BuildingEnum = z.infer<typeof BuildingEnum>;

export type ReservationForm = {
	reservationId?: string;
	title?: string;
	userId: string;
	checkInDate: string;
	checkOutDate: string;
	buildings: BuildingEnum[];
};
