import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import PressSection from './sections/PressSection'
import ServicesSection from './sections/ServicesSection'
import StoriesSection from './sections/StoriesSection'
import ContactSection from './sections/ContactSection'
import { LightboxProvider } from './components/Lightbox'

export default function App() {
  return (
    <LightboxProvider>
      <main className="bg-[#0C0C0C]" style={{ overflowX: 'clip' }}>
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <PressSection />
        <ServicesSection />
        <StoriesSection />
        <ContactSection />
      </main>
    </LightboxProvider>
  )
}
