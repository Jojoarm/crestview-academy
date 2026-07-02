import { ActiveSessionBanner } from './_components/active-session-banner';
import { SessionsList } from './_components/sessions-list';

export default function SessionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ActiveSessionBanner />
      <SessionsList />
    </div>
  );
}
