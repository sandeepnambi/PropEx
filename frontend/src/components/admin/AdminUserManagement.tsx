// src/components/admin/AdminUserManagement.tsx

import React, { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import type { IUser, UserRole } from '../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ApiResponse } from '../../types';

type UserWithId = IUser & { _id: string };

const AdminUserManagement: React.FC = () => {
    const { API_BASE_URL: _API_BASE_URL, token } = useAuth();
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

        const fetchUsers = async () => {
        setIsLoading(true);
        try {
            // This will be uncommented when the backend is ready
            // const response = await axios.get<ApiResponse<{ users: UserWithId[] }>>(
            //     `${API_BASE_URL}/admin/users`,
            //     {
            //         headers: { 'Authorization': `Bearer ${token}` },
            //     }
            // );
            // setUsers(response.data.data?.users || []);
            
            // Mock data for development
            const mockUsers: UserWithId[] = [
                { 
                    _id: 'u1', 
                    firstName: 'Alice', 
                    lastName: 'Smith', 
                    email: 'alice@buyer.com', 
                    role: 'Buyer', 
                    phone: '555-1000',
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                { 
                    _id: 'u2', 
                    firstName: 'Bob', 
                    lastName: 'Agent', 
                    email: 'bob@agent.com', 
                    role: 'Agent', 
                    phone: '555-2000',
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
                { 
                    _id: 'u3', 
                    firstName: 'Charlie', 
                    lastName: 'Admin', 
                    email: 'charlie@admin.com', 
                    role: 'Admin', 
                    phone: '555-3000',
                    isActive: true,
                    createdAt: new Date().toISOString()
                },
            ];
            setUsers(mockUsers);
        } catch (err) {
            setError('Failed to fetch user list. (Admin API Check)');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        // Implement PATCH /api/admin/users/:id endpoint logic here
        console.log(`Updating user ${userId} role to ${newRole}`);
        // After successful update, call fetchUsers();
        alert(`Action: Change user ${userId} role to ${newRole}`);
    };

    if (isLoading) return <div className="text-center py-4">Loading user data...</div>;
    if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Manage Platform Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleRoleChange(user._id, e.target.value as UserRole)}
                                        className="p-1 border rounded-md"
                                    >
                                        <option value="Buyer">Buyer</option>
                                        <option value="Agent">Agent</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => alert(`View details for ${user._id}`)} className="text-primary hover:text-opacity-75">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;