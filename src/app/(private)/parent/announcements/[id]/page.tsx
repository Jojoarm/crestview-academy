import { AnnouncementDetail } from '../_components/announcement-detail';

export default async function ParentAnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnnouncementDetail postId={id} />;
}
