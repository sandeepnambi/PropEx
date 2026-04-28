// src/components/agent/CreateListingForm.tsx

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const propertyTypes = ['House', 'Condo', 'Townhouse', 'Land', 'Apartment'];

interface CreateListingFormProps {
    onSuccess?: () => void;
    initialData?: any;
    onCancel?: () => void;
}

interface FormData {
    title: string;
    description: string;
    price: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: string;
    longitude: string;
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    sqFt: string;
    yearBuilt: string;
}

const CreateListingForm: React.FC<CreateListingFormProps> = ({ onSuccess, initialData, onCancel }) => {
    const { API_BASE_URL, token } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price?.toString() || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        zipCode: initialData?.zipCode || '',
        latitude: initialData?.latitude?.toString() || '',
        longitude: initialData?.longitude?.toString() || '',
        propertyType: initialData?.propertyType || propertyTypes[0],
        bedrooms: initialData?.bedrooms?.toString() || '0',
        bathrooms: initialData?.bathrooms?.toString() || '0',
        sqFt: initialData?.sqFt?.toString() || '',
        yearBuilt: initialData?.yearBuilt?.toString() || '',
    });
    const [images, setImages] = useState<FileList | null>(null);
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const validateStep = (currentStep: number) => {
        const newErrors: Record<string, string> = {};
        
        if (currentStep === 1) {
            if (!formData.title.trim()) newErrors.title = 'Title is required';
            else if (formData.title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
            
            if (!formData.description.trim()) newErrors.description = 'Description is required';
            else if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
            
            if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
            
            const year = parseInt(formData.yearBuilt);
            if (!formData.yearBuilt || isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
                newErrors.yearBuilt = `Enter a valid year (1800 - ${new Date().getFullYear()})`;
            }
        }
        
        if (currentStep === 2) {
            if (parseInt(formData.bedrooms) < 0) newErrors.bedrooms = 'Invalid bedrooms';
            if (parseInt(formData.bathrooms) < 0) newErrors.bathrooms = 'Invalid bathrooms';
            if (!formData.sqFt || parseFloat(formData.sqFt) <= 0) newErrors.sqFt = 'Invalid area';
            
            if (!formData.address.trim()) newErrors.address = 'Address required';
            if (!formData.city.trim()) newErrors.city = 'City required';
            if (!formData.state.trim()) newErrors.state = 'State required';
            if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip required';
            
            const lat = parseFloat(formData.latitude);
            const lng = parseFloat(formData.longitude);
            if (isNaN(lat) || lat < -90 || lat > 90) newErrors.latitude = 'Invalid lat (-90 to 90)';
            if (isNaN(lng) || lng < -180 || lng > 180) newErrors.longitude = 'Invalid lng (-180 to 180)';
        }

        if (currentStep === 3) {
            if ((!images || images.length === 0) && !initialData?._id) {
                newErrors.images = 'At least one image is required';
            } else if (images && images.length > 5) {
                newErrors.images = 'Maximum 5 images allowed';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = (nextStep: number) => {
        if (validateStep(step)) {
            setStep(nextStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
        
        setMessage(null);
        setIsLoading(true);

        const data = new FormData();
        // Append all text fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key as keyof FormData]);
        });
        
        // Append images
        if (images) {
            for (let i = 0; i < images.length; i++) {
                data.append('images', images[i]); // 'images' must match multer.array('images', 5) in backend
            }
        }

        try {
            const isEditing = !!initialData?._id;
            const url = isEditing 
                ? `${API_BASE_URL}/listings/${initialData._id}`
                : `${API_BASE_URL}/listings`;
            
            const method = isEditing ? 'patch' : 'post';

            const response = await axios({
                method,
                url,
                data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                setMessage({ 
                    type: 'success', 
                    text: isEditing 
                        ? `Listing "${response.data.data.listing.title}" updated successfully!` 
                        : `Listing "${response.data.data.listing.title}" created successfully! It is currently in Draft status.` 
                });
                if (onSuccess) {
                    onSuccess();
                }
                setFormData({ // Reset form
                    title: '', description: '', price: '', address: '', city: '', state: '',
                    zipCode: '', latitude: '', longitude: '', propertyType: propertyTypes[0],
                    bedrooms: '0', bathrooms: '0', sqFt: '', yearBuilt: '',
                });
                setImages(null);
                setStep(1);
            }
        } catch (err) {
            const axiosError = err as { response?: { data?: { message?: string } } };
            const msg = axiosError.response?.data?.message || 'Failed to create listing.';
            setMessage({ type: 'error', text: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 glass-panel p-8">
                        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
                            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                            Basic Details
                        </h3>
                        <div>
                            <label className="input-premium-label">Property Title</label>
                            <input type="text" name="title" placeholder="e.g., Luxury Villa with Ocean View" value={formData.title} onChange={handleChange} required className={`input-premium ${errors.title ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="input-premium-label">Full Description</label>
                            <textarea name="description" placeholder="Describe the property in detail..." value={formData.description} onChange={handleChange} required rows={5} className={`input-premium resize-none ${errors.description ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>
                        <div>
                            <label className="input-premium-label">Price (₹)</label>
                            <input type="number" name="price" placeholder="e.g., 5000000" value={formData.price} onChange={handleChange} required className={`input-premium ${errors.price ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                        </div>
                        
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="input-premium-label">Property Type</label>
                                <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="input-premium" required>
                                    {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="input-premium-label">Year Built</label>
                                <input type="number" name="yearBuilt" placeholder="e.g., 2020" value={formData.yearBuilt} onChange={handleChange} required className={`input-premium ${errors.yearBuilt ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                                {errors.yearBuilt && <p className="mt-1 text-xs text-red-500">{errors.yearBuilt}</p>}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="button" onClick={() => handleNext(2)} className="w-full btn-primary text-lg flex items-center justify-center">
                                Next: Specs & Location
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 glass-panel p-8">
                        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
                            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                            Specs & Location
                        </h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="input-premium-label">Bedrooms</label>
                                <input type="number" name="bedrooms" placeholder="Beds" value={formData.bedrooms} onChange={handleChange} required className={`input-premium ${errors.bedrooms ? 'border-red-500 ring-1 ring-red-500' : ''}`} min="0" />
                                {errors.bedrooms && <p className="mt-1 text-xs text-red-500">{errors.bedrooms}</p>}
                            </div>
                            <div>
                                <label className="input-premium-label">Bathrooms</label>
                                <input type="number" name="bathrooms" placeholder="Baths" value={formData.bathrooms} onChange={handleChange} required className={`input-premium ${errors.bathrooms ? 'border-red-500 ring-1 ring-red-500' : ''}`} min="0" />
                                {errors.bathrooms && <p className="mt-1 text-xs text-red-500">{errors.bathrooms}</p>}
                            </div>
                            <div>
                                <label className="input-premium-label">Area (Sq. Ft.)</label>
                                <input type="number" name="sqFt" placeholder="Sq. Ft." value={formData.sqFt} onChange={handleChange} required className={`input-premium ${errors.sqFt ? 'border-red-500 ring-1 ring-red-500' : ''}`} min="0" />
                                {errors.sqFt && <p className="mt-1 text-xs text-red-500">{errors.sqFt}</p>}
                            </div>
                        </div>
                        
                        <div className="pt-2">
                            <label className="input-premium-label">Street Address</label>
                            <input type="text" name="address" placeholder="123 Main St" value={formData.address} onChange={handleChange} required className={`input-premium ${errors.address ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="input-premium-label">City</label>
                                <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className={`input-premium ${errors.city ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="input-premium-label">State / Region</label>
                                <input type="text" name="state" placeholder="State/Region" value={formData.state} onChange={handleChange} required className={`input-premium ${errors.state ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="input-premium-label">Zip Code</label>
                                <input type="text" name="zipCode" placeholder="Zip/Postal" value={formData.zipCode} onChange={handleChange} required className={`input-premium ${errors.zipCode ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                                {errors.zipCode && <p className="mt-1 text-xs text-red-500">{errors.zipCode}</p>}
                            </div>
                            <div>
                                <label className="input-premium-label">Latitude</label>
                                <input type="text" name="latitude" placeholder="e.g. 30.2" value={formData.latitude} onChange={handleChange} required className={`input-premium ${errors.latitude ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                                {errors.latitude && <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>}
                            </div>
                            <div>
                                <label className="input-premium-label">Longitude</label>
                                <input type="text" name="longitude" placeholder="e.g. -97.7" value={formData.longitude} onChange={handleChange} required className={`input-premium ${errors.longitude ? 'border-red-500 ring-1 ring-red-500' : ''}`} />
                                {errors.longitude && <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>}
                            </div>
                        </div>
                        <div className="flex space-x-4 pt-4">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 btn-secondary text-lg">Back</button>
                            <button type="button" onClick={() => handleNext(3)} className="flex-1 btn-primary text-lg flex items-center justify-center">
                                Next: Photos
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 glass-panel p-8">
                        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
                            <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                            Image Uploads (Max 5)
                        </h3>
                        <div className={`p-6 border-2 border-dashed rounded-xl bg-surface/30 hover:bg-surface/50 transition-colors text-center ${errors.images ? 'border-red-500' : 'border-gray-700'}`}>
                            <svg className="w-12 h-12 text-primary mx-auto mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <input 
                                type="file" 
                                name="images" 
                                accept="image/*" 
                                multiple 
                                onChange={handleImageChange} 
                                required={!initialData?._id}
                                className="w-full text-gray-400 file:cursor-pointer file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all"
                            />
                            {images && <p className="mt-4 text-sm text-green-400 font-medium">{images.length} file(s) selected ready to upload.</p>}
                            {errors.images && <p className="mt-2 text-sm text-red-500 font-medium">{errors.images}</p>}
                        </div>

                        <div className="flex space-x-4 pt-4">
                            <button type="button" onClick={() => setStep(2)} className="flex-1 btn-secondary text-lg">Back</button>
                            <button type="submit" disabled={isLoading} className="flex-1 btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        {initialData?._id ? 'Updating...' : 'Creating...'}
                                    </span>
                                ) : initialData?._id ? 'Update Listing' : 'Submit Listing'}
                            </button>
                        </div>
                        {onCancel && (
                            <div className="pt-2">
                                <button type="button" onClick={onCancel} className="w-full text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                    Cancel & Go Back
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className={`p-4 rounded-md text-white font-semibold ${message.type === 'success' ? 'bg-secondary' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}
            {renderStep()}
        </form>
    );
};

export default CreateListingForm;