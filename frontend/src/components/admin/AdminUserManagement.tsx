import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Trash2, Shield, User as UserIcon } from 'lucide-react';
import type { IUser, UserRole, ApiResponse } from '../../types';
import ConfirmationModal from '../common/ConfirmationModal';

type UserWithId = IUser & { _id: string };

const AdminUserManagement: React.FC = () => {
    const { token, API_BASE_URL } = useAuth();
    const [users, setUsers] = useState<UserWithId[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse<{ users: UserWithId[] }>>(
                `${API_BASE_URL}/users/admin/users`,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );

            // Handle different API response structures
            const userData = response.data.data?.users || (response.data as any).users || [];
            setUsers(userData);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch user list.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const handleDeleteUser = async () => {
        if (!confirmDeleteId) return;
        const userId = confirmDeleteId;
        setConfirmDeleteId(null);

        setDeletingId(userId);
        try {
            await axios.delete(
                `${API_BASE_URL}/users/admin/users/${userId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );
            setUsers(users.filter(u => u._id !== userId));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete user.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        // We'll implement this later as it requires a new backend route
        console.log(`Updating user ${userId} role to ${newRole}`);
        alert('Role update endpoint not yet implemented in backend.');
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-gray-400">Loading platform users...</p>
        </div>
    );

    if (error) return (
        <div className="text-center bg-red-900/20 border border-red-900/50 rounded-md p-6 my-4">
            <p className="text-red-400 font-medium">{error}</p>
            <button onClick={fetchUsers} className="mt-4 text-primary hover:underline">Try Again</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Platform Users</h2>
                    <p className="text-sm text-gray-500">Total registered users: {users.length}</p>
                </div>
            </div>

            <div className="bg-background rounded-lg border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500 italic">
                                        No users found in the system.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-900/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center">
                                                    <UserIcon className="h-6 w-6 text-gray-500" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{u.firstName} {u.lastName}</div>
                                                    <div className="text-xs text-gray-500">Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-300">{u.email}</div>
                                            <div className="text-xs text-gray-500">{u.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {u.role === 'Admin' && <Shield className="h-4 w-4 text-primary" />}
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value as UserRole)}
                                                    className="bg-background border border-gray-700 text-sm text-gray-300 rounded p-1 focus:ring-primary focus:border-primary"
                                                >
                                                    <option value="Buyer">Buyer</option>
                                                    <option value="Agent">Agent</option>
                                                    <option value="Admin">Admin</option>
                                                    <option value="Tenant">Tenant</option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="Owner">Owner</option>
                                                </select>
                                            </div>
                                        </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => setConfirmDeleteId(u._id)}
                                                disabled={deletingId === u._id}
                                                className="text-red-500 hover:text-red-400 p-2 rounded-md hover:bg-red-500/10 transition-all disabled:opacity-50"
                                                title="Delete User"
                                            >
                                                {deletingId === u._id ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-5 w-5" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!confirmDeleteId}
                onClose={() => setConfirmDeleteId(null)}
                onConfirm={handleDeleteUser}
                title="Delete User Account"
                message="Are you sure you want to delete this user? This action will permanently remove their account and all associated data from the platform. This action cannot be undone."
                confirmText="Delete User"
                type="danger"
            />
        </div>
    );
};

export default AdminUserManagement;