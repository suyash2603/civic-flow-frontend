import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, UserCheck, Clock, Upload, LogOut, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-700 p-2 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900">Admin Dashboard</span>
              <p className="text-xs text-slate-600">{user?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => {
            logout();
            navigate('/');
          }} data-testid="btn-logout">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-indigo-700" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Beneficiaries</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.total_beneficiaries?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <UserCheck className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Verified Users</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.verified_beneficiaries?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-amber-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Pending Requests</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.pending_requests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Payments</p>
                <p className="text-3xl font-bold text-slate-900">{stats?.processed_payments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/admin/bulk-upload')}
              className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-left hover:shadow-md transition-all group"
              data-testid="btn-bulk-upload"
            >
              <div className="bg-indigo-200 p-3 rounded-xl w-fit mb-3 group-hover:bg-indigo-300 transition-colors">
                <Upload className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Bulk Upload</h3>
              <p className="text-sm text-slate-600">Upload beneficiaries and payment data</p>
            </button>

            <button
              onClick={() => navigate('/admin/approvals')}
              className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 text-left hover:shadow-md transition-all group"
              data-testid="btn-approvals"
            >
              <div className="bg-amber-200 p-3 rounded-xl w-fit mb-3 group-hover:bg-amber-300 transition-colors">
                <Clock className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Approval Queue</h3>
              <p className="text-sm text-slate-600">{stats?.pending_requests} pending requests</p>
            </button>

            <button
              onClick={() => navigate('/admin/beneficiaries')}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 text-left hover:shadow-md transition-all group"
              data-testid="btn-beneficiaries"
            >
              <div className="bg-emerald-200 p-3 rounded-xl w-fit mb-3 group-hover:bg-emerald-300 transition-colors">
                <Users className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Manage Beneficiaries</h3>
              <p className="text-sm text-slate-600">View and manage all beneficiaries</p>
            </button>
          </div>
        </div>

        {/* Management Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">System Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Total Surveyors</span>
                <span className="font-bold text-slate-900">{stats?.total_surveyors}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Total Beneficiaries</span>
                <span className="font-bold text-slate-900">{stats?.total_beneficiaries?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Verified Accounts</span>
                <span className="font-bold text-emerald-700">{stats?.verified_beneficiaries?.toLocaleString()}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/admin/surveyors')}
              data-testid="btn-manage-surveyors"
            >
              Manage Surveyors
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h2 className="font-bold text-slate-900 mb-4">Payment Overview</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-700">Total Payments</span>
                <span className="font-bold text-slate-900">{stats?.total_payments}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                <span className="text-slate-700">Processed</span>
                <span className="font-bold text-emerald-700">{stats?.processed_payments}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                <span className="text-slate-700">Pending</span>
                <span className="font-bold text-amber-700">{stats?.total_payments - stats?.processed_payments}</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/admin/bulk-upload')}
              data-testid="btn-upload-payments"
            >
              Upload Payments
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}