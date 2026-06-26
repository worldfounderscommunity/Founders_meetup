import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { registrationSchema } from '../utils/validation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegistrationForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registrationSchema)
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 md:p-8 w-full max-w-xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Secure Your Spot</h2>
        <p className="text-slate-400">Join the ultimate gathering of innovators</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name *</label>
          <input 
            {...register('fullName')} 
            className={`input-field ${errors.fullName ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="John Doe"
            disabled={isLoading}
          />
          {errors.fullName && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address *</label>
            <input 
              {...register('email')} 
              type="email"
              className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="john@startup.com"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number *</label>
            <input 
              {...register('phone')} 
              className={`input-field ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
              placeholder="+91 9876543210"
              disabled={isLoading}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.phone.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Organization / Startup Name *</label>
          <input 
            {...register('organization')} 
            className={`input-field ${errors.organization ? 'border-red-500 focus:border-red-500' : ''}`}
            placeholder="Tech Corp Inc."
            disabled={isLoading}
          />
          {errors.organization && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.organization.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Your Role *</label>
          <select 
            {...register('role')} 
            className={`input-field appearance-none ${errors.role ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select a role...</option>
            <option value="Founder">Founder</option>
            <option value="Investor">Investor</option>
            <option value="Working Professional">Working Professional</option>
            <option value="Student">Student</option>
            <option value="Other">Other</option>
          </select>
          {errors.role && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.role.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Purpose of Joining *</label>
          <select 
            {...register('purpose')} 
            className={`input-field appearance-none ${errors.purpose ? 'border-red-500 focus:border-red-500' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select a purpose...</option>
            <option value="Pitching">Pitching</option>
            <option value="Investor">Investor</option>
            <option value="Networking">Networking</option>
          </select>
          {errors.purpose && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.purpose.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-4 flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/25"
        >
          {isLoading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>Register Now <CheckCircle2 size={18} /></>
          )}
        </button>
      </form>
    </motion.div>
  );
}
