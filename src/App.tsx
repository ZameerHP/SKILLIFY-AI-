import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Timeline from "./components/Timeline";
import DashboardPreview from "./components/DashboardPreview";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import ContentInput from "./components/workspace/ContentInput";
import Workspace from "./components/workspace/Workspace";
import ChatAssistant from "./components/workspace/ChatAssistant";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <div className="min-h-screen selection:bg-accent/30 selection:text-white">
          <Navbar />
          <main>
            <Hero />
            
            {/* Upload Section */}
            <section id="tools" className="py-24 relative">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                    Ready to <span className="text-accent">Start?</span>
                  </h2>
                  <p className="text-white/60 text-lg">
                    Upload your material or paste your content below and let Skillify do the magic.
                  </p>
                </div>
                <ContentInput />
              </div>
            </section>

            <Features />
            <Timeline />
            <DashboardPreview />
            <Testimonials />
            <Pricing />
            <CTA />
          </main>
          <Footer />
          <BackToTop />
          
          <Workspace />
          <ChatAssistant />
        </div>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
