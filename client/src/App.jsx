import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import AdminProjects from './pages/AdminProjects';
import SearchResults from './pages/SearchResults';
import MyProjects from './pages/MyProjects';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import UploadRedirect from './pages/UploadRedirect';
import Office from './pages/Office';
import Client from './pages/Client';
import ClientPortal from './pages/ClientPortal';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

  // Restrict employee/admin routes from 'client' role if needed, or route them properly
  // If a 'client' tries to access /dashboard, send them to /client-portal
  if (user.role === 'client' && window.location.pathname !== '/client-portal' && window.location.pathname !== '/profile') {
      return <Navigate to="/client-portal" />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-[#e6f1fc] via-[#edf5fd] to-[#f6faff] dark:from-[#060b19] dark:via-[#091126] dark:to-[#060a17] dark:bg-[#060b19] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64">
        <Navbar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Employee Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MyProjects />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadRedirect />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            } />
            <Route path="/office" element={
              <ProtectedRoute>
                <Office />
              </ProtectedRoute>
            } />
            <Route path="/client" element={
              <ProtectedRoute>
                <Client />
              </ProtectedRoute>
            } />
            <Route path="/client-portal" element={
              <ProtectedRoute>
                <ClientPortal />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/office" element={
              <ProtectedRoute adminOnly>
                <Office />
              </ProtectedRoute>
            } />
            <Route path="/admin/client" element={
              <ProtectedRoute adminOnly>
                <Client />
              </ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
              <ProtectedRoute adminOnly>
                <Departments />
              </ProtectedRoute>
            } />
            <Route path="/admin/employees" element={
              <ProtectedRoute adminOnly>
                <Employees />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute adminOnly>
                <AdminProjects />
              </ProtectedRoute>
            } />
            <Route path="/admin/search" element={
              <ProtectedRoute adminOnly>
                <SearchResults />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
