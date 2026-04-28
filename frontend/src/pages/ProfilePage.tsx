// frontend/src/pages/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, User, Phone, Mail, Save } from 'lucide-react';
import type { ApiResponse, IUser } from '../types';

interface ProfilePageProps {
    isEmbedded?: boolean;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ isEmbedded = false }) => {
    const { user, token, API_BASE_URL } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        profilePhoto: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'First name must be at least 2 characters';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Last name must be at least 2 characters';
        }
        
        if (formData.phone && formData.phone.trim().length > 0) {
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                newErrors.phone = 'Enter a valid 10-15 digit phone number';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                profilePhoto: user.profilePhoto || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSaving(true);

        try {
            const response = await axios.put<ApiResponse<{ user: IUser }>>(
                `${API_BASE_URL}/users/profile`,
                formData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success || response.status === 200) {
                toast.success('Profile updated successfully!');
            } else {
                toast.error(response.data.message || 'Failed to update profile.');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'An error occurred while updating profile.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className={`${isEmbedded ? 'p-0' : 'min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8'}`}>
            <div className={`${isEmbedded ? 'w-full' : 'max-w-3xl mx-auto bg-surface rounded-lg shadow-xl overflow-hidden'}`}>
                {!isEmbedded && (
                    <div className="px-6 py-8 border-b border-gray-800">
                        <div className="flex items-center space-x-4">
                            <div className="bg-primary/20 p-4 rounded-full">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Your Profile</h1>
                                <p className="text-gray-400">Manage your account settings and personal information.</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={`${isEmbedded ? 'p-8' : 'px-8 py-10'} space-y-6 glass-panel border-t-0 rounded-t-none`}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="input-premium-label">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (errors.firstName) setErrors(prev => ({ ...prev, firstName: '' }));
                                }}
                                required
                                className={`input-premium ${errors.firstName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="input-premium-label">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (errors.lastName) setErrors(prev => ({ ...prev, lastName: '' }));
                                }}
                                required
                                className={`input-premium ${errors.lastName ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="input-premium-label">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="input-premium !pl-14 cursor-not-allowed opacity-70 bg-gray-900/50"
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500 font-medium">Email cannot be changed.</p>
                    </div>

                    <div>
                        <label className="input-premium-label">Phone Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={(e) => {
                                    handleChange(e);
                                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                                }}
                                className={`input-premium !pl-14 ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="input-premium-label">Profile Photo URL</label>
                        <input
                            type="text"
                            name="profilePhoto"
                            value={formData.profilePhoto}
                            onChange={handleChange}
                            placeholder="https://example.com/photo.jpg"
                            className="input-premium"
                        />
                        {formData.profilePhoto && (
                            <div className="mt-4">
                                <img src={formData.profilePhoto} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover border-4 border-primary shadow-[0_0_15px_rgba(223,166,89,0.3)]" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="input-premium-label">Account Role</label>
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-primary/10 text-primary border border-primary/20">
                            {user.role}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-800/60 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
                        >
                            {isSaving ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
