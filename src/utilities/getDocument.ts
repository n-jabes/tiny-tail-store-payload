import type { Config } from 'src/payload-types';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

type Collection = keyof Config['collections'];

// Function to fetch a single document by slug
export async function getDocument(collection: Collection, slug: string, depth = 0) {
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
export async function getAllUsers() {
  const payload = await getPayload({ config: configPromise });

  // console.log("Fetching all users...");

  const users = await payload.find({
    collection: 'users',
    depth: 1,
    pagination: false, // Disable pagination
  });

  console.log("Total users fetched:", users.totalDocs);
  // console.log("Users:", users.docs);

  return users.docs;
}