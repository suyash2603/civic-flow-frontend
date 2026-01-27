import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CreditCard, Bell, LogOut, ChevronRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function BeneficiaryDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, paymentsRes] = await Promise.all([
        api.get('/beneficiary/profile'),
        api.get('/beneficiary/payments')
      ]);
      setProfile(profileRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalReceived = payments.filter(p => p.status === 'processed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

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
            <div className="bg-indigo-700 p-2 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">GovScheme Manager</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" data-testid="btn-notifications">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {
              logout();
              navigate('/');
            }} data-testid="btn-logout">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-2xl p-6 text-white mb-6">
          <h1 className="text-2xl font-bold mb-1">Welcome, {profile?.name}</h1>
          <p className="text-indigo-200 mb-1">UID: {profile?.uid}</p>
          <p className="text-sm text-indigo-300">Stay updated with your scheme benefits and payment statuses.</p>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <h2 className="font-bold text-slate-900 mb-3">Recent Notifications</h2>
          {payments.length > 0 && payments[0].status === 'processed' && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-blue-900 font-medium">
                  Payment of ₹{payments[0].amount.toLocaleString()} for {payments[0].scheme_name} has been credited to your account.
                </p>
                <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="font-bold text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/beneficiary/card')}
              className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:border-indigo-100 transition-all text-left group"
              data-testid="btn-digital-card"
            >
              <div className="bg-indigo-100 p-3 rounded-xl w-fit mb-2 group-hover:bg-indigo-200 transition-colors">
                <CreditCard className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Digital Card</h3>
              <p className="text-sm text-slate-600">View your digital ID card</p>
            </button>

            <button
              onClick={() => navigate('/beneficiary/banks')}
              className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md hover:border-indigo-100 transition-all text-left group"
              data-testid="btn-bank-accounts"
            >
              <div className="bg-emerald-100 p-3 rounded-xl w-fit mb-2 group-hover:bg-emerald-200 transition-colors">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">Bank Accounts</h3>
              <p className="text-sm text-slate-600">Verify & manage accounts</p>
            </button>
          </div>
        </div>

        {/* Linked Bank Accounts */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900">Linked Bank Accounts</h2>
            <button
              onClick={() => navigate('/beneficiary/banks')}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
              data-testid="link-view-all-banks"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {profile?.bank_accounts?.slice(0, 2).map((bank, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{bank.bank_name}</p>
                  <p className="text-sm text-slate-600">{bank.account_number}</p>
                  <p className="text-xs text-slate-500 mt-1">{bank.ifsc_code}</p>
                </div>
                <div>
                  {bank.verification_status === 'verified' && (
                    <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase" data-testid="badge-verified">
                      Verified
                    </span>
                  )}
                  {bank.verification_status === 'pending' && (
                    <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase" data-testid="badge-pending">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schemes Availed */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <h2 className="font-bold text-slate-900 mb-3">Schemes Availed</h2>
          <div className="space-y-3">
            {profile?.schemes?.map((scheme, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{scheme.scheme_name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Enrolled: {new Date(scheme.enrolled_date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">
                    Last update: {new Date(scheme.last_update).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  scheme.status === 'active' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {scheme.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Status Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h2 className="font-bold text-slate-900 mb-4">Payment Status Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-3xl font-bold text-emerald-700">₹{totalReceived.toLocaleString()}</div>
              <div className="text-sm text-emerald-600 mt-1">Received</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-3xl font-bold text-amber-700">₹{totalPending.toLocaleString()}</div>
              <div className="text-sm text-amber-600 mt-1">Pending</div>
            </div>
          </div>
          {payments.length > 0 && (
            <p className="text-xs text-slate-500 text-center mt-3">
              Last payment: {new Date(payments[0].payment_date).toLocaleDateString()}
            </p>
          )}
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => navigate('/beneficiary/payments')}
            data-testid="btn-view-payment-history"
          >
            View Payment History
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}