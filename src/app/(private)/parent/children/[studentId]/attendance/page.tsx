import { AttendanceView } from './_components/attendance-view';

export default async function ChildAttendancePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  return <AttendanceView studentId={studentId} />;
}
