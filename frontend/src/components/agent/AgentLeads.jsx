// src/components/agent/AgentLeads.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const leadStatuses = ['New', 'Contacted', 'Converted', 'Closed'];

const AgentLeads = () => {
    const { API_BASE_URL, token, isLoggedIn } = useAuth();
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchLeads();
    }, [isLoggedIn, token]);

    const handleStatusChange = async (leadId, newStatus) => {
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

    if (isLoading) return <div className="text-center py-4 text-primary">Loading your leads...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
    if (leads.length === 0) return <div className="text-center py-8 text-gray-500">You have no new inquiries yet.</div>;


    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Buyer Inquiries ({leads.length})</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-background">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Preview</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface/50 divide-y divide-gray-800">
                        {leads.map((lead) => (
                            <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                    <Link to={`/listings/${lead.listing?._id}`} className="text-primary hover:underline">
                                        {lead.listing?.title || 'View Listing'}
                                    </Link>
                                    <p className="text-xs text-gray-500 mt-1">Inquiry Date: {new Date(lead.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    <p className="font-bold text-gray-200">{lead.name}</p>
                                    <a href={`mailto:${lead.email}`} className="text-primary hover:underline text-xs">{lead.email}</a>
                                    <p className="text-xs">{lead.phone || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{lead.message}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                        className={`p-1.5 border border-white/10 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-primary ${
                                            lead.status === 'New' ? 'bg-red-500/10 text-red-500' :
                                            lead.status === 'Contacted' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-green-500/10 text-green-500'
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
