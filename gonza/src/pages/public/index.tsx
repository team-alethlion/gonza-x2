import React from "react";
import HeroCentered from "../../components/home/HeroCentered";
import MacbookMockup from "../../components/home/MacbookMockup";
import MobileAppSection from "../../components/home/MobileAppSection";
import FeaturesGrid from "../../components/home/FeaturesGrid";
import GrowthSection from "../../components/home/GrowthSection";
import ContactSection from "../../components/home/ContactSection";
import CTASection from "../../components/home/CTASection";

function Index() {
  return (
    <div className="flex flex-col">
      <HeroCentered />
      <MacbookMockup />
      <MobileAppSection />
      <FeaturesGrid />
      <GrowthSection />
      <ContactSection />
      <CTASection />
    </div>
  );
}

export default Index;
