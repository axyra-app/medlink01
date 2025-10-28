import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';

// Patient pages
import DoctorEnRoute from '@/pages/patient/DoctorEnRoute';
import PatientHome from '@/pages/patient/PatientHome';
import ReviewPage from '@/pages/patient/ReviewPage';
import ServiceInProgress from '@/pages/patient/ServiceInProgress';
import WaitingForDoctor from '@/pages/patient/WaitingForDoctor';

// Doctor pages
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import DoctorServiceDetail from '@/pages/doctor/DoctorServiceDetail';

// Protected Route Component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo: string;
}> = ({ children, allowedRoles, redirectTo }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirigir según el rol
    if (role === 'doctor') {
      return <Navigate to='/doctor/dashboard' replace />;
    } else if (role === 'patient') {
      return <Navigate to='/home' replace />;
    }
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <Routes>
          {/* Public Routes */}
          <Route
            path='/login'
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path='/signup'
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />

          {/* Patient Routes */}
          <Route
            path='/home'
            element={
              <ProtectedRoute allowedRoles={['patient']} redirectTo='/doctor/dashboard'>
                <PatientHome />
              </ProtectedRoute>
            }
          />
          <Route
            path='/patient/request/:id/waiting'
            element={
              <ProtectedRoute allowedRoles={['patient']} redirectTo='/doctor/dashboard'>
                <WaitingForDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path='/patient/request/:id/en-route'
            element={
              <ProtectedRoute allowedRoles={['patient']} redirectTo='/doctor/dashboard'>
                <DoctorEnRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path='/patient/request/:id/in-progress'
            element={
              <ProtectedRoute allowedRoles={['patient']} redirectTo='/doctor/dashboard'>
                <ServiceInProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path='/patient/review/:id'
            element={
              <ProtectedRoute allowedRoles={['patient']} redirectTo='/doctor/dashboard'>
                <ReviewPage />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path='/doctor/dashboard'
            element={
              <ProtectedRoute allowedRoles={['doctor']} redirectTo='/home'>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/doctor/service/:id'
            element={
              <ProtectedRoute allowedRoles={['doctor']} redirectTo='/home'>
                <DoctorServiceDetail />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path='/' element={<Navigate to='/login' replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
