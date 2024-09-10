import { SessionProvider } from '@/app/components/contexts/session';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider> {children} </SessionProvider>;
}
