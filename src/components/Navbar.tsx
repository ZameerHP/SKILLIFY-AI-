import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Zap, User, LogOut } from "lucide-react";
import { NAV_LINKS } from "../constants";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-4 bg-navy-900/80 backdrop-blur-md border-b border-white/10" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight">Skillify</span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-sm font-medium text-white/70 hover:text-accent transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4"
          >
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                  <User size={16} className="text-accent" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-red-400"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  Get Started
                </button>
              </>
            )}
          </motion.div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-navy-800 border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a key={link.name} href={link.href} className="text-lg font-medium text-white/70" onClick={() => setIsOpen(false)}>
                {link.name}
              </a>
            ))}
            <hr className="border-white/10" />
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                  <User size={18} className="text-accent" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button 
                  onClick={logout}
                  className="w-full py-3 bg-red-500/10 text-red-400 font-semibold rounded-xl border border-red-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setIsAuthModalOpen(true); setIsOpen(false); }}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl"
              >
                Get Started
              </button>
            )}
          </motion.div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
