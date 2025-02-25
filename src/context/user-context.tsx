// user-context.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// Define the User type based on your Payload CMS users collection
type User = {
  id: string;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: string;
  image?: string; // Assuming image is a string (URL or ID)
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children, initialUser }: { children: ReactNode; initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(!initialUser); // Set loading state based on initialUser

  // Revalidate user data on the client side if needed
  useEffect(() => {
    const revalidateUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/user`);
        const { user: updatedUser } = await response.json();
        setUser(updatedUser);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to revalidate user:", error);
        setIsLoading(false);
      }
    };

    if (!initialUser) {
      revalidateUser();
    }
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};