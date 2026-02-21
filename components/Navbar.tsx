'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Ticket, PlusCircle, User as UserIcon } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/tickets" className="flex-shrink-0 flex items-center gap-2 text-indigo-600 font-bold text-xl">
                            <Ticket className="w-6 h-6" />
                            <span>Support Desk</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                href="/tickets"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                            >
                                Tickets
                            </Link>
                            <Link
                                href="/tickets/create"
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
                            >
                                <PlusCircle className="w-4 h-4 mr-1" />
                                New Ticket
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="bg-indigo-100 p-1.5 rounded-full">
                                <UserIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold leading-none">{user.name}</span>
                                <span className="text-[10px] uppercase font-bold text-gray-400 leading-none mt-1">{user.role}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="ml-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
