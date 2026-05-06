import NavBar from '../components/NavBar'
import DevBanner from '../components/DevBanner'
import { ProblemSection } from '../components/ProblemSection'
import { AITrapSection } from '../components/AITrapSection'
import { QuietBridge } from '../components/ui/QuietBridge'
import TheBetSection from '../components/TheBetSection'
import { IntelligenceSection } from '../components/IntelligenceSection'
import ArchitectureSection from '../components/ArchitectureSection'
import WhyNowSection from '../components/WhyNowSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

export default function LearnMorePage() {
  return (
    <main className="min-h-screen bg-white text-[#111827] font-sans antialiased overflow-x-hidden">
      <NavBar />
      <DevBanner />
      <div style={{ paddingTop: 88 }}>
        <ProblemSection />
        <AITrapSection />
        <QuietBridge
          headline="One decision. Everything else follows."
          subline="Strategy is a system of decisions — not a set of documents."
        />
        <TheBetSection />
        <QuietBridge
          headline="Every change. Every time."
          subline="Every time something is committed, it's evaluated."
        />
        <IntelligenceSection />
        <ArchitectureSection />
        <WhyNowSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
