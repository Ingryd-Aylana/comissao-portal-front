import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import PageContainer from "../../components/layout/PageContainer";

export default function AppShell({ children, title, subtitle }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-shell__main">
        <Topbar title={title} subtitle={subtitle} />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}