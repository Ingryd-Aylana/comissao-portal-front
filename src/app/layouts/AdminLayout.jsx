import AppShell from './AppShell';

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <AppShell title={title || 'Painel Administrativo'} subtitle={subtitle}>
      {children}
    </AppShell>
  );
}