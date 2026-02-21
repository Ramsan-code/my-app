'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Ticket, Status, Priority } from '@/types';
import apiClient from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Clock,
    User as UserIcon,
    Tag as TagIcon,
    Plus,
    Inbox
} from 'lucide-react';

export default function TicketListPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all');
    const [priority, setPriority] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (status !== 'all') params.append('status', status);
            if (priority !== 'all') params.append('priority', priority);
            params.append('page', page.toString());
            params.append('limit', '10');

            const response = await apiClient.get(`/tickets?${params.toString()}`);
            setTickets(response.data.tickets);
            setTotalPages(response.data.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load tickets. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [search, status, priority, page]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const getStatusVariant = (status: Status) => {
        switch (status) {
            case 'open': return 'info';
            case 'in-progress': return 'warning';
            case 'resolved': return 'success';
            case 'closed': return 'default';
            default: return 'default';
        }
    };

    const getPriorityVariant = (priority: Priority) => {
        switch (priority) {
            case 'urgent': return 'error';
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl tracking-tight">Tickets</h1>
                </div>
                <Link href="/tickets/create">
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Ticket
                    </Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search tickets..."
                        className="pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <select
                        className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select
                        className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
                        <p>Loading tickets...</p>
                    </div>
                ) : error ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center p-4">
                        <div className="bg-red-50 p-4 rounded-full mb-4">
                            <Inbox className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{error}</h3>
                        <Button onClick={fetchTickets} variant="outline" className="mt-4">Try Again</Button>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center p-4">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <Inbox className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No tickets found</h3>
                        <p className="text-gray-500 max-w-xs mt-1">Try adjusting your filters or create a new ticket to get started.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Priority</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <Link href={`/tickets/${ticket.id}`} className="block">
                                                    <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{ticket.title}</div>
                                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{ticket.description}</div>
                                                    <div className="flex gap-2 mt-2">
                                                        {ticket.tags.map(tag => (
                                                            <span key={tag} className="inline-flex items-center text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded leading-none">
                                                                <TagIcon className="w-2.5 h-2.5 mr-0.5" />
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={getStatusVariant(ticket.status)}>
                                                    {ticket.status.replace('-', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={getPriorityVariant(ticket.priority)}>
                                                    {ticket.priority}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link href={`/tickets/${ticket.id}`} className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-full inline-block transition-all">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
