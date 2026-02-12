import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModuleProvider } from './context/ModuleContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminModuleList from './pages/admin/AdminModuleList';
import AdminModuleForm from './pages/admin/AdminModuleForm';
import AdminModuleDetail from './pages/admin/AdminModuleDetail';
import AdminGuideForm from './pages/admin/AdminGuideForm';
import Home from './pages/Home';
import ModuleDetail from './pages/ModuleDetail';
import GuideDetail from './pages/GuideDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModuleProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="modules" element={<Home />} />
              <Route path="resources" element={<Home />} />
              <Route path="module/:moduleId" element={<ModuleDetail />} />
              <Route path="guide/:guideId" element={<GuideDetail />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="modules" element={<AdminModuleList />} />
              <Route path="modules/new" element={<AdminModuleForm />} />
              <Route path="modules/edit/:moduleId" element={<AdminModuleForm />} />
              <Route path="modules/:moduleId" element={<AdminModuleDetail />} />
              <Route path="modules/:moduleId/guides/new" element={<AdminGuideForm />} />
              <Route path="modules/:moduleId/guides/edit/:guideId" element={<AdminGuideForm />} />
            </Route>
          </Routes>
        </ModuleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
