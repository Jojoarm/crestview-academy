import { AssignmentsView } from './_components/assignment-view';

export default async function ChildAssignmentsPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <AssignmentsView studentId={studentId} />;
}
