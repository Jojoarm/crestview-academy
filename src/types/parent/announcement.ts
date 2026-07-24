export type PostType = 'Announcement' | 'News' | 'Event';
export type PostAudience =
  | 'Everyone'
  | 'Teachers'
  | 'Parents'
  | 'Students'
  | 'Admins';

export interface PostSummary {
  id: string;
  title: string;
  content: string;
  type: PostType;
  audience: PostAudience;
  bannerImageUrl: string | null;
  eventStartDate: string | null;
  eventEndDate: string | null;
  publishedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostsListResponse {
  data: PostSummary[];
  meta: PaginationMeta;
}

export interface PostsListParams {
  type?: PostType;
  page?: number;
  limit?: number;
}

export const POST_TYPE_COLORS: Record<PostType, string> = {
  Announcement: 'bg-terracotta-pale text-primary',
  News: 'bg-light-violet text-deep-violet',
  Event: 'bg-emerald-100 text-emerald-700',
};
