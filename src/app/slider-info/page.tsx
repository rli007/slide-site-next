import Link from "next/link";

export default function SliderInfo() {
  return (
    <>
      {/* === NAVBAR === */}
      <header className="bg-white/70 backdrop-blur-md fixed top-0 inset-x-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">Slide</Link>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/slider-info" className="hover:text-indigo-600">For&nbsp;Sliders</Link>
            <Link href="/shipper-info" className="hover:text-indigo-600">For&nbsp;Shippers</Link>
            <Link href="/#features" className="hover:text-indigo-600">Features</Link>
            <Link href="/faq" className="hover:text-indigo-600">FAQ</Link>
          </nav>
          <Link href="/auth" className="rounded-xl bg-indigo-600 px-5 py-2 text-white font-semibold shadow hover:bg-indigo-700 transition">Log&nbsp;in</Link>
        </div>
      </header>
      <div className="h-16"></div>

      {/* === SLIDER INFO === */}
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1400&q=60')] bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                Earn on Your<br />Everyday Commute
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Turn your daily drive into extra income. Slide matches you with packages heading your way—no detours, no wasted gas, just money in your pocket.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth" className="rounded-xl bg-white text-indigo-700 font-semibold px-6 py-3 shadow-xl hover:bg-gray-100 transition">Start&nbsp;Earning</Link>
                <a href="#how-it-works" className="rounded-xl bg-white/20 ring-1 ring-white/40 text-white font-semibold px-6 py-3 hover:bg-white/30 transition">Learn&nbsp;More</a>
              </div>
            </div>
          </div>
          <svg className="absolute bottom-0 w-full text-white" viewBox="0 0 1440 100">
            <path fill="currentColor" d="M0,0C80,60,320,120,720,60S1360,-10,1440,30L1440,100H0Z"/>
          </svg>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Set Your Route</h3>
                <p className="text-gray-600">Tell us where you&apos;re going and when. We&apos;ll find packages heading the same direction.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Pick Up & Deliver</h3>
                <p className="text-gray-600">Grab packages from pickup points along your route and drop them off at their destinations.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Get Paid</h3>
                <p className="text-gray-600">Earn $18-25 per active hour with same-day payouts via Stripe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">Why Drive with Slide?</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="dollar-sign" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Higher Earnings</h3>
                <p className="text-gray-600">Earn on miles you already drive. No extra gas, no wasted time, just pure profit.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="clock" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Flexible Schedule</h3>
                <p className="text-gray-600">Drive when it works for you. Set your own hours and choose your routes.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="shield" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Safe & Secure</h3>
                <p className="text-gray-600">All packages are insured and verified. Your safety is our priority.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="zap" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Fast Payouts</h3>
                <p className="text-gray-600">Get paid same-day via Stripe. No waiting, no delays.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-indigo-600 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ready to Start Earning?</h2>
          <p className="max-w-xl mx-auto mb-8 text-indigo-100">Join thousands of drivers already earning on their commute.</p>
          <Link href="/auth" className="rounded-xl bg-white text-indigo-600 font-semibold px-8 py-4 shadow hover:bg-gray-100 transition">Become a Slider</Link>
        </section>
      </main>

      {/* === FOOTER === */}
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