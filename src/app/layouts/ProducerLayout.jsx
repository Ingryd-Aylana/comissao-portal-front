
import AppShell from './AppShell';

export default function ProducerLayout({ children, title, subtitle }) {
  return (
    <AppShell title={title || 'Área do Produtor'} subtitle={subtitle}>
      {children}
    </AppShell>
  );
}