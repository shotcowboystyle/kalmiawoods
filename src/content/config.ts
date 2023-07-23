// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Define your collection(s)
const attractionsCollection = defineCollection({
  type: 'data', // v2.5.0 and later
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      distance: z.string(),
      href: z.string().url(),
      // image: image().refine((img) => img.width >= 1080, {
      //   message: 'Cover image must be at least 1080 pixels wide!',
      // }),
      image: image(),
    }),
});

const guidebook = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
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

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  attractions: attractionsCollection,
  guidebook,
};
