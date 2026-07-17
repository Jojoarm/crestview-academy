import { AnnouncementDetail } from './_components/announcement-details';

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AnnouncementDetail postId={id} />;
}
