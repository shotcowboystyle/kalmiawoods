import { defineCollection, z } from 'astro:content';

const attractionsCollection = defineCollection({
	type: 'data',
	schema: ({ image }) =>
		z.object({
			order: z.number(),
			name: z.string(),
			description: z.string(),
			href: z.string().url(),
			image: image(),
		}),
});

const amenitiesCollection = defineCollection({
	type: 'data',
	schema: z.object({
		order: z.number(),
		name: z.string(),
		items: z.array(
			z.object({
				icon: z.string(),
				title: z.string(),
				description: z.string().optional(),
			}),
		),
	}),
});

const guidebookCollection = defineCollection({
	schema: z.object({
		order: z.number(),
		category: z.string(),
		categoryIcon: z.string(),
		categoryOrder: z.number(),
		subcategory: z.string(),
		subcategoryIcon: z.string(),
		subcategoryOrder: z.number(),
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional(),
	}),
});

export const collections = {
	attractions: attractionsCollection,
	amenities: amenitiesCollection,
	guidebook: guidebookCollection,
};
