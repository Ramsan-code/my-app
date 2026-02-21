'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    Users as UsersIcon,
    Mail,
    Shield,
    Clock,
    MoreVertical,
    AlertCircle
} from 'lucide-react';

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiClient.get('/users');
                // The backend now returns the array directly
                setUsers(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser?.role === 'admin') {
            fetchUsers();
        }
    }, [currentUser]);

    if (currentUser?.role !== 'admin') {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-gray-500 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                        <UsersIcon className="w-8 h-8 text-indigo-600" />
                        User Management
                    </h1>
                    <p className="text-gray-500 mt-1">View and manage system users and their roles</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        <p>Loading users...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center p-4">
                        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">{error}</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                                    <div className="text-xs text-gray-500">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={user.role === 'admin' ? 'error' : user.role === 'agent' ? 'warning' : 'info'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
