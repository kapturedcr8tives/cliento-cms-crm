import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ClientsPage } from './pages/ClientsPage';
import { LeadsPage } from './pages/LeadsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ContractsPage } from './pages/ContractsPage';
import { ContractEditorPage } from './pages/ContractEditorPage';
import { ContractSigningPage } from './pages/ContractSigningPage';
import { TeamPage } from './pages/TeamPage';
import { AcceptInvitePage } from './pages/AcceptInvitePage';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/sign/:contractId" element={<ContractSigningPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Clients Route */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Layout>
                <ClientsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Leads Route */}
        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Layout>
                <LeadsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Projects Route */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Project Detail Route */}
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectDetailPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Contracts Route */}
        <Route
          path="/contracts"
          element={
            <ProtectedRoute>
              <Layout>
                <ContractsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Contract Editor Route */}
        <Route
          path="/contracts/:contractId"
          element={
            <ProtectedRoute>
              <Layout>
                <ContractEditorPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected Team Route */}
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect to dashboard by default */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
