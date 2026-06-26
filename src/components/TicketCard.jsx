import { QRCodeSVG } from 'qrcode.react';

export default function TicketCard({ data, ticketRef }) {
  if (!data) return null;

  const verifyUrl = `${window.location.origin}${window.location.pathname}#/verify/${data.registrationId}`;

  return (
    <div 
      ref={ticketRef} 
      className="bg-[#0f172a] text-white rounded-2xl overflow-hidden shadow-2xl border border-indigo-500/30 max-w-md w-full mx-auto relative"
    >
      {/* Ticket Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center relative overflow-hidden">
        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-white/5 rotate-12 pointer-events-none" />
        <h2 className="text-2xl font-bold tracking-wider mb-1">FOUNDERS MEET</h2>
        <p className="text-indigo-100 text-sm tracking-widest font-medium">2026 EDITION</p>
      </div>

      {/* Ticket Body */}
      <div className="p-6 bg-[#1e293b] relative">
        {/* Cutouts */}
        <div className="absolute -left-3 top-0 w-6 h-6 bg-[#0f172a] rounded-full transform -translate-y-1/2 border-r border-b border-indigo-500/30" />
        <div className="absolute -right-3 top-0 w-6 h-6 bg-[#0f172a] rounded-full transform -translate-y-1/2 border-l border-b border-indigo-500/30" />
        
        <div className="border-t border-dashed border-slate-600 absolute top-0 left-4 right-4" />

        <div className="mt-4 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex-1 space-y-4 w-full">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Attendee</p>
              <p className="font-semibold text-lg">{data.fullName}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Role</p>
                <p className="font-medium text-indigo-300">{data.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Organization</p>
                <p className="font-medium break-words leading-tight">{data.organization}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Purpose</p>
                <p className="font-medium text-indigo-300">{data.purpose}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Registration ID</p>
              <p className="font-mono bg-slate-800/50 px-2 py-1 rounded inline-block text-sm border border-slate-700">
                {data.registrationId}
              </p>
            </div>
            
            {/* Phone and Email are technically requested in the ticket specs */}
            <div className="pt-2 border-t border-slate-700/50 mt-2 space-y-1">
              <p className="text-xs text-slate-400">{data.email}</p>
              <p className="text-xs text-slate-400">{data.phone}</p>
            </div>
          </div>

          <div id="qr-download-target" className="flex flex-col items-center justify-center p-3 bg-white rounded-xl">
            <QRCodeSVG 
              value={verifyUrl}
              size={120}
              level={"H"}
              includeMargin={false}
            />
            <p className="text-xs text-slate-800 font-bold mt-2 tracking-wider">SCAN ENTRY</p>
          </div>
        </div>
      </div>
      
      {/* Ticket Footer */}
      <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex justify-between items-center">
        <p className="text-xs text-slate-500">Admit One</p>
        <p className="text-xs text-slate-500 font-mono">NON-TRANSFERABLE</p>
      </div>
    </div>
  );
}
