import { cookies } from 'next/headers';
import { apiClient, ApiError } from './api-client';
import { UserRole } from './roles';

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  userRole: UserRole;
  forcePasswordChange: boolean;
};

// Fetch the current user server-side using the incoming request's cookes
// Returns null if there is no valid session

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieHeader = (await cookies()).toString();

    const store = await cookies();

    console.log(
      store.getAll().map((c) => ({
        name: c.name,
        value: c.value.slice(0, 20),
      })),
    );

    const user = await apiClient.get<CurrentUser>('/api/profile/me', {
      cookieHeader,
    });
    return user;
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}
