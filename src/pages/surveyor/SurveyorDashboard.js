import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Search, UserPlus, UserX, Eye, LogOut, Users, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function SurveyorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filter, setFilter] = useState('not_verified');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [dashboardRes, beneficiariesRes] = await Promise.all([
        api.get('/surveyor/dashboard'),
        api.get('/surveyor/beneficiaries', { params: { verification_status: filter } })
      ]);
      setDashboardData(dashboardRes.data);
      setBeneficiaries(beneficiariesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.uid.includes(searchTerm)
  );

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
            <div>
              <span className="font-bold text-lg text-slate-900">Surveyor Dashboard</span>
              <p className="text-xs text-slate-600">{dashboardData?.surveyor?.name}</p>
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

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search beneficiaries or areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white border-slate-200 rounded-xl"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <h2 className="font-bold text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => setFilter('not_verified')}
              className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 text-center transition-colors group"
              data-testid="btn-manually-verify"
            >
              <div className="bg-indigo-100 p-3 rounded-xl w-fit mx-auto mb-2 group-hover:bg-indigo-200 transition-colors">
                <Users className="w-6 h-6 text-indigo-700" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Manually Verify Accounts</p>
            </button>

            <button
              onClick={() => navigate('/surveyor/beneficiaries')}
              className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 text-center transition-colors group"
              data-testid="btn-run-campaigns"
            >
              <div className="bg-emerald-100 p-3 rounded-xl w-fit mx-auto mb-2 group-hover:bg-emerald-200 transition-colors">
                <Eye className="w-6 h-6 text-emerald-700" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Run Offline Campaigns</p>
            </button>

            <button
              onClick={() => navigate('/surveyor/add-user')}
              className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 text-center transition-colors group"
              data-testid="btn-add-new-user"
            >
              <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                <UserPlus className="w-6 h-6 text-blue-700" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Add New User</p>
            </button>

            <button
              className="bg-slate-50 hover:bg-slate-100 rounded-xl p-4 text-center transition-colors group"
              data-testid="btn-mark-ineligible"
            >
              <div className="bg-red-100 p-3 rounded-xl w-fit mx-auto mb-2 group-hover:bg-red-200 transition-colors">
                <UserX className="w-6 h-6 text-red-700" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Mark Ineligible</p>
            </button>
          </div>
        </div>

        {/* Allocated Areas */}
        {/* <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900">Allocated Areas</h2>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700" data-testid="link-view-all-areas">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {dashboardData?.area_stats?.map((area, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{area.area}</span>
                  <span className="text-sm text-slate-600">
                    {area.percentage}% Verified ({area.verified_users}/{area.total_users} Users)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-700 h-2 rounded-full transition-all"
                    style={{ width: `${area.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Beneficiary Management */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h2 className="font-bold text-slate-900 mb-3">Beneficiary Management</h2>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setFilter('not_verified')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                filter === 'not_verified'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              data-testid="tab-not-verified"
            >
              Not-Verified Users ({beneficiaries.filter(b => b.bank_accounts?.some(acc => acc.verification_status !== 'verified')).length})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                filter === 'verified'
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              data-testid="tab-verified"
            >
              Verified Users ({beneficiaries.filter(b => b.bank_accounts?.some(acc => acc.verification_status === 'verified')).length})
            </button>
          </div>

          {/* Beneficiary List */}
          <div className="space-y-3">
            {filteredBeneficiaries.slice(0, 10).map((beneficiary, index) => {
              const hasVerifiedAccount = beneficiary.bank_accounts?.some(acc => acc.verification_status === 'verified');
              const eligibilityColor = beneficiary.eligibility_status === 'ineligible' ? 'text-red-600' : beneficiary.eligibility_status === 'pending_review' ? 'text-amber-600' : 'text-slate-600';
              
              return (
                <div
                  key={beneficiary.uid}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/surveyor/verify/${beneficiary.uid}`)}
                  data-testid={`beneficiary-item-${index}`}
                >
                  <div className="bg-slate-300 w-12 h-12 rounded-full flex items-center justify-center text-slate-600 font-bold">
                    {beneficiary.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{beneficiary.name}</p>
                    <p className="text-sm text-slate-600">UID: {beneficiary.uid}</p>
                  </div>
                  <div>
                    {hasVerifiedAccount ? (
                      <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Verified
                      </span>
                    ) : beneficiary.eligibility_status === 'ineligible' ? (
                      <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Ineligible
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Pending
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" data-testid={`btn-view-details-${index}`}>
                    <Eye className="w-5 h-5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}