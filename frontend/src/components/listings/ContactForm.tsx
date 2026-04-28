// src/components/listings/ContactForm.tsx

import { useState } from 'react';
import type { FormEvent, ChangeEvent, FC } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface ContactFormProps {
  listingId: string;
  agentEmail: string; // Used for display, actual recipient determined by backend
  propertyTitle?: string; // Property title to use in the message
}

const ContactForm: FC<ContactFormProps> = ({ listingId, propertyTitle }) => {
  const { user, API_BASE_URL } = useAuth();
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    phone: user?.phone || '',
    message: `I am interested in ${propertyTitle || `listing ${listingId}`} and would like to schedule a viewing. (Please mention the duration before submit)`,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [messageStatus, setMessageStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message too short';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setMessageStatus('idle');

    try {
      const payload = { ...formData, listingId };
      // This hits your public POST /api/leads endpoint
      await axios.post(`${API_BASE_URL}/leads`, payload);

      setMessageStatus('success');
      setFormData({ name: '', email: '', phone: '', message: `I am interested in ${propertyTitle || `listing ${listingId}`} and would like to schedule a viewing. (Please mention the duration before submit)` });
    } catch {
      setMessageStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-400 text-center">
        Send a message directly to the agent
      </p>

      {messageStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Message sent successfully! The agent will contact you shortly.
        </div>
      )}
      {messageStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Failed to send inquiry. Please try again or call the agent directly.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`input-premium ${errors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
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
            className={`input-premium ${errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="contact-phone" className="input-premium-label">
            Phone Number <span className="text-gray-500 font-normal ml-1">(Optional)</span>
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
            className={`input-premium resize-none ${errors.message ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
          />
          {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-yellow-600 text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Message...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              Send Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;