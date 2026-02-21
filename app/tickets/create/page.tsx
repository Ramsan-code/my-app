'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api-client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, Plus, Tag as TagIcon, X, Send } from 'lucide-react';

const createTicketSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Please provide more details (min 20 chars)'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

export default function CreateTicketPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateTicketForm>({
        resolver: zodResolver(createTicketSchema),
        defaultValues: {
            priority: 'medium',
        }
    });

    const addTag = () => {
        if (currentTag && !tags.includes(currentTag)) {
            setTags([...tags, currentTag]);
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const onSubmit = async (data: CreateTicketForm) => {
        setLoading(true);
        try {
            await apiClient.post('/tickets', {
                ...data,
                tags
            });
            router.push('/tickets');
            router.refresh();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
                onClick={() => router.back()}
                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6 group transition-colors"
            >
                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 bg-indigo-600">
                    <h1 className="text-2xl font-bold text-white">Create New Ticket</h1>
                    <p className="text-indigo-100 mt-1">Describe your issue and we'll get back to you as soon as possible.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
                    <Input
                        label="Ticket Title"
                        placeholder="e.g., Cannot access my dashboard"
                        {...register('title')}
                        error={errors.title?.message}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            className={`w-full min-h-[150px] rounded-md border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'} bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all`}
                            placeholder="Provide a detailed description of the problem..."
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500 font-medium">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Priority Level
                            </label>
                            <select
                                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                {...register('priority')}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tags
                            </label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Add a tag..."
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                </div>
                                <Button type="button" variant="secondary" onClick={addTag}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3 text-sm">
                                {tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 font-medium group text-xs">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1.5 text-indigo-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={loading} className="min-w-[160px] gap-2">
                            <Send className="w-4 h-4" />
                            Submit Ticket
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
