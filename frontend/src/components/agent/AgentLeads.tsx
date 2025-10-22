// src/components/agent/AgentLeads.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface ILead {
    _id: string;
    listing: { _id: string; title: string; price: number };
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: 'New' | 'Contacted' | 'Converted' | 'Closed';
    createdAt: string;
}

const leadStatuses = ['New', 'Contacted', 'Converted', 'Closed'];

const AgentLeads: React.FC = () => {
    const { API_BASE_URL, token, isLoggedIn } = useAuth();
    const [leads, setLeads] = useState<ILead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeads = async () => {
        if (!isLoggedIn) return;
        setIsLoading(true);
        try {
            // This hits your protected GET /api/leads/mylistings endpoint
            const response = await axios.get(`${API_BASE_URL}/leads/mylistings`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setLeads(response.data.data.leads);
        } catch (err) {
            setError('Failed to fetch leads.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [isLoggedIn, token]);

    const handleStatusChange = async (leadId: string, newStatus: string) => {
        try {
            // This hits your protected PATCH /api/leads/:id endpoint
            await axios.patch(`${API_BASE_URL}/leads/${leadId}`, 
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Refresh leads list
            fetchLeads();
        } catch (err) {
            setError('Failed to update lead status.');
        }
    };

    if (isLoading) return <div className="text-center py-4">Loading your leads...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
    if (leads.length === 0) return <div className="text-center py-8 text-gray-500">You have no new inquiries yet.</div>;


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Buyer Inquiries ({leads.length})</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Listing</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message Preview</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leads.map((lead) => (
                            <tr key={lead._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <Link to={`/listings/${lead.listing._id}`} className="text-primary hover:underline">
                                        {lead.listing.title || 'View Listing'}
                                    </Link>
                                    <p className="text-xs text-gray-400">Inquiry Date: {new Date(lead.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <p className="font-medium">{lead.name}</p>
                                    <a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a>
                                    <p>{lead.phone || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{lead.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                        className={`p-1 border rounded-md text-xs font-semibold ${
                                            lead.status === 'New' ? 'bg-red-100 text-red-800' :
                                            lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}
                                    >
                                        {leadStatuses.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentLeads;