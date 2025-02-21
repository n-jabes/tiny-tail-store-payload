import Pro from './Pro'; // Your client component
import { getCachedUsers } from '@/utilities/getDocument';

export default async function AdminProPage() {
  // Fetch all users (excluding admins)
  const users = await getCachedUsers();
  console.log("users: ", users)

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

  // Pass the transformed data to the client component
  return <Pro users={transformedUsers} />;
}