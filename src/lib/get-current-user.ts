import { cookies } from 'next/headers';
import { apiClient, ApiError } from './api-client';
import { CurrentUser } from './types';

// Fetch the current user server-side using the incoming request's cookes
// Returns null if there is no valid session

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieHeader = (await cookies()).toString();

    const user = await apiClient.get<CurrentUser>('/api/profile/me', {
      cookieHeader,
    });
    return user;
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}
