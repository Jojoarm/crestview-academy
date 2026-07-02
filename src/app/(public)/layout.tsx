import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ScrollToTop from '@/components/ScrollToTop';
import { getCurrentUser } from '@/lib/get-current-user';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />
      <ScrollToTop />
      {children}
      <Footer />
    </>
  );
}
