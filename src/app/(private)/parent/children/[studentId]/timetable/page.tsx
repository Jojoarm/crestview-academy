import { TimetableView } from './_components/timetable-view';

export default async function ChildTimetablePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <TimetableView studentId={studentId} />;
}
