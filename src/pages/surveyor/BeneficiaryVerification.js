import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import api from '../../utils/api';

export default function BeneficiaryVerification() {
  const navigate = useNavigate();
  const { uid } = useParams();
  const [beneficiary, setBeneficiary] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('verified');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiary();
  }, [uid]);

  const fetchBeneficiary = async () => {
    try {
      const response = await api.get('/surveyor/beneficiaries');
      const beneficiary = response.data.find(b => b.uid === uid);
      setBeneficiary(beneficiary);
    } catch (error) {
      console.error('Failed to fetch beneficiary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!beneficiary?.bank_accounts?.[0]) {
      toast.error('No bank account found');
      return;
    }

    try {
      await api.post('/surveyor/verify-bank', {
        uid: beneficiary.uid,
        account_number: beneficiary.bank_accounts[0].account_number
      });
      toast.success('Bank account verified successfully!');
      navigate('/surveyor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to verify');
    }
  };

  const handleMarkIneligible = async () => {
    if (!notes) {
      toast.error('Please provide a reason');
      return;
    }

    try {
      await api.post('/surveyor/mark-ineligible', {
        uid: beneficiary.uid,
        reason: notes
      });
      toast.success('Request sent to admin for approval');
      navigate('/surveyor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
      </div>
    );
  }

  if (!beneficiary) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-600">Beneficiary not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/surveyor/dashboard')}
            data-testid="btn-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Beneficiary Verification</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Beneficiary Details */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Beneficiary Details</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold text-slate-700">Beneficiary ID:</span> <span className="text-slate-900">{beneficiary.uid}</span></p>
            <p><span className="font-semibold text-slate-700">Name:</span> <span className="text-slate-900">{beneficiary.name}</span></p>
            {beneficiary.bank_accounts?.[0] && (
              <>
                <p><span className="font-semibold text-slate-700">Bank Account Number:</span> <span className="text-slate-900">{beneficiary.bank_accounts[0].account_number}</span></p>
                <p><span className="font-semibold text-slate-700">Bank Name:</span> <span className="text-slate-900">{beneficiary.bank_accounts[0].bank_name}</span></p>
                <p><span className="font-semibold text-slate-700">IFSC Code:</span> <span className="text-slate-900">{beneficiary.bank_accounts[0].ifsc_code}</span></p>
              </>
            )}
            <div className="pt-2">
              <span className="font-semibold text-slate-700">Current Status:</span>{' '}
              <span className="bg-pink-100 text-pink-700 border border-pink-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                Pending Admin Review
              </span>
            </div>
          </div>
        </div>

        {/* Mark Verification Status */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Mark Verification Status</h2>
          <RadioGroup value={verificationStatus} onValueChange={setVerificationStatus}>
            <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-xl mb-3">
              <RadioGroupItem value="verified" id="verified" data-testid="radio-verified" />
              <Label htmlFor="verified" className="flex items-center gap-2 cursor-pointer">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
                <span className="font-semibold text-slate-900">Mark as Verified</span>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-xl">
              <RadioGroupItem value="ineligible" id="ineligible" data-testid="radio-ineligible" />
              <Label htmlFor="ineligible" className="flex items-center gap-2 cursor-pointer">
                <XCircle className="w-5 h-5 text-red-700" />
                <span className="font-semibold text-slate-900">Mark as Ineligible</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Add Notes */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-2">Add Notes</h2>
          <p className="text-sm text-slate-600 mb-3">Verification Notes</p>
          <Textarea
            placeholder="Enter detailed notes regarding the verification process, discrepancies, or observations here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
            data-testid="textarea-notes"
          />
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Admin Actions</h2>
          <div className="space-y-3">
            {verificationStatus === 'ineligible' ? (
              <Button
                onClick={handleMarkIneligible}
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 rounded-full font-semibold"
                data-testid="btn-request-removal"
              >
                Request User Removal
              </Button>
            ) : (
              <Button
                onClick={handleVerify}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white h-12 rounded-full font-semibold"
                data-testid="btn-approve-user"
              >
                Approve New User
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}