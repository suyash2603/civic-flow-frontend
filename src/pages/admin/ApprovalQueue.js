import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import api from '../../utils/api';

export default function ApprovalQueue() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/admin/pending-requests');
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.post('/admin/approve-request', {
        request_id: requestId,
        action: 'approve'
      });
      toast.success('Request approved successfully');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await api.post('/admin/approve-request', {
        request_id: requestId,
        action: 'reject'
      });
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to reject request');
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
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/dashboard')}
            data-testid="btn-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Approval Queue</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-600">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <div key={request.id} className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">
                      {request.request_type === 'add_user' ? 'New User Addition Request' : 'User Removal Request'}
                    </h3>
                    <p className="text-sm text-slate-600">By: {request.surveyor_name}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Pending
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <p><span className="font-semibold text-slate-700">Beneficiary UID:</span> {request.beneficiary_uid}</p>
                  {request.beneficiary_data && (
                    <>
                      <p><span className="font-semibold text-slate-700">Name:</span> {request.beneficiary_data.name}</p>
                      <p><span className="font-semibold text-slate-700">Mobile:</span> {request.beneficiary_data.mobile}</p>
                    </>
                  )}
                  {request.reason && (
                    <p><span className="font-semibold text-slate-700">Reason:</span> {request.reason}</p>
                  )}
                  <p><span className="font-semibold text-slate-700">Submitted:</span> {new Date(request.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full h-11 font-semibold flex items-center justify-center gap-2"
                    data-testid={`btn-approve-${index}`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(request.id)}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50 rounded-full h-11 font-semibold flex items-center justify-center gap-2"
                    data-testid={`btn-reject-${index}`}
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}