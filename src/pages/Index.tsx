import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If needed, scroll to sections matching hash anchors
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
