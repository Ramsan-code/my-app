'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Ticket, Comment, Status, Priority } from '@/types';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
    ChevronLeft,
    Send,
    Lock,
    Unlock,
    User as UserIcon,
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    MoreHorizontal
} from 'lucide-react';

export default function TicketDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newComment, setNewComment] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [ticketRes, commentsRes] = await Promise.all([
                apiClient.get(`/tickets/${id}`),
                apiClient.get(`/tickets/${id}/comments`)
            ]);
            setTicket(ticketRes.data);
            setComments(commentsRes.data);
        } catch (err: any) {
            setError('Failed to load ticket details.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setCommentLoading(true);
        try {
            const response = await apiClient.post(`/tickets/${id}/comments`, {
                content: newComment,
                isInternal: user?.role === 'customer' ? false : isInternal
            });
            setComments([...comments, response.data]);
            setNewComment('');
            setIsInternal(false);
        } catch (err: any) {
            alert('Failed to add comment');
        } finally {
            setCommentLoading(false);
        }
    };

    const getStatusVariant = (status?: Status) => {
        switch (status) {
            case 'open': return 'info';
            case 'in-progress': return 'warning';
            case 'resolved': return 'success';
            case 'closed': return 'default';
            default: return 'default';
        }
    };

    const getPriorityVariant = (priority?: Priority) => {
        switch (priority) {
            case 'urgent': return 'error';
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !ticket) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900">{error || 'Ticket not found'}</h2>
                <Button onClick={() => router.back()} className="mt-4" variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 group transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Tickets
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <Badge variant={getStatusVariant(ticket.status)}>
                                    {ticket.status.replace('-', ' ')}
                                </Badge>
                                <Badge variant={getPriorityVariant(ticket.priority)}>
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{ticket.title}</h1>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100 italic">
                                {ticket.description}
                            </div>

                            <div className="flex flex-wrap gap-2 mt-6">
                                {ticket.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center text-xs bg-indigo-50 text-indigo-700 font-medium px-2.5 py-1 rounded-md border border-indigo-100">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            Activity & Comments
                            <span className="bg-gray-100 text-gray-500 text-sm px-2 py-0.5 rounded-full font-normal">
                                {comments.length}
                            </span>
                        </h3>

                        <div className="space-y-4">
                            {comments
                                .filter(c => !c.isInternal || (user?.role === 'agent' || user?.role === 'admin'))
                                .map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={`rounded-2xl p-5 border shadow-sm transition-all ${comment.isInternal
                                            ? 'bg-amber-50 border-amber-200'
                                            : 'bg-white border-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${comment.isInternal ? 'bg-amber-200' : 'bg-indigo-100'}`}>
                                                    <UserIcon className={`w-4 h-4 ${comment.isInternal ? 'text-amber-700' : 'text-indigo-600'}`} />
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 text-sm">{comment.authorName}</span>
                                                    <span className="ml-2 text-[10px] uppercase font-bold text-gray-400">{comment.authorRole}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {comment.isInternal && (
                                                    <span className="inline-flex items-center text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded leading-none uppercase tracking-wider">
                                                        Internal Note
                                                    </span>
                                                )}
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(comment.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${comment.isInternal ? 'text-amber-900' : 'text-gray-700'}`}>
                                            {comment.content}
                                        </p>
                                    </div>
                                ))}
                        </div>

                        {/* Add Comment Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <form onSubmit={handleAddComment}>
                                <textarea
                                    className="w-full min-h-[120px] rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none mb-4"
                                    placeholder="Share an update or ask a question..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={commentLoading}
                                />
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    {(user?.role === 'agent' || user?.role === 'admin') ? (
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="visibility"
                                                    className="hidden"
                                                    checked={!isInternal}
                                                    onChange={() => setIsInternal(false)}
                                                />
                                                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${!isInternal ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                                    <Unlock className="w-4 h-4" />
                                                    Public Comment
                                                </div>
                                            </label>
                                            <label className="flex items-center cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="visibility"
                                                    className="hidden"
                                                    checked={isInternal}
                                                    onChange={() => setIsInternal(true)}
                                                />
                                                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${isInternal ? 'text-amber-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                                    <Lock className="w-4 h-4" />
                                                    Internal Note
                                                </div>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <Unlock className="w-3 h-3" />
                                            Your comment will be visible to support agents.
                                        </div>
                                    )}
                                    <Button
                                        type="submit"
                                        isLoading={commentLoading}
                                        className="w-full sm:w-auto min-w-[140px] gap-2"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 pb-2 border-b border-gray-50">Ticket Information</h4>
                        <dl className="space-y-6">
                            <div>
                                <dt className="text-xs font-medium text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Created On
                                </dt>
                                <dd className="text-sm font-semibold text-gray-800">
                                    {new Date(ticket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                                    <UserIcon className="w-3.5 h-3.5" />
                                    Submitted By
                                </dt>
                                <dd className="text-sm font-semibold text-gray-800">
                                    User ID: {ticket.ownerId}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Assigned Agent
                                </dt>
                                <dd className="text-sm font-semibold text-gray-800">
                                    {ticket.assigneeId || 'Unassigned'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-gray-400 uppercase mb-1.5 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Last Updated
                                </dt>
                                <dd className="text-sm font-semibold text-gray-800">
                                    {new Date(ticket.updatedAt).toLocaleTimeString()}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
