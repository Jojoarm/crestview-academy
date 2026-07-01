import { UserStats } from './_components/user-stats';
import { UsersTable } from './_components/users-table';

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <UserStats />
      <UsersTable />
    </div>
  );
}
