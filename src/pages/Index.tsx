import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import AppSection from '@/components/AppSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import FaqSection from '@/components/FaqSection';
import FooterSection from '@/components/FooterSection';

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <HowItWorksSection />
    <AppSection />
    <TestimonialsSection />
    <FaqSection />
    <FooterSection />
  </div>
);

export default Index;
