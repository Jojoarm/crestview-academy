export type PostType = 'Announcement' | 'News' | 'Event';

export type PostAudience = 'Everyone' | 'Teachers';

export interface TeacherPost {
  id: string;
  title: string;
  content: string;
  type: PostType;
  audience: PostAudience;
  bannerImageUrl: string | null;
  eventStartDate: string | null; // only set for type: 'Event'
  eventEndDate: string | null;
  publishedAt: string;
  author: { user: { name: string } };
}

export interface TeacherPostListParams {
  type?: PostType;
  page?: number;
  limit?: number;
}

export const POST_TYPES: PostType[] = ['Announcement', 'News', 'Event'];

export const POST_TYPE_COLORS: Record<PostType, string> = {
  Announcement: 'bg-terracotta-pale text-primary',
  News: 'bg-light-violet text-deep-violet',
  Event: 'bg-emerald-100 text-emerald-700',
};
