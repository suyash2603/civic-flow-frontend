import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function BeneficiaryLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [uid, setUid] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!uid || !mobile) {
      toast.error('Please enter both UID and mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/beneficiary/otp/send', { uid, mobile });
      toast.success(`OTP sent! Demo OTP: ${response.data.otp}`);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/beneficiary/otp/verify', { uid, mobile, otp });
      login({ ...response.data.user, role: 'beneficiary' }, response.data.token);
      toast.success('Login successful!');
      navigate('/beneficiary/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="gap-2"
          data-testid="btn-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-indigo-700 p-4 rounded-2xl w-fit mx-auto mb-4">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Beneficiary Login</h1>
            <p className="text-slate-600">
              Enter your registered UID and mobile number to receive an OTP.
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <Label htmlFor="uid" className="text-slate-700 font-medium mb-2 block">
                  Unique ID (UID)
                </Label>
                <Input
                  id="uid"
                  type="text"
                  placeholder="Enter your UID"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
                  data-testid="input-uid"
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-slate-700 font-medium mb-2 block">
                  Registered Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl"
                  data-testid="input-mobile"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white h-12 rounded-full font-semibold shadow-lg shadow-indigo-500/20"
                data-testid="btn-send-otp"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    OTP sent to {mobile}
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="otp" className="text-slate-700 font-medium mb-2 block">
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="h-12 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-xl text-center text-2xl tracking-widest"
                  data-testid="input-otp"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white h-12 rounded-full font-semibold shadow-lg shadow-indigo-500/20"
                data-testid="btn-verify-otp"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full"
                data-testid="btn-change-number"
              >
                Change Number
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/surveyor/login')}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              data-testid="link-surveyor-admin-login"
            >
              Surveyor / Admin Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}