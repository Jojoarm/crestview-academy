import { ReportCardView } from './_components/report-card-view';

export default async function ChildReportCardPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  return <ReportCardView studentId={studentId} />;
}
