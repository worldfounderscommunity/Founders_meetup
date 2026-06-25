import { useLocation, Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';
import TicketCard from '../components/TicketCard';
import { useEffect, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function Success() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const ticketData = state?.ticketData;
  const printRef = useRef(null);

  useEffect(() => {
    if (!ticketData) {
      navigate('/');
    }
  }, [ticketData, navigate]);

  const handleDownload = async () => {
    if (printRef.current) {
      const toastId = toast.loading('Generating PDF ticket...');
      try {
        const imgData = await htmlToImage.toPng(printRef.current, { 
          pixelRatio: 2, 
          backgroundColor: '#0f172a' 
        });
        
        const img = new Image();
        img.src = imgData;
        await new Promise((resolve) => (img.onload = resolve));

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: [img.width / 2, img.height / 2]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, img.width / 2, img.height / 2);
        pdf.save(`Founders-Meet-Ticket-${id}.pdf`);
        toast.success('Ticket downloaded successfully!', { id: toastId });
      } catch (error) {
        toast.error(`Error generating PDF: ${error.message || 'Unknown error'}`, { id: toastId, duration: 8000 });
        console.error("PDF generation failed:", error);
      }
    }
  };

  if (!ticketData) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto py-10 flex flex-col items-center"
    >
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Registration Confirmed!</h1>
        <p className="text-slate-400">Your ticket has been generated successfully and sent to your email.</p>
      </div>

      <div className="w-full mb-8 relative">
        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <TicketCard data={ticketData} ticketRef={printRef} />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button 
          onClick={handleDownload}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
        >
          <Download size={20} />
          Download Ticket
        </button>
        <Link 
          to="/"
          className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border border-slate-700"
        >
          <ArrowLeft size={20} />
          Return Home
        </Link>
      </div>
    </motion.div>
  );
}
