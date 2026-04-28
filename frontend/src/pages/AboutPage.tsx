// frontend/src/pages/AboutPage.tsx
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const team = [
  {
    name: 'Alexandra Reed',
    role: 'CEO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
    bio: '20+ years in real estate development and PropTech innovation.',
  },
  {
    name: 'Nathan Brooks',
    role: 'CTO & Co-Founder',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
    bio: 'Former Google engineer, building the future of property search.',
  },
  {
    name: 'Mei Lin',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?q=80&w=400&auto=format&fit=crop',
    bio: 'Streamlining the entire experience for buyers, sellers, and agents.',
  },
  {
    name: 'Carlos Vega',
    role: 'Head of Growth',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
    bio: 'Scaling PropEx from a startup to a national real estate platform.',
  },
];

const milestones = [
  { year: '2018', event: 'PropEx founded in New York with a vision to simplify real estate for everyone.' },
  { year: '2019', event: 'Launched our AI-powered property valuation engine and reached 500 listings.' },
  { year: '2021', event: 'Expanded to 15 major cities and crossed ₹500M in total transaction volume.' },
  { year: '2023', event: 'Introduced Tenant Management Suite and Lease Automation tools.' },
  { year: '2025', event: 'Surpassed 12,000 happy sellers and ₹2.4B in total sales volume.' },
];

const values = [
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Trust & Integrity',
    desc: 'We operate with radical transparency. Every listing is verified, every deal is fair, and every client is treated with respect.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Innovation First',
    desc: 'From AI valuations to automated leasing, we constantly push the boundaries of what real estate technology can do.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'People-Centric',
    desc: 'Real estate is personal. We design every feature around real human needs — for buyers, sellers, renters, and agents alike.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Community Impact',
    desc: 'We partner with local nonprofits and affordable housing initiatives to help more people find a place they call home.',
  },
];

const AboutPage: FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleProtectedAction = (to: string) => {
    if (!token) {
      toast.error('Please login first to move forward');
      return;
    }
    navigate(to);
  };

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Redefining Real Estate,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
              One Home at a Time
            </span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-3xl mx-auto">
            PropEx was born from a simple belief: finding or selling a home should be empowering, not overwhelming. We combine cutting-edge technology with deeply human expertise to make real estate work for everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-surface border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
                  alt="PropEx modern office building"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute -top-6 -right-6 md:top-10 md:-right-10 bg-background border border-gray-700 p-5 rounded-2xl shadow-xl glass">
                <div className="text-center">
                  <p className="text-4xl font-black text-primary">2018</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">Founded</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-3">Our Mission</h2>
              <h3 className="text-4xl font-bold text-white mb-6 leading-tight">
                Making Property Ownership Accessible to All
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                We started PropEx in 2018 with a small team and a big dream — to tear down the barriers that make real estate transactions stressful, opaque, and unnecessarily complex.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Today, we power thousands of transactions across the country, backed by a platform that gives every user — whether a first-time buyer or a seasoned investor — the tools and confidence they need to make the best decision of their lives.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { v: '50+', l: 'Cities' },
                  { v: '10K+', l: 'Listings' },
                  { v: '98%', l: 'Satisfaction' },
                ].map((item) => (
                  <div key={item.l} className="bg-background border border-gray-800 rounded-2xl p-4 text-center">
                    <p className="text-3xl font-black text-primary mb-1">{item.v}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{item.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-3">What We Stand For</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Core Values</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-surface border border-gray-800 rounded-2xl p-8 card-hover group text-center"
              >
                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  {v.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors">{v.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-surface border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-3">Our Journey</h2>
            <h3 className="text-4xl font-bold text-white">Key Milestones</h3>
          </div>
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`w-full md:w-5/12 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-background border border-gray-800 rounded-2xl p-6 card-hover">
                      <p className="text-xs text-primary font-bold uppercase tracking-widest mb-2">{m.year}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                  {/* Center dot */}
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className="w-4 h-4 bg-primary rounded-full border-4 border-background shadow-[0_0_12px_rgba(223,166,89,0.5)] z-10" />
                  </div>
                  <div className="hidden md:block w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-3">The People</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Meet the Leadership</h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A passionate team of builders, innovators, and real estate experts united by a single mission.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-surface border border-gray-800 rounded-2xl overflow-hidden card-hover group text-center">
                <div className="h-60 overflow-hidden">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{member.name}</h4>
                  <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-surface border-t border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-gray-400 text-lg mb-10">
            Whether you're buying, selling, or renting — PropEx is the smarter way to navigate real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => handleProtectedAction('/listings')}
              className="btn-primary text-base px-10 py-4"
            >
              Explore Properties
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
