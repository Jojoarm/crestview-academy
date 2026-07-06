export type PostType = 'Announcement' | 'News' | 'Event';
export type PostStatus = 'Draft' | 'Published';
export type PostAudience = 'Everyone' | 'Teachers' | 'Parents' | 'Students';

export const POST_TYPES: PostType[] = ['Announcement', 'News', 'Event'];
export const POST_AUDIENCES: PostAudience[] = [
  'Everyone',
  'Teachers',
  'Parents',
  'Students',
];

export const POST_TYPE_COLORS: Record<PostType, string> = {
  Announcement: 'bg-amber-50 text-amber-700',
  News: 'bg-light-violet text-deep-violet',
  Event: 'bg-emerald-50 text-emerald-700',
};

export const POST_STATUS_COLORS: Record<PostStatus, string> = {
  Draft: 'bg-muted text-muted-foreground',
  Published: 'bg-terracotta-pale text-primary',
};

export type PostAuthor = {
  id: string;
  name: string;
  email: string;
  userRole: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  type: PostType;
  audience: PostAudience;
  status: PostStatus;
  bannerImageUrl: string | null;
  eventStartDate: string | null;
  eventEndDate: string | null;
  publishedAt: string | null;
  authorId: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
};
