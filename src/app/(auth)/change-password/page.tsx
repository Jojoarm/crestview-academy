import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/get-current-user';
import { getDashboardPathForRole } from '@/lib/roles';
import { ChangePasswordForm } from './_components/ChangePasswordForm';

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();

  // Not logged in at all — nothing to change.
  if (!user) {
    redirect('/auth/login');
  }

  // Logged in but already cleared — they shouldn't be here.
  if (!user.forcePasswordChange) {
    redirect(getDashboardPathForRole(user.userRole));
  }

  return (
    <div className="bg-white border border-(--border-sand) px-8 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl text-(--charcoal)">
          Set a new password
        </h1>
        <p className="font-body text-sm text-(--charcoal-100) mt-2">
          You&apos;re using a temporary password. Please set a new one to
          continue.
        </p>
      </div>

      <ChangePasswordForm userRole={user.userRole} />
    </div>
  );
}
