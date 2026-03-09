import React from "react";
import { Zap, Github, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="text-white fill-white" size={18} />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Skillify</span>
            </div>
            <p className="text-white/40 max-w-sm mb-8 leading-relaxed">
              Skillify is the ultimate AI-powered study companion for the next generation. 
              We're on a mission to make learning accessible, engaging, and efficient for everyone.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-accent hover:bg-white/10 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold mb-6">Product</h4>
            <ul className="space-y-4">
              {["Features", "Tools", "Pricing", "Dashboard", "Mobile App"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Careers", "Blog", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">
            © 2026 Skillify AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/20 hover:text-white">Status</a>
            <a href="#" className="text-xs text-white/20 hover:text-white">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
