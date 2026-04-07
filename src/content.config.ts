import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const attractionsCollection = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/attractions' }),
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
	loader: glob({ pattern: '**/*.json', base: './src/content/amenities' }),
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

const restaurantsCollection = defineCollection({
	loader: glob({ pattern: '**/*.json', base: './src/content/restaurants' }),
	schema: ({ image }) =>
		z.object({
			order: z.number(),
			name: z.string(),
			description: z.string(),
			location: z.string(),
			locationLink: z.string().url(),
			image: image(),
		}),
});

export const collections = {
	attractions: attractionsCollection,
	amenities: amenitiesCollection,
	restaurants: restaurantsCollection,
};
