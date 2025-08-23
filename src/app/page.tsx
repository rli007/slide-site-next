import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* ===== NAV ===== */}
      <header className="bg-white/70 backdrop-blur-md fixed top-0 inset-x-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">Slide</Link>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/slider-info" className="hover:text-indigo-600">For&nbsp;Sliders</Link>
            <Link href="/shipper-info" className="hover:text-indigo-600">For&nbsp;Shippers</Link>
            <a href="#features" className="hover:text-indigo-600">Features</a>
            <Link href="/faq" className="hover:text-indigo-600">FAQ</Link>
          </nav>
          <Link href="/auth" className="rounded-xl bg-indigo-600 px-5 py-2 text-white font-semibold shadow hover:bg-indigo-700 transition">Log&nbsp;in</Link>
        </div>
      </header>

      {/* spacer for fixed nav */}
      <div className="h-16"></div>

      {/* ===== LANDING PAGE ===== */}
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1400&q=60')] bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                Last‑mile Delivery<br />That&nbsp;Rides&nbsp;Your&nbsp;Commute
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-md">
                Slide pairs local packages with everyday drivers already headed the right direction—cutting costs for merchants and putting money back in drivers&apos; pockets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth" className="rounded-xl bg-white text-indigo-700 font-semibold px-6 py-3 shadow-xl hover:bg-gray-100 transition">Get&nbsp;Started</Link>
                <Link href="/slider-info" className="rounded-xl bg-white/20 ring-1 ring-white/40 text-white font-semibold px-6 py-3 hover:bg-white/30 transition">Learn&nbsp;More</Link>
              </div>
            </div>
            <Image 
              src="https://images.unsplash.com/photo-1523475496153-3a12e4f7b2c8?auto=format&fit=crop&w=900&q=60" 
              alt="Map mockup" 
              width={900}
              height={600}
              className="rounded-3xl shadow-2xl border border-white/20"
            />
          </div>
          <svg className="absolute bottom-0 w-full text-white" viewBox="0 0 1440 100">
            <path fill="currentColor" d="M0,0C80,60,320,120,720,60S1360,-10,1440,30L1440,100H0Z"/>
          </svg>
        </section>

        {/* FEATURES */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Why&nbsp;Slide?</h2>
            <div className="grid sm:grid-cols-3 gap-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-5">
                  <i data-feather="globe" className="w-7 h-7 text-indigo-600"></i>
                </div>
                <h3 className="font-semibold mb-2">Greener Footprint</h3>
                <p className="text-sm text-gray-600 max-w-xs">Fewer extra miles driven means lower CO₂ for every delivery.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-5">
                  <i data-feather="trending-up" className="w-7 h-7 text-indigo-600"></i>
                </div>
                <h3 className="font-semibold mb-2">Higher Driver Earnings</h3>
                <p className="text-sm text-gray-600 max-w-xs">Earn on the miles you <em>already</em> drive—no detours, no wasted gas.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 mb-5">
                  <i data-feather="clock" className="w-7 h-7 text-indigo-600"></i>
                </div>
                <h3 className="font-semibold mb-2">Same‑Day Speeds</h3>
                <p className="text-sm text-gray-600 max-w-xs">Packages piggyback on commuters, so local deliveries arrive in hours, not days.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SPLASH */}
        <section className="py-20 bg-indigo-50 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ready&nbsp;to&nbsp;Ride&nbsp;the&nbsp;Slide?</h2>
          <p className="max-w-xl mx-auto mb-8 text-gray-700">Drivers and merchants join free during our Bay Area pilot. Claim your spot and help reshape local logistics.</p>
          <Link href="/auth" className="rounded-xl bg-indigo-600 px-8 py-4 text-white font-semibold shadow hover:bg-indigo-700 transition">Join&nbsp;the&nbsp;Waitlist</Link>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10">Frequently&nbsp;Asked&nbsp;Questions</h2>
            <div className="space-y-6">
              <details className="bg-gray-50 rounded-2xl shadow p-6">
                <summary className="cursor-pointer font-semibold">Is Slide available in my city?</summary>
                <p className="mt-4 text-sm text-gray-600">We&apos;re piloting in the San Francisco Bay Area. Add your email and we&apos;ll notify you when we expand.</p>
              </details>
              <details className="bg-gray-50 rounded-2xl shadow p-6">
                <summary className="cursor-pointer font-semibold">How much can drivers earn?</summary>
                <p className="mt-4 text-sm text-gray-600">Early testers average $18‑25 per active hour, with same‑day Stripe payouts.</p>
              </details>
              <details className="bg-gray-50 rounded-2xl shadow p-6">
                <summary className="cursor-pointer font-semibold">What package sizes are allowed?</summary>
                <p className="mt-4 text-sm text-gray-600">Anything up to 20 lbs and 18&quot; on the longest side (shoebox sized or smaller).</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p>© 2025 Slide Logistics, Inc.</p>
          <ul className="flex space-x-6">
            <li><a className="hover:text-white" href="#">Privacy</a></li>
            <li><a className="hover:text-white" href="#">Terms</a></li>
            <li><a className="hover:text-white" href="#">Contact</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}
