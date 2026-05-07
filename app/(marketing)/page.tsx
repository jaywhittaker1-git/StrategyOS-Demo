import NavBar from './components/NavBar'
import DevBanner from './components/DevBanner'
import HeroSection from './components/HeroSection'
import Logos from './components/Logos'
import SectionGraph from './components/SectionGraph'
import FeatureTrio from './components/FeatureTrio'
import SectionPipeline from './components/SectionPipeline'
import SectionConversation from './components/SectionConversation'
import SectionCoherence from './components/SectionCoherence'
import AssetInventory from './components/AssetInventory'
import Process from './components/Process'
import SectionMCP from './components/SectionMCP'
import Quote from './components/Quote'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] font-sans antialiased overflow-x-hidden">
      <NavBar />
      <DevBanner />
      <HeroSection />
      <Logos />
      <SectionGraph />
      <FeatureTrio />
      <SectionPipeline />
      <SectionConversation />
      <SectionCoherence />
      <AssetInventory />
      <Process />
      <SectionMCP />
      <Quote />
      <CTASection />
      <Footer />
    </main>
  )
}
