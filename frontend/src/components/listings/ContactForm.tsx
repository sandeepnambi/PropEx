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

const ContactForm: FC<ContactFormProps> = ({ listingId, agentEmail, propertyTitle }) => {
  const { API_BASE_URL } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I am interested in ${propertyTitle || `listing ${listingId}`} and would like to schedule a viewing.`,
  });
  const [messageStatus, setMessageStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessageStatus('idle');

    try {
      const payload = { ...formData, listingId };
      // This hits your public POST /api/leads endpoint
      await axios.post(`${API_BASE_URL}/leads`, payload);

      setMessageStatus('success');
      setFormData({ name: '', email: '', phone: '', message: `I am interested in ${propertyTitle || `listing ${listingId}`} and would like to schedule a viewing.` });
    } catch (err) {
      setMessageStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600 text-center">
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
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input 
            type="text" 
            id="contact-name"
            name="name" 
            placeholder="Enter your full name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500" 
          />
        </div>
        
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input 
            type="email" 
            id="contact-email"
            name="email" 
            placeholder="Enter your email address" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500" 
          />
        </div>
        
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-gray-500">(Optional)</span>
          </label>
          <input 
            type="tel" 
            id="contact-phone"
            name="phone" 
            placeholder="Enter your phone number" 
            value={formData.phone} 
            onChange={handleChange} 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500" 
          />
        </div>
        
        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea 
            id="contact-message"
            name="message" 
            placeholder="Tell the agent about your interest in this property..." 
            value={formData.message} 
            onChange={handleChange} 
            required 
            rows={4} 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 placeholder-gray-500 resize-none" 
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
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