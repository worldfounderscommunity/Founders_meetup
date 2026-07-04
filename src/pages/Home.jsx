import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as htmlToImage from 'html-to-image';
import RegistrationForm from '../components/RegistrationForm';
import TicketCard from '../components/TicketCard';
import { generateRegistrationID } from '../utils/generateID';
import { submitRegistration } from '../services/api';
import { motion } from 'framer-motion';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const ticketRef = useRef(null);
  const navigate = useNavigate();

  const handleRegistration = async (data) => {
    setIsSubmitting(true);
    try {
      const registrationId = generateRegistrationID();
      const completeData = { ...data, registrationId };
      
      // Temporarily set data to render ticket in the background/hidden for screenshot
      setTicketData(completeData);
      
      // We need to wait a tick for the React render cycle to place the Ticket in DOM
      setTimeout(async () => {
        let ticketImageBase64 = null;
        if (ticketRef.current) {
          try {
            const dataUrl = await htmlToImage.toJpeg(ticketRef.current, {
              pixelRatio: 1, // Keep payload small
              backgroundColor: '#0f172a',
              quality: 0.5
            });
            ticketImageBase64 = dataUrl;
          } catch (e) {
            console.error("Failed to capture ticket:", e);
            // Non-fatal, continue registration without image if it fails
          }
        }

        const payload = {
          ...completeData,
          ticketImage: ticketImageBase64
        };

        const result = await submitRegistration(payload);
        
        if (result.success) {
          toast.success('Please check your email id for ticket and payment detainls');
          // Pass data via state to Success page
          navigate(`/success/${registrationId}`, { state: { ticketData: completeData } });
        } else {
          toast.error(result.error || 'Registration failed. Please try again.');
          setTicketData(null);
        }
        setIsSubmitting(false);
      }, 500);

    } catch (error) {
      toast.error('An unexpected error occurred. Please check your connection.');
      setIsSubmitting(false);
      setTicketData(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-12 text-center max-w-2xl">

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 text-transparent bg-clip-text"
        >
          Founders Meet
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl"
        >
          Connect with visionary founders, investors, and industry leaders at the premier startup ecosystem event.
        </motion.p>
      </div>

      <RegistrationForm onSubmit={handleRegistration} isLoading={isSubmitting} />

      {/* Hidden ticket container for html2canvas generation */}
      <div className="absolute top-[-9999px] left-[-9999px]">
        {ticketData && (
          <div className="w-[450px]">
             <TicketCard data={ticketData} ticketRef={ticketRef} />
          </div>
        )}
      </div>
    </div>
  );
}
