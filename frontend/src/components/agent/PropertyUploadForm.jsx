// frontend/src/components/agent/PropertyUploadForm.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PropertyUploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    propertyType: 'Apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    features: [],
    images: [],
    yearBuilt: new Date().getFullYear(),
    status: 'For Sale'
  });
  
  const [featureInput, setFeatureInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || 
               name === 'area' || name === 'yearBuilt' 
               ? Number(value) : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Decode the token to get the user ID
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const agentId = tokenPayload.id; 
      
      if (!agentId) {
        throw new Error('Could not determine agent ID. Please log in again.');
      }

      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'features') {
          formDataToSend.append(key, String(value));
        }
      });

      // Append the agent ID
      formDataToSend.append('agent', agentId);
      
      // Append features as a JSON string
      formDataToSend.append('features', JSON.stringify(formData.features));
      
      // Append each image file
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'}/listings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload property');
      }

      setSuccess('Property listed successfully!');
      setTimeout(() => navigate('/agent/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-surface/50 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl animate-fade-in-up">
      <h2 className="text-3xl font-black mb-8 text-white tracking-tight">List a <span className="text-primary">New Property</span></h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl font-bold flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl font-bold flex items-center gap-3">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs">01</span>
              Basic Info
            </h3>
            
            <div>
              <label className="input-premium-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-premium"
                placeholder="Ex: Luxury Penthouse with City View"
              />
            </div>

            <div>
              <label className="input-premium-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="input-premium resize-none"
                placeholder="Describe the property highlights..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-premium-label">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                  className="input-premium"
                />
              </div>

              <div>
                <label className="input-premium-label">Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="input-premium appearance-none cursor-pointer"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Condo">Condo</option>
                  <option value="Land">Land</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="input-premium-label">Beds *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  required
                  className="input-premium"
                />
              </div>

              <div>
                <label className="input-premium-label">Baths *</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  required
                  className="input-premium"
                />
              </div>

              <div>
                <label className="input-premium-label">Sq Ft *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="0"
                  required
                  className="input-premium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-premium-label">Year Built</label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="input-premium-label">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="input-premium appearance-none cursor-pointer"
                >
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location & Media */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-primary text-xs">02</span>
              Location & Media
            </h3>
            
            <div>
              <label className="input-premium-label">Street Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="input-premium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-premium-label">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="input-premium"
                />
              </div>

              <div>
                <label className="input-premium-label">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="input-premium"
                />
              </div>
            </div>

            <div>
              <label className="input-premium-label">ZIP Code *</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                className="input-premium"
              />
            </div>

            {/* Features */}
            <div>
              <label className="input-premium-label">Key Features</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="Add a feature (e.g., Gym)"
                  className="input-premium flex-grow"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 bg-secondary text-primary font-bold rounded-xl border border-primary/20 hover:bg-primary/10 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {formData.features.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="hover:text-white transition-colors"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="input-premium-label">Photos *</label>
              <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-white/5 border-dashed rounded-2xl bg-white/5 hover:bg-white/10 transition-all group cursor-pointer relative">
                <div className="space-y-2 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500 group-hover:text-primary transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-sm font-bold text-gray-400">
                    <span className="text-primary hover:underline">Upload photos</span>
                    <span className="ml-1">or drag & drop</span>
                  </div>
                  <p className="text-xs text-gray-600">High resolution JPG or PNG files</p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative aspect-square group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-8 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || formData.images.length === 0}
            className={`btn-primary px-10 py-3 text-lg font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 ${(isLoading || formData.images.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'List Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyUploadForm;
