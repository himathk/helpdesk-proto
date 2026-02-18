import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModuleProvider } from './context/ModuleContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import CustomerLogin from './pages/CustomerLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminModuleList from './pages/admin/AdminModuleList';
import AdminModuleForm from './pages/admin/AdminModuleForm';
import AdminModuleDetail from './pages/admin/AdminModuleDetail';
import AdminGuideForm from './pages/admin/AdminGuideForm';
import AdminUserForm from './pages/admin/AdminUserForm';
import AdminCustomerManager from './pages/admin/AdminCustomerManager';
import Home from './pages/Home';
import ModuleDetail from './pages/ModuleDetail';
import GuideDetail from './pages/GuideDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModuleProvider>
          <AdminProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="modules" element={<Home />} />
                <Route path="resources" element={<Home />} />
                <Route path="module/:moduleId" element={<ModuleDetail />} />
                <Route path="module/:moduleId/:guideId" element={<GuideDetail />} />
              </Route>
              
              {/* Auth Routes */}
              <Route path="/login" element={<CustomerLogin />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminCustomerManager />} />
                <Route path="users/new" element={<AdminUserForm />} />
                <Route path="users/edit/:id" element={<AdminUserForm />} />
                <Route path="modules" element={<AdminModuleList />} />
                <Route path="modules/new" element={<AdminModuleForm />} />
                <Route path="modules/edit/:moduleId" element={<AdminModuleForm />} />
                <Route path="modules/:moduleId" element={<AdminModuleDetail />} />
                <Route path="modules/:moduleId/guides/new" element={<AdminGuideForm />} />
                <Route path="modules/:moduleId/guides/edit/:guideId" element={<AdminGuideForm />} />
              </Route>
            </Routes>
          </AdminProvider>
        </ModuleProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
