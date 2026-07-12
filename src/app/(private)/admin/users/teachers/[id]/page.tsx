import { TeacherProfile } from './_components/teacher-profile';

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TeacherProfile teacherId={id} />;
}
