'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/lib/api-client';
import { Ticket, Lock, Mail, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.post('/users/login', data);
            login(response.data.token, response.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-indigo-600 p-3 rounded-xl mb-4 shadow-lg shadow-indigo-100">
                            <Ticket className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500 text-sm mt-1">Sign in to your support desk account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-9 w-4 h-4 text-gray-400 z-10" />
                            <Input
                                label="Email Address"
                                placeholder="name@example.com"
                                className="pl-10"
                                {...register('email')}
                                error={errors.email?.message}
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-9 w-4 h-4 text-gray-400 z-10" />
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-10"
                                {...register('password')}
                                error={errors.password?.message}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold"
                            isLoading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                   
                </div>
            </div>
        </div>
    );
}
