import { ReportCardDetail } from './_components/report-card-detail';

export default async function ReportCardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ classArmId: string; studentId: string }>;
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const { classArmId, studentId } = await params;
  const { sessionId } = await searchParams;
  return (
    <ReportCardDetail
      classArmId={classArmId}
      studentId={studentId}
      initialSessionId={sessionId}
    />
  );
}
