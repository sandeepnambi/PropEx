// frontend/src/pages/SellPage.tsx
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const steps = [
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    step: '01',
    title: 'List Your Property',
    description: 'Create a detailed listing with professional photos, floor plans, and a compelling description. Our guided form makes it effortless.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    step: '02',
    title: 'Connect with Buyers',
    description: 'Our platform instantly notifies thousands of pre-qualified buyers and agents matching your property\'s criteria.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    step: '03',
    title: 'Review Offers',
    description: 'Receive, compare, and negotiate offers directly through our secure platform with full transparency at every step.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    step: '04',
    title: 'Close the Deal',
    description: 'Our expert team guides you through paperwork, escrow, and closing so you can sell with total confidence.',
  },
];

const stats = [
  { value: '94%', label: 'List-to-Sale Rate' },
  { value: '28', label: 'Avg. Days on Market' },
  { value: '₹2.4B+', label: 'Total Sales Volume' },
  { value: '12K+', label: 'Happy Sellers' },
];

const SellPage: FC = () => {
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
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2000&auto=format&fit=crop"
            alt="Luxury home for sale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl animate-fade-in-up">
            <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
              Sell Smarter
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Get the Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">Price</span> for Your Home
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              PropEx connects you with thousands of serious buyers to ensure your property sells fast — and at maximum value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleProtectedAction('/dashboard?tab=create')}
                className="btn-primary text-center text-base px-8 py-4"
              >
                List Your Property Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-surface border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-4xl font-black text-primary mb-1">{s.value}</p>
                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-3">The Process</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">How Selling Works</h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A streamlined, transparent process designed to get you from listing to closing with minimal stress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative bg-surface border border-gray-800 rounded-2xl p-8 card-hover group"
              >
                <div className="absolute top-6 right-6 text-6xl font-black text-gray-800 group-hover:text-primary/20 transition-colors duration-300 leading-none select-none">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                <p className="text-gray-400 leading-relaxed text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sell with PropEx */}
      <section className="py-24 bg-surface border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
                  alt="Real estate agent shaking hands"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-background border border-gray-700 p-5 rounded-2xl shadow-xl glass">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Average Sale Price Uplift</p>
                    <p className="text-xl font-black text-green-400">+7.3%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <h2 className="text-sm font-bold text-primary tracking-wider uppercase mb-3">Why PropEx</h2>
              <h3 className="text-4xl font-bold text-white mb-8 leading-tight">
                Sell for More. <br />Sell Faster.
              </h3>
              <div className="space-y-6">
                {[
                  { title: 'AI-Powered Pricing', desc: 'Our market intelligence engine gives you a data-backed estimate so you price perfectly from day one.' },
                  { title: 'Professional Marketing', desc: 'HD photography, virtual tours, and targeted digital ads included with every premium listing.' },
                  { title: 'Dedicated Support', desc: 'A dedicated selling advisor is assigned to your listing and available 7 days a week.' },
                  { title: 'Zero Hidden Fees', desc: 'Transparent commission structure with no surprise charges — ever.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-0.5 border border-primary/30">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Sell Your Property?
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of homeowners who've trusted PropEx to sell their most valuable asset.
          </p>
          <button
            onClick={() => handleProtectedAction('/dashboard?tab=create')}
            className="btn-primary inline-block text-lg px-10 py-4"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default SellPage;
