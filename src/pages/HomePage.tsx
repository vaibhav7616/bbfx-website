import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LiveTicker from '../components/LiveTicker';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import LiveSignals from '../components/LiveSignals';
import Performance from '../components/Performance';
import Markets from '../components/Markets';
import ChartMockup from '../components/ChartMockup';
import Demo from '../components/Demo';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import MobileCTA from '../components/MobileCTA';
import ScrollProgress from '../components/ScrollProgress';
import CursorGlow from '../components/CursorGlow';
import Delivery from '../components/Delivery';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 48, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-void text-white antialiased selection:bg-violet/40">
      <ScrollProgress />
      <CursorGlow />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-black focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <LiveTicker />
      <Navbar />

      <main id="main">
        <Hero />
        <TrustBar />
        <Features />
        <div data-reveal>
          <HowItWorks />
        </div>
        <div id="signals" data-reveal>
          <LiveSignals />
        </div>
        <div data-reveal>
          <Performance />
        </div>
        <div data-reveal>
          <Markets />
        </div>
        <div data-reveal>
          <ChartMockup />
        </div>
        <Demo />
        <div data-reveal>
          <Delivery />
        </div>
        <div data-reveal>
          <Testimonials />
        </div>
        <div data-reveal>
          <Pricing />
        </div>
        <div data-reveal>
          <FAQ />
        </div>
        <FinalCTA />
      </main>

      <Footer />
      <MobileCTA />
    </div>
  );
}
