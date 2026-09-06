import type { GenericObject } from '@/types/common';

export function removeObjectFromArrayByProperty<T>(
	array: T[],
	propertyName: keyof T,
	propertyValue: T[keyof T],
): void {
	// find the index of the object with the specified property value
	const index = array.findIndex((obj) => obj[propertyName] === propertyValue);

	// if an object with the specified property value is in the array, remove it
	if (index > -1) {
		array.splice(index, 1);
	}
}

export const convertArrayToObjectsByKey = (array: any, key: string) =>
	Object.fromEntries(array.map((obj: any) => [obj[key], obj]));

export const dedupeFlatArray = (arr: [string | number]) => [...new Set(arr)];

export const sortByKey = (arr: [GenericObject], key: string) =>
	arr.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));

export const isEqual = (a: GenericObject | [GenericObject], b: GenericObject | [GenericObject]) =>
	JSON.stringify(a) === JSON.stringify(b);

export const countOccurrences = (arr: [string | number], value: string | number) =>
	arr.reduce((a, v) => (v === value ? (a as number) + 1 : a), 0 as number);

export const pluck = (objs: [GenericObject], key: string) => objs.map((obj) => obj[key]);
