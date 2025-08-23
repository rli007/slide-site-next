import Link from "next/link";

export default function FAQ() {
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

      {/* === FAQ PAGE === */}
      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1476231682828-37e571bc172f?auto=format&fit=crop&w=1400&q=60')] bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              Everything you need to know about Slide, from how it works to getting started as a driver or shipper.
            </p>
          </div>
          <svg className="absolute bottom-0 w-full text-white" viewBox="0 0 1440 100">
            <path fill="currentColor" d="M0,0C80,60,320,120,720,60S1360,-10,1440,30L1440,100H0Z"/>
          </svg>
        </section>

        {/* FAQ CONTENT */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-8">
              {/* General Questions */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">General Questions</h2>
                <div className="space-y-4">
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">What is Slide?</summary>
                    <p className="mt-4 text-gray-600">
                      Slide is a platform that connects local package deliveries with everyday drivers already headed in the right direction. 
                      Instead of making extra trips, drivers earn money by carrying packages along their existing commute routes.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">Where is Slide available?</summary>
                    <p className="mt-4 text-gray-600">
                      We&apos;re currently piloting in the San Francisco Bay Area. Add your email to our waitlist and we&apos;ll notify you 
                      when we expand to your city.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">How does Slide make money?</summary>
                    <p className="mt-4 text-gray-600">
                      We take a small percentage from each successful delivery. This covers platform costs, insurance, and customer support. 
                      The majority of the delivery fee goes directly to drivers.
                    </p>
                  </details>
                </div>
              </div>

              {/* For Drivers (Sliders) */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">For Drivers (Sliders)</h2>
                <div className="space-y-4">
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">How much can I earn as a driver?</summary>
                    <p className="mt-4 text-gray-600">
                      Early testers average $18-25 per active hour. Earnings depend on your route, package volume, and time commitment. 
                      You only earn on miles you already drive—no extra fuel costs or detours.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">What are the requirements to become a driver?</summary>
                    <p className="mt-4 text-gray-600">
                      You need a valid driver&apos;s license, a reliable vehicle, and to pass our background check. We also require 
                      proof of insurance and a clean driving record.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">How do I set my routes?</summary>
                    <p className="mt-4 text-gray-600">
                      Simply input your regular commute routes in the dashboard. Include start/end locations and your typical schedule. 
                      We&apos;ll match you with packages heading in the same direction.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">What package sizes can I carry?</summary>
                    <p className="mt-4 text-gray-600">
                      Packages up to 20 lbs and 18&quot; on the longest side (about shoebox size). This ensures they fit easily in 
                      your vehicle without requiring special equipment.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">How do I get paid?</summary>
                    <p className="mt-4 text-gray-600">
                      Payments are processed via Stripe with same-day payouts. You&apos;ll receive earnings directly to your bank 
                      account or debit card within 24 hours of completing deliveries.
                    </p>
                  </details>
                </div>
              </div>

              {/* For Shippers */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">For Shippers</h2>
                <div className="space-y-4">
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">How much does shipping cost?</summary>
                    <p className="mt-4 text-gray-600">
                      Our pricing is $0.85 per mile with no hidden fees. This is typically 30-50% less than traditional couriers 
                      since drivers aren&apos;t making extra trips.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">How fast is delivery?</summary>
                    <p className="mt-4 text-gray-600">
                      Most local deliveries arrive same-day or within 24 hours. Speed depends on driver availability and route matches. 
                      You&apos;ll get real-time tracking updates throughout the process.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">What areas do you serve?</summary>
                    <p className="mt-4 text-gray-600">
                      Currently the San Francisco Bay Area, including San Francisco, Oakland, San Jose, and surrounding cities. 
                      We&apos;re expanding rapidly—contact us if you&apos;re outside our current service area.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">Is my package insured?</summary>
                    <p className="mt-4 text-gray-600">
                      Yes, all packages are fully insured up to $500. We also verify all drivers and provide real-time tracking 
                      for peace of mind.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">Can businesses use Slide?</summary>
                    <p className="mt-4 text-gray-600">
                      Absolutely! Many local businesses use Slide for same-day deliveries. We offer business accounts with 
                      volume discounts and dedicated support.
                    </p>
                  </details>
                </div>
              </div>

              {/* Safety & Security */}
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Safety & Security</h2>
                <div className="space-y-4">
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">How do you verify drivers?</summary>
                    <p className="mt-4 text-gray-600">
                      All drivers undergo background checks, license verification, and insurance confirmation. We also collect 
                      vehicle information and monitor delivery performance.
                    </p>
                  </details>
                  
                  <details className="bg-gray-50 rounded-2xl shadow p-6">
                    <summary className="cursor-pointer font-semibold text-lg">What if something goes wrong?</summary>
                    <p className="mt-4 text-gray-600">
                      Our customer support team is available 24/7. If there are any issues with delivery, we&apos;ll work to 
                      resolve them quickly and ensure you&apos;re satisfied.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-indigo-50 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Still Have Questions?</h2>
          <p className="max-w-xl mx-auto mb-8 text-gray-700">
            Can&apos;t find what you&apos;re looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" className="rounded-xl bg-indigo-600 px-8 py-4 text-white font-semibold shadow hover:bg-indigo-700 transition">Get Started</Link>
            <a href="mailto:support@slide.com" className="rounded-xl bg-white ring-1 ring-indigo-600 px-8 py-4 text-indigo-600 font-semibold hover:bg-indigo-50 transition">Contact Support</a>
          </div>
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
