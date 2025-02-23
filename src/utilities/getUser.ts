// src/utilities/getUser.ts
import { headers as getHeaders } from 'next/headers';
import { getPayload } from 'payload';
import config from '@/payload.config';

export const getUser = async () => {
  try {
    const headers = await getHeaders();
    const payloadConfig = await config;
    const payload = await getPayload({ config: payloadConfig });
    const { user } = await payload.auth({ headers });

    if (!user) {
      console.log("No user found in session.");
      return { user: null, payload: null };
    }

    return { user, payload };
  } catch (error) {
    console.log("Error getting user: ", error);
    return { user: null, payload: null };
  }
};