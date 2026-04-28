// frontend/src/pages/AgentsPage.tsx
import type { FC } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Agent {
  id: number;
  name: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  sales: number;
  image: string;
  specialties: string[];
}

const agents: Agent[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    title: 'Senior Real Estate Advisor',
    location: 'New York, NY',
    rating: 4.9,
    reviews: 142,
    sales: 237,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    specialties: ['Luxury Homes', 'Condos', 'Investment'],
  },
  {
    id: 2,
    name: 'James Ramirez',
    title: 'Commercial & Residential Expert',
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviews: 98,
    sales: 189,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    specialties: ['Commercial', 'Multi-Family', 'Rentals'],
  },
  {
    id: 3,
    name: 'Priya Sharma',
    title: 'Luxury Property Specialist',
    location: 'Miami, FL',
    rating: 5.0,
    reviews: 76,
    sales: 154,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    specialties: ['Waterfront', 'Luxury', 'Vacation Homes'],
  },
  {
    id: 4,
    name: 'Daniel Park',
    title: 'First-Time Buyer Consultant',
    location: 'Chicago, IL',
    rating: 4.7,
    reviews: 211,
    sales: 302,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    specialties: ['First-Time Buyers', 'Suburbs', 'Schools'],
  },
  {
    id: 5,
    name: 'Olivia Chen',
    title: 'Investment & Portfolio Advisor',
    location: 'San Francisco, CA',
    rating: 4.9,
    reviews: 88,
    sales: 178,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    specialties: ['Investment', 'Tech Corridor', 'Condos'],
  },
  {
    id: 6,
    name: 'Marcus Thompson',
    title: 'Urban Development Specialist',
    location: 'Austin, TX',
    rating: 4.8,
    reviews: 127,
    sales: 215,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    specialties: ['New Builds', 'Urban', 'Short-Term Rentals'],
  },
];

const specialtyFilters = ['All', 'Luxury', 'Investment', 'Commercial', 'First-Time Buyers', 'Rentals'];

const StarRating: FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center space-x-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-primary' : 'text-gray-700'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const AgentsPage: FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = agents.filter((a) => {
    const matchesFilter = activeFilter === 'All' || a.specialties.some((s) => s.includes(activeFilter));
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <span className="inline-block bg-primary/10 border border-primary/30 text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider uppercase">
            Our Network
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
              Expert Agents
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Handpicked professionals with proven track records, deep market knowledge, and a passion for finding you the perfect deal.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="agent-search"
              type="text"
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-gray-700 text-white rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary/60 transition-colors placeholder-gray-500"
            />
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {specialtyFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeFilter === f
                    ? 'bg-primary text-gray-900 border-primary shadow-[0_0_15px_rgba(223,166,89,0.3)]'
                    : 'bg-surface border-gray-700 text-gray-400 hover:border-primary/50 hover:text-primary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Agent Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">No agents found matching your search.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-surface border border-gray-800 rounded-2xl overflow-hidden card-hover group"
                >
                  {/* Agent Photo */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={agent.image}
                      alt={`${agent.name} - PropEx Agent`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                      {agent.specialties.slice(0, 2).map((s) => (
                        <span key={s} className="text-xs bg-primary/20 border border-primary/30 text-primary px-3 py-1 rounded-full font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{agent.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{agent.title}</p>
                    <p className="text-xs text-gray-500 flex items-center mb-4">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {agent.location}
                    </p>

                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center space-x-2">
                        <StarRating rating={agent.rating} />
                        <span className="text-sm font-bold text-white">{agent.rating}</span>
                        <span className="text-xs text-gray-500">({agent.reviews} reviews)</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">{agent.sales}</p>
                        <p className="text-xs text-gray-500">Sales</p>
                      </div>
                    </div>

                    <Link
                      to={`/auth`}
                      className="block w-full text-center py-3 bg-primary/10 hover:bg-primary text-primary hover:text-gray-900 border border-primary/40 rounded-xl font-bold transition-all duration-300"
                    >
                      Contact Agent
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Become an Agent CTA */}
      <section className="py-24 bg-surface border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Are You a Real Estate Professional?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join PropEx's network of top-performing agents. Access premium leads, a powerful dashboard, and marketing tools to grow your business.
          </p>
          <Link to="/auth/register" className="btn-primary inline-block text-base px-10 py-4">
            Apply to Become an Agent
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AgentsPage;
