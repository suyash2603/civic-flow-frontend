import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, UserX } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import api from '../../utils/api';

export default function MarkIneligible() {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await api.get('/surveyor/beneficiaries');
      setBeneficiaries(res.data || []);
    } catch (err) {
      console.error('Failed to fetch beneficiaries', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const name = b.name || '';
    const uid = b.uid || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uid.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="bg-red-600 p-2 rounded-xl">
            <UserX className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900">
              Mark Beneficiary Ineligible
            </h1>
            <p className="text-xs text-slate-600">
              Select a beneficiary to mark as ineligible
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Search */}
        <div className="mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by name or UID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <h2 className="font-bold text-slate-900 mb-4">
            Beneficiaries ({filteredBeneficiaries.length})
          </h2>

          {filteredBeneficiaries.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No beneficiaries found
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBeneficiaries.map(b => (
                <div
                  key={b.uid}
                  onClick={() => navigate(`/surveyor/verify/${b.uid}?mode=ineligible`)}
                  className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-red-50 cursor-pointer transition"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700">
                    {(b.name || '?').charAt(0)}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{b.name}</p>
                    <p className="text-sm text-slate-600">UID: {b.uid}</p>
                  </div>

                  <span className="bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Mark Ineligible
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
