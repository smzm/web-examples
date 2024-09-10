import { SessionProvider } from '@/app/components/contexts/session';
import ArrowLeft from '@/app/components/icons/ArrowLeft';
import LayoutAside from './_components/layout-aside';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="mx-auto flex h-screen w-full">
        <aside className="hidden h-full w-96 bg-night-800 lg:block">
          <LayoutAside />
        </aside>

        <section className="mx-auto mt-12 h-fit w-4/5 max-w-lg p-4 transition-all md:mt-32 lg:w-2/5">
          <SessionProvider>{children}</SessionProvider>
        </section>
      </div>
    </main>
  );
}
