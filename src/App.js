import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { ProtectedRoute } from './components/ProtectedRoute';
import '@/App.css';

// Auth Pages
import LandingPage from './pages/LandingPage';
import BeneficiaryLogin from './pages/beneficiary/BeneficiaryLogin';
import SurveyorLogin from './pages/surveyor/SurveyorLogin';
import AdminLogin from './pages/admin/AdminLogin';

// Beneficiary Pages
import BeneficiaryDashboard from './pages/beneficiary/BeneficiaryDashboard';
import BankVerification from './pages/beneficiary/BankVerification';
import DigitalCard from './pages/beneficiary/DigitalCard';
import PaymentHistory from './pages/beneficiary/PaymentHistory';

// Surveyor Pages
import SurveyorDashboard from './pages/surveyor/SurveyorDashboard';
import BeneficiaryList from './pages/surveyor/BeneficiaryList';
import BeneficiaryVerification from './pages/surveyor/BeneficiaryVerification';
import AddNewUser from './pages/surveyor/AddNewUser';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BeneficiaryManagement from './pages/admin/BeneficiaryManagement';
import SurveyorManagement from './pages/admin/SurveyorManagement';
import ApprovalQueue from './pages/admin/ApprovalQueue';
import BulkUpload from './pages/admin/BulkUpload';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/beneficiary/login" element={<BeneficiaryLogin />} />
          <Route path="/surveyor/login" element={<SurveyorLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Beneficiary Routes */}
          <Route
            path="/beneficiary/dashboard"
            element={
              <ProtectedRoute allowedRoles={['beneficiary']}>
                <BeneficiaryDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiary/banks"
            element={
              <ProtectedRoute allowedRoles={['beneficiary']}>
                <BankVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiary/card"
            element={
              <ProtectedRoute allowedRoles={['beneficiary']}>
                <DigitalCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beneficiary/payments"
            element={
              <ProtectedRoute allowedRoles={['beneficiary']}>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />

          {/* Surveyor Routes */}
          <Route
            path="/surveyor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['surveyor']}>
                <SurveyorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveyor/beneficiaries"
            element={
              <ProtectedRoute allowedRoles={['surveyor']}>
                <BeneficiaryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveyor/verify/:uid"
            element={
              <ProtectedRoute allowedRoles={['surveyor']}>
                <BeneficiaryVerification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveyor/add-user"
            element={
              <ProtectedRoute allowedRoles={['surveyor']}>
                <AddNewUser />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/beneficiaries"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BeneficiaryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/surveyors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SurveyorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ApprovalQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bulk-upload"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BulkUpload />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;