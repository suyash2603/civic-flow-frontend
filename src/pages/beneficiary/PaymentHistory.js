import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import api from '../../utils/api';

export default function PaymentHistory() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/beneficiary/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
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
          <h1 className="text-xl font-bold text-slate-900">Payment History</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {payments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-500">No payment history available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <div key={payment.id} className="bg-white rounded-2xl border border-slate-100 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {payment.scheme_name || 'Scheme Payment'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {new Date(payment.payment_date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    {payment.status === 'processed' && (
                      <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-2 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Processed</span>
                      </div>
                    )}
                    {payment.status === 'pending' && (
                      <div className="flex items-center gap-2 bg-amber-100 text-amber-700 border border-amber-200 px-3 py-2 rounded-full">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Pending</span>
                      </div>
                    )}
                    {payment.status === 'failed' && (
                      <div className="flex items-center gap-2 bg-red-100 text-red-700 border border-red-200 px-3 py-2 rounded-full">
                        <XCircle className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase">Failed</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-sm text-slate-600">Amount</span>
                  <span className="text-2xl font-bold text-indigo-700">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}