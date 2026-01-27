import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function BankVerification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/beneficiary/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyBank = async (accountNumber) => {
    try {
      await api.post('/beneficiary/verify-bank', {
        uid: user.uid,
        account_number: accountNumber
      });
      toast.success('Bank account verified successfully!');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to verify bank account');
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
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/beneficiary/dashboard')}
            data-testid="btn-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Bank Account Verification</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-900 text-sm">
            Select a linked bank account below to view its status or initiate a fresh verification. Ensure your details are accurate for seamless scheme benefit delivery.
          </p>
        </div>

        {/* Bank Accounts List */}
        <div className="space-y-4">
          {profile?.bank_accounts?.map((bank, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{bank.bank_name}</h3>
                  <div className="space-y-1">
                    <p className="text-slate-600">
                      <span className="font-medium">Account:</span> {bank.account_number}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-medium">IFSC Code:</span> {bank.ifsc_code}
                    </p>
                    <p className="text-slate-600">
                      <span className="font-medium">Payment Status:</span>{' '}
                      <span className={`font-semibold ${
                        bank.payment_status === 'processed' ? 'text-emerald-700' :
                        bank.payment_status === 'failed' ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {bank.payment_status.charAt(0).toUpperCase() + bank.payment_status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  {bank.verification_status === 'verified' && (
                    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-full">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Verified</span>
                    </div>
                  )}
                  {bank.verification_status === 'pending' && (
                    <div className="flex items-center gap-2 bg-amber-100 text-amber-700 border border-amber-200 px-3 py-2 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Pending</span>
                    </div>
                  )}
                  {bank.verification_status === 'rejected' && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-full">
                      <XCircle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Rejected</span>
                    </div>
                  )}
                </div>
              </div>

              {bank.payment_status === 'processed' && (
                <button
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-2 mb-4"
                  data-testid={`btn-view-payment-history-${index}`}
                  onClick={() => navigate('/beneficiary/payments')}
                >
                  View Payment History
                  <Download className="w-4 h-4" />
                </button>
              )}

              {bank.verification_status !== 'verified' && (
                <Button
                  className="w-full bg-indigo-700 hover:bg-indigo-800 text-white rounded-full h-12 font-semibold"
                  onClick={() => handleVerifyBank(bank.account_number)}
                  data-testid={`btn-verify-account-${index}`}
                >
                  Verify Selected Account
                </Button>
              )}
            </div>
          ))}
        </div>

        {(!profile?.bank_accounts || profile.bank_accounts.length === 0) && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-500">No bank accounts linked yet</p>
          </div>
        )}
      </div>
    </div>
  );
}