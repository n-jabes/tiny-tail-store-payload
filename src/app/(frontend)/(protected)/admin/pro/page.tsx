// app/admin/pro/page.tsx
import Pro from './Pro'; // Your client component
import { getAllUsers } from '@/utilities/getDocument'; // Import the updated function
import { getPayload } from 'payload';
import configPromise from '@payload-config';

// Mark this function as a Server Action
async function addUser(newUserData: any) {
  'use server'; // Add this directive

  const payload = await getPayload({ config: configPromise });

  // Add the new user
  const newUser = await payload.create({
    collection: 'users',
    data: newUserData,
  });

  console.log("New user added:", newUser);

  return newUser;
}

export default async function AdminProPage() {
  // Fetch all users (excluding admins)
  const users = await getAllUsers(); // Use the updated function

  // Transform the data into the required format
  const transformedUsers = users.map((user, index) => ({
    id: index,
    userId: user.id,
    name: user.name || 'Unknown',
    email: user.email || 'No email',
    plans: '-', // Dummy data
    spend: '0.00 USD', // Dummy data
    role: user.role || 'Editor', // Use real role or fallback
    status: 'Pending', // Dummy data
    joined: new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }), // Format joined date
  }));

  // Pass the transformed data and the addUser function to the client component
  return <Pro users={transformedUsers} addUser={addUser} />;
}