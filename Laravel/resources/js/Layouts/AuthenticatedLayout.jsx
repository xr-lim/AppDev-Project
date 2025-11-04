import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from '@/firebaseConfig';

export default function AuthenticatedLayout({ header, children }) {
    const [user, setUser] = useState(null);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const auth = getAuth(app);

    // ✅ Get Firebase User
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    name: firebaseUser.displayName || "User",
                    email: firebaseUser.email,
                });
            } else {
                // Not logged in → redirect to login page
                window.location.href = "/login";
            }
        });

        return () => unsubscribe();
    }, []);

    // ✅ Firebase logout
    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = "/login";
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href="/dashboard"
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <div className="inline-flex rounded-md">
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                                    >
                                        {user.name ?? "User"}
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="ms-3 text-red-600 hover:underline"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(prev => !prev)
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor">
                                    <path
                                        className={showingNavigationDropdown ? 'hidden' : 'inline-flex'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            <ResponsiveNavLink href="/dashboard">
                                Dashboard
                            </ResponsiveNavLink>
                        </div>

                        <div className="border-t border-gray-200 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink
                                    as="button"
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}