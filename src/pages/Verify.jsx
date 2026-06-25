import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyAttendee, markAttendance } from '../services/api';
import Loader from '../components/Loader';
import { CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Verify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await verifyAttendee(id);
        if (result.success && result.data) {
          setData(result.data);
        } else {
          setError(result.error || "Registration not found.");
        }
      } catch (err) {
        setError("Failed to verify. Please check connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleMarkPresent = async () => {
    setMarking(true);
    try {
      const result = await markAttendance(id);
      if (result.success) {
        toast.success("Attendance marked successfully!");
        setData(prev => ({ ...prev, attendanceStatus: 'Present' }));
      } else {
        toast.error(result.error || "Failed to mark attendance.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return <div className="mt-20"><Loader message="Verifying registration..." /></div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-panel rounded-2xl text-center">
        <XCircle size={64} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button onClick={() => navigate('/scan')} className="bg-indigo-600 px-6 py-2 rounded-lg text-white font-medium">Scan Another</button>
      </div>
    );
  }

  const isPresent = data.attendanceStatus === 'Present';

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="glass-panel rounded-2xl overflow-hidden border border-indigo-500/20">
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-6 text-center border-b border-white/5">
          <h2 className="text-2xl font-bold text-white mb-1">ENTRY PASS</h2>
          <p className="text-indigo-300 text-sm">Founders Meet Verification</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center pb-6 border-b border-slate-700/50">
            <div>
              <p className="text-sm text-slate-400 mb-1">Status</p>
              {isPresent ? (
                <div className="flex items-center gap-2 text-green-400 font-bold bg-green-400/10 px-3 py-1 rounded-full w-max">
                  <CheckCircle size={18} /> Valid & Present
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full w-max">
                  <Clock size={18} /> Pending Entry
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400 mb-1">Registration ID</p>
              <p className="font-mono text-lg font-semibold">{data.registrationId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 uppercase">Full Name</p>
              <p className="text-lg font-medium">{data.fullName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Role</p>
                <p className="text-md font-medium text-indigo-300">{data.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Organization</p>
                <p className="text-md font-medium">{data.organization}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Phone</p>
                <p className="text-md">{data.phone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Email</p>
                <p className="text-md truncate">{data.email}</p>
              </div>
            </div>
          </div>

          {!isPresent && (
            <div className="pt-6">
              <button 
                onClick={handleMarkPresent}
                disabled={marking}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-green-600/20"
              >
                {marking ? <span className="animate-pulse">Processing...</span> : <><UserCheck size={20} /> Mark as Present</>}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => navigate('/scan')} className="text-slate-400 hover:text-white transition-colors underline">
          Scan Another QR Code
        </button>
      </div>
    </div>
  );
}
