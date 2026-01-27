import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

export default function AddNewUser() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    mobile: '',
    address: '',
    scheme_name: '',
    surveyor_area: user?.allocated_areas?.[0] || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.uid || !formData.mobile || !formData.scheme_name) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      await api.post('/surveyor/add-user-request', formData);
      toast.success('User addition request sent to admin!');
      navigate('/surveyor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold text-slate-900">Add New Beneficiary</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-slate-50 rounded-xl"
                data-testid="input-name"
              />
            </div>

            <div>
              <Label htmlFor="uid">UID *</Label>
              <Input
                id="uid"
                value={formData.uid}
                onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
                className="h-12 bg-slate-50 rounded-xl"
                data-testid="input-uid"
              />
            </div>

            <div>
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="h-12 bg-slate-50 rounded-xl"
                data-testid="input-mobile"
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="h-12 bg-slate-50 rounded-xl"
                data-testid="input-address"
              />
            </div>

            <div>
              <Label htmlFor="scheme_name">Scheme Name *</Label>
              <Input
                id="scheme_name"
                value={formData.scheme_name}
                onChange={(e) => setFormData({ ...formData, scheme_name: e.target.value })}
                placeholder="e.g., PM-KISAN"
                className="h-12 bg-slate-50 rounded-xl"
                data-testid="input-scheme"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white h-12 rounded-full font-semibold"
              data-testid="btn-submit"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}