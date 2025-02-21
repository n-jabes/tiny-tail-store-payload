import type { Config } from 'src/payload-types';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { unstable_cache, revalidateTag } from 'next/cache';

type Collection = keyof Config['collections'];

// Function to fetch a single document by slug
async function getDocument(collection: Collection, slug: string, depth = 0) {
  const payload = await getPayload({ config: configPromise });

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return page.docs[0];
}

// Function to fetch all users (including admins)
async function getAllUsers() {
  const payload = await getPayload({ config: configPromise });

  console.log("Fetching all users...");

  const users = await payload.find({
    collection: 'users',
    depth: 1,
    pagination: false, // Disable pagination
  });

  console.log("Total users fetched:", users.totalDocs);
  console.log("Users:", users.docs);

  return users.docs;
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string) =>
  unstable_cache(async () => getDocument(collection, slug), [collection, slug], {
    tags: [`${collection}_${slug}`],
  });

// Cache the getAllUsers function
export const getCachedUsers = unstable_cache(async () => getAllUsers(), ['users'], {
  tags: ['users'],
});

// Function to add a new user and revalidate the cache
export async function addUser(newUserData: any) {
  const payload = await getPayload({ config: configPromise });

  // Add the new user
  const newUser = await payload.create({
    collection: 'users',
    data: newUserData,
  });

  console.log("New user added:", newUser);

  // Revalidate the cache to ensure fresh data is fetched next time
  revalidateTag('users');
  console.log("Cache invalidated for 'users' tag");

  return newUser;
}