import Link from "next/link";

export default function ShipperInfo() {
  return (
    <>
      {/* === NAVBAR === */}
      <header className="bg-white/70 backdrop-blur-md fixed top-0 inset-x-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">Slide</Link>
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/slider-info" className="hover:text-indigo-600">For&nbsp;Sliders</Link>
            <Link href="/shipper-info" className="hover:text-indigo-600">For&nbsp;Shippers</Link>
            <a href="/#features" className="hover:text-indigo-600">Features</a>
            <a href="/#faq" className="hover:text-indigo-600">FAQ</a>
          </nav>
          <Link href="/auth" className="rounded-xl bg-indigo-600 px-5 py-2 text-white font-semibold shadow hover:bg-indigo-700 transition">Log&nbsp;in</Link>
        </div>
      </header>
      <div className="h-16"></div>

      {/* === SHIPPER INFO === */}
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1400&q=60')] bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
                Faster, Greener<br />Local Delivery
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Ship packages with local drivers already headed your way. Save money, reduce emissions, and get same-day delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth" className="rounded-xl bg-white text-indigo-700 font-semibold px-6 py-3 shadow-xl hover:bg-gray-100 transition">Start&nbsp;Shipping</Link>
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
                <h3 className="text-xl font-semibold mb-4">Create Shipment</h3>
                <p className="text-gray-600">Enter package details and destination. We'll find drivers heading that way.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Driver Pickup</h3>
                <p className="text-gray-600">A local driver picks up your package from your location or a nearby hub.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4">Same-Day Delivery</h3>
                <p className="text-gray-600">Your package arrives in hours, not days, with real-time tracking.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">Why Ship with Slide?</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="dollar-sign" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Lower Costs</h3>
                <p className="text-gray-600">Save 30-50% compared to traditional couriers. No extra fuel costs or detours.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="clock" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Same-Day Delivery</h3>
                <p className="text-gray-600">Local packages arrive in hours, not days. Perfect for urgent shipments.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="globe" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Greener Choice</h3>
                <p className="text-gray-600">Reduce carbon footprint by using existing commutes instead of extra delivery trips.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <i data-feather="map-pin" className="w-6 h-6 text-indigo-600"></i>
                </div>
                <h3 className="text-xl font-semibold mb-4">Local Network</h3>
                <p className="text-gray-600">Connect with drivers in your community. Build relationships with reliable local partners.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-12">Simple Pricing</h2>
            <div className="bg-indigo-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Pay Per Mile</h3>
              <p className="text-4xl font-bold text-indigo-600 mb-4">$0.85/mile</p>
              <p className="text-gray-600 mb-6">No hidden fees, no minimums, no surprises.</p>
              <ul className="text-left space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <i data-feather="check" className="w-4 h-4 text-green-500 mr-2"></i>
                  Package size up to 20 lbs, 18" longest side
                </li>
                <li className="flex items-center">
                  <i data-feather="check" className="w-4 h-4 text-green-500 mr-2"></i>
                  Real-time tracking included
                </li>
                <li className="flex items-center">
                  <i data-feather="check" className="w-4 h-4 text-green-500 mr-2"></i>
                  Full insurance coverage
                </li>
                <li className="flex items-center">
                  <i data-feather="check" className="w-4 h-4 text-green-500 mr-2"></i>
                  Same-day delivery available
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-indigo-600 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Ready to Ship Smarter?</h2>
          <p className="max-w-xl mx-auto mb-8 text-indigo-100">Join local businesses already saving money and time with Slide.</p>
          <Link href="/auth" className="rounded-xl bg-white text-indigo-600 font-semibold px-8 py-4 shadow hover:bg-gray-100 transition">Become a Shipper</Link>
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