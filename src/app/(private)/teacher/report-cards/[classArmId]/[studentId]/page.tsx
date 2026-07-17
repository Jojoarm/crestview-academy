import { ReportCardDetail } from './_components/report-card-detail';

export default async function ReportCardDetailPage({
  params,
}: {
  params: Promise<{ classArmId: string; studentId: string }>;
}) {
  const { classArmId, studentId } = await params;
  return <ReportCardDetail classArmId={classArmId} studentId={studentId} />;
}
