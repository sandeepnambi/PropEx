// src/components/agent/CreateListingForm.tsx

import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const propertyTypes = ['House', 'Condo', 'Townhouse', 'Land', 'Apartment'];

interface CreateListingFormProps {
    onSuccess?: () => void;
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

const CreateListingForm: React.FC<CreateListingFormProps> = ({ onSuccess }) => {
    const { API_BASE_URL, token } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        title: '', description: '', price: '', address: '', city: '', state: '',
        zipCode: '', latitude: '', longitude: '', propertyType: propertyTypes[0],
        bedrooms: '0', bathrooms: '0', sqFt: '', yearBuilt: '',
    });
    const [images, setImages] = useState<FileList | null>(null);
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
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
            const response = await axios.post(`${API_BASE_URL}/listings`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                setMessage({ type: 'success', text: `Listing "${response.data.data.listing.title}" created successfully! It is currently in Draft status.` });
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
            const axiosError = err as any;
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
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4 text-primary">1. Basic Details</h3>
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                        <textarea name="description" placeholder="Full Description" value={formData.description} onChange={handleChange} required rows={4} className="w-full p-3 border rounded-md" />
                        <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                        
                        <div className="flex space-x-4">
                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full p-3 border rounded-md bg-white" required>
                                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                            <input type="number" name="yearBuilt" placeholder="Year Built" value={formData.yearBuilt} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                        </div>

                        <button type="button" onClick={() => setStep(2)} className="w-full bg-primary text-white p-3 rounded-md hover:bg-opacity-90 transition">
                            Next: Specs & Location
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4 text-primary">2. Specs & Location</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="number" name="bedrooms" placeholder="Beds" value={formData.bedrooms} onChange={handleChange} required className="p-3 border rounded-md" min="0" />
                            <input type="number" name="bathrooms" placeholder="Baths" value={formData.bathrooms} onChange={handleChange} required className="p-3 border rounded-md" min="0" />
                            <input type="number" name="sqFt" placeholder="Sq. Ft." value={formData.sqFt} onChange={handleChange} required className="p-3 border rounded-md" min="0" />
                        </div>
                        
                        <input type="text" name="address" placeholder="Street Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border rounded-md" />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required className="p-3 border rounded-md" />
                            <input type="text" name="state" placeholder="State/Region" value={formData.state} onChange={handleChange} required className="p-3 border rounded-md" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="text" name="zipCode" placeholder="Zip/Postal Code" value={formData.zipCode} onChange={handleChange} required className="p-3 border rounded-md col-span-1" />
                            <input type="text" name="latitude" placeholder="Latitude (e.g. 30.2)" value={formData.latitude} onChange={handleChange} required className="p-3 border rounded-md" />
                            <input type="text" name="longitude" placeholder="Longitude (e.g. -97.7)" value={formData.longitude} onChange={handleChange} required className="p-3 border rounded-md" />
                        </div>
                        
                        <div className="flex space-x-4">
                            <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-700 p-3 rounded-md hover:bg-gray-100 transition">Back</button>
                            <button type="button" onClick={() => setStep(3)} className="flex-1 bg-primary text-white p-3 rounded-md hover:bg-opacity-90 transition">Next: Photos</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold mb-4 text-primary">3. Image Uploads (Max 5)</h3>
                        <input 
                            type="file" 
                            name="images" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageChange} 
                            required 
                            className="w-full p-3 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-80"
                        />
                        {images && <p className="text-sm text-gray-600">{images.length} file(s) selected.</p>}

                        <div className="flex space-x-4">
                            <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-300 text-gray-700 p-3 rounded-md hover:bg-gray-100 transition">Back</button>
                            <button type="submit" disabled={isLoading} className="flex-1 bg-secondary text-white p-3 rounded-md hover:bg-opacity-90 transition disabled:bg-gray-400 font-semibold">
                                {isLoading ? 'Creating...' : 'Submit Listing'}
                            </button>
                        </div>
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