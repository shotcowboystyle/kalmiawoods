import { BooleanAsString } from '@/schemas/schema-utils';
import { z } from 'zod';

export type BooleanAsString = z.infer<typeof BooleanAsString>;

export interface GenericObject {
	[key: string]: any;
}

export interface StringObject {
	[key: string]: string;
}

export type OptionsType = {
	value: string;
	name: string;
};

export type CheckboxGroupOptionsType = {
	icon: string;
	name: string;
	value: string;
};
