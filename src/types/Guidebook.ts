import type { CollectionEntry } from 'astro:content';

export type GuidebookSubCategory = {
	subcategoryTitle: string;
	icon: string;
	order: number;
	items: CollectionEntry<'guidebook'>[];
};

export type GuidebookCategory = {
	categoryTitle: string;
	icon: string;
	order: number;
	subcategories: {
		[key: string]: GuidebookSubCategory;
	};
};

export type Guidebook = {
	[key: string]: GuidebookCategory;
};
