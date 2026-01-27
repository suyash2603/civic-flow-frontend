import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import api from '../../utils/api';

export default function BulkUpload() {
  const navigate = useNavigate();
  const [beneficiaryFile, setBeneficiaryFile] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [uploadingBeneficiary, setUploadingBeneficiary] = useState(false);
  const [uploadingPayment, setUploadingPayment] = useState(false);

  const handleBeneficiaryUpload = async (e) => {
    e.preventDefault();
    if (!beneficiaryFile) {
      toast.error('Please select a file');
      return;
    }

    setUploadingBeneficiary(true);
    const formData = new FormData();
    formData.append('file', beneficiaryFile);

    try {
      const response = await api.post('/admin/beneficiaries/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(response.data.message);
      setBeneficiaryFile(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploadingBeneficiary(false);
    }
  };

  const handlePaymentUpload = async (e) => {
    e.preventDefault();
    if (!paymentFile) {
      toast.error('Please select a file');
      return;
    }

    setUploadingPayment(true);
    const formData = new FormData();
    formData.append('file', paymentFile);

    try {
      const response = await api.post('/admin/payments/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(response.data.message);
      setPaymentFile(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setUploadingPayment(false);
    }
  };

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
          <h1 className="text-xl font-bold text-slate-900">Bulk Upload</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Beneficiary Upload */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl">
                <Upload className="w-6 h-6 text-indigo-700" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Upload Beneficiaries</h2>
                <p className="text-sm text-slate-600">CSV file with beneficiary data</p>
              </div>
            </div>

            <form onSubmit={handleBeneficiaryUpload} className="space-y-4">
              <div>
                <Label htmlFor="beneficiary-file">Select CSV File</Label>
                <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <input
                    id="beneficiary-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setBeneficiaryFile(e.target.files[0])}
                    className="hidden"
                    data-testid="input-beneficiary-file"
                  />
                  <label
                    htmlFor="beneficiary-file"
                    className="text-indigo-600 font-medium cursor-pointer hover:text-indigo-700"
                  >
                    {beneficiaryFile ? beneficiaryFile.name : 'Choose file or drag and drop'}
                  </label>
                  <p className="text-xs text-slate-500 mt-1">CSV format required</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-900 font-medium mb-1">Required CSV columns:</p>
                <p className="text-xs text-blue-700">uid, name, mobile, address, surveyor_area, scheme_name, bank_name, account_number, ifsc_code</p>
              </div>

              <Button
                type="submit"
                disabled={uploadingBeneficiary || !beneficiaryFile}
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white h-12 rounded-full font-semibold"
                data-testid="btn-upload-beneficiaries"
              >
                {uploadingBeneficiary ? 'Uploading...' : 'Upload Beneficiaries'}
              </Button>
            </form>
          </div>

          {/* Payment Upload */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Upload className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Upload Payments</h2>
                <p className="text-sm text-slate-600">CSV file with payment data</p>
              </div>
            </div>

            <form onSubmit={handlePaymentUpload} className="space-y-4">
              <div>
                <Label htmlFor="payment-file">Select CSV File</Label>
                <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <input
                    id="payment-file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setPaymentFile(e.target.files[0])}
                    className="hidden"
                    data-testid="input-payment-file"
                  />
                  <label
                    htmlFor="payment-file"
                    className="text-emerald-600 font-medium cursor-pointer hover:text-emerald-700"
                  >
                    {paymentFile ? paymentFile.name : 'Choose file or drag and drop'}
                  </label>
                  <p className="text-xs text-slate-500 mt-1">CSV format required</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-900 font-medium mb-1">Required CSV columns:</p>
                <p className="text-xs text-blue-700">uid, amount, payment_date, status, scheme_name</p>
              </div>

              <Button
                type="submit"
                disabled={uploadingPayment || !paymentFile}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-full font-semibold"
                data-testid="btn-upload-payments"
              >
                {uploadingPayment ? 'Uploading...' : 'Upload Payments'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}