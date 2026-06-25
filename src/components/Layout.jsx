import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background elements for premium aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      
      <header className="glass-panel sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Founders Meet '26
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-lg font-medium text-slate-300 hover:text-white transition-colors">Register</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 relative z-10 flex flex-col">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-6 mt-auto relative z-10">
        <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Founders Meet. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
