// app/profile/page.tsx
import { getUser } from '@/utilities/getUser';
import ProfilePage from './ProfilePage';

export default async function Page() {
  const { user } = await getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return <ProfilePage user={user} />;
}