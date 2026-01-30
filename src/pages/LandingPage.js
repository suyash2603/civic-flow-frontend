import { useNavigate } from 'react-router-dom';
import { Shield, UserCircle, Users } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-700 p-4 rounded-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            GovScheme Manager
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Manage government schemes, verify beneficiaries, and track payments efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
            onClick={() => navigate('/beneficiary/login')}
            data-testid="card-beneficiary-login"
          >
            <div className="bg-emerald-100 p-3 rounded-xl w-fit mb-4 group-hover:bg-emerald-200 transition-colors">
              <UserCircle className="w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Beneficiary</h2>
            <p className="text-slate-600 mb-6">
              Check your schemes, verify bank accounts, and view payment status
            </p>
            <Button
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white rounded-full h-12 font-semibold"
              data-testid="btn-beneficiary-login"
            >
              Login with OTP
            </Button>
          </div>

          <div
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
            onClick={() => navigate('/surveyor/login')}
            data-testid="card-surveyor-login"
          >
            <div className="bg-indigo-100 p-3 rounded-xl w-fit mb-4 group-hover:bg-indigo-200 transition-colors">
              <Users className="w-8 h-8 text-indigo-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Surveyor</h2>
            <p className="text-slate-600 mb-6">
              Verify beneficiaries and run campaigns
            </p>
            <Button
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white rounded-full h-12 font-semibold"
              data-testid="btn-surveyor-login"
            >
              Surveyor Login
            </Button>
          </div>

          <div
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
            onClick={() => navigate('/admin/login')}
            data-testid="card-admin-login"
          >
            <div className="bg-amber-100 p-3 rounded-xl w-fit mb-4 group-hover:bg-amber-200 transition-colors">
              <Shield className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin</h2>
            <p className="text-slate-600 mb-6">
              Bulk uploads, manage surveyors, approve requests, and oversee all operations
            </p>
            <Button
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white rounded-full h-12 font-semibold"
              data-testid="btn-admin-login"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}