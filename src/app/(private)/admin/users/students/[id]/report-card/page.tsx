import { ReportCardView } from './_components/report-card-view';

export default async function AdminStudentReportCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReportCardView studentId={id} />;
}
