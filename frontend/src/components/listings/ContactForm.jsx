// src/components/listings/ContactForm.jsx

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ContactForm = ({ listingId, propertyTitle }) => {
  const { user, API_BASE_URL } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    phone: user?.phone || '',
    message: `I am interested in ${propertyTitle || `listing ${listingId}`} and would like to schedule a viewing. (Please mention the duration before submit)`,
  });
  const [errors, setErrors] = useState({});
  const [messageStatus, setMessageStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message too short';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setMessageStatus('idle');

    try {
      const payload = { ...formData, listingId };
      // This hits your public POST /api/leads endpoint
      await axios.post(`${API_BASE_URL}/leads`, payload);

      setMessageStatus('success');
      setFormData({ 
        name: user ? `${user.firstName} ${user.lastName}` : '',
        email: user ? user.email : '',
        phone: user?.phone || '',
        message: `I am interested in ${propertyTitle || `listing ${listingId}`} and would like to schedule a viewing. (Please mention the duration before submit)` 
      });
    } catch (err) {
      setMessageStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 text-center font-medium uppercase tracking-widest">
        Direct Agent Inquiry
      </p>

      {messageStatus === 'success' && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl font-bold flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Message sent successfully! The agent will contact you shortly.</span>
        </div>
      )}
      {messageStatus === 'error' && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl font-bold flex items-center gap-3 animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Failed to send inquiry. Please try again or call the agent directly.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="contact-name" className="input-premium-label">
            Your Name
          </label>
          <input 
            type="text" 
            id="contact-name"
            name="name" 
            placeholder="Enter your full name" 
            value={formData.name} 
            onChange={(e) => {
              handleChange(e);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            required 
            className={`input-premium ${errors.name ? 'border-rose-500 ring-1 ring-rose-500' : ''}`} 
          />
          {errors.name && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="contact-email" className="input-premium-label">
            Email Address
          </label>
          <input 
            type="email" 
            id="contact-email"
            name="email" 
            placeholder="Enter your email address" 
            value={formData.email} 
            onChange={(e) => {
              handleChange(e);
              if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
            }}
            required 
            className={`input-premium ${errors.email ? 'border-rose-500 ring-1 ring-rose-500' : ''}`} 
          />
          {errors.email && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="contact-phone" className="input-premium-label">
            Phone Number <span className="text-gray-600 font-medium ml-1 lowercase tracking-normal">(Optional)</span>
          </label>
          <input 
            type="tel" 
            id="contact-phone"
            name="phone" 
            placeholder="Enter your phone number" 
            value={formData.phone} 
            onChange={handleChange} 
            className="input-premium" 
          />
        </div>
        
        <div>
          <label htmlFor="contact-message" className="input-premium-label">
            Message
          </label>
          <textarea 
            id="contact-message"
            name="message" 
            placeholder="Tell the agent about your interest in this property..." 
            value={formData.message} 
            onChange={(e) => {
              handleChange(e);
              if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
            }}
            required 
            rows={4} 
            className={`input-premium resize-none ${errors.message ? 'border-rose-500 ring-1 ring-rose-500' : ''}`} 
          />
          {errors.message && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-gray-900 px-6 py-3.5 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              <span>Send Inquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
