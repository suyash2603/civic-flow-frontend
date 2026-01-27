import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Shield, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

export default function DigitalCard() {
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

  const handleDownloadCard = () => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    window.open(`${backendUrl}/api/beneficiary/card/${user.uid}`, '_blank');
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
          <h1 className="text-xl font-bold text-slate-900">Digital ID Card</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Digital Card */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Government Scheme Digital ID</h2>
                <p className="text-white/80 text-sm">Republic of India</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Name</p>
                <p className="text-2xl font-bold">{profile?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">UID</p>
                  <p className="text-lg font-semibold">{profile?.uid}</p>
                </div>
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Mobile</p>
                  <p className="text-lg font-semibold">{profile?.mobile}</p>
                </div>
              </div>

              <div>
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Schemes Enrolled</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.schemes?.slice(0, 3).map((scheme, index) => (
                    <span key={index} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                      {scheme.scheme_name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white h-12 rounded-full font-semibold flex items-center justify-center gap-2"
            onClick={handleDownloadCard}
            data-testid="btn-download-card"
          >
            <Download className="w-5 h-5" />
            Download PDF Card
          </Button>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="font-bold text-slate-900 mb-3">Card Information</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p><span className="font-semibold">Status:</span> Active</p>
              <p><span className="font-semibold">Issued:</span> {new Date(profile?.created_at).toLocaleDateString()}</p>
              <p><span className="font-semibold">Eligibility:</span> {profile?.eligibility_status === 'eligible' ? 'Eligible' : 'Pending Review'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}