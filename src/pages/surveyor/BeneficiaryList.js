import { useNavigate } from 'react-router-dom';

export default function BeneficiaryList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-600 mb-4">Beneficiary List Page</p>
        <button
          onClick={() => navigate('/surveyor/dashboard')}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}