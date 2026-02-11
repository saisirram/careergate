import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard, Briefcase, Compass } from 'lucide-react';
import { cn } from '../utils/cn';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const navLinks = role === 'RECRUITER'
        ? [
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { name: 'My Jobs', path: '/my-jobs', icon: Briefcase },
            { name: 'Post a Job', path: '/post-job', icon: Compass },
            { name: 'Profile', path: '/profile', icon: User },
        ]
        : [
            { name: 'Jobs', path: '/jobs', icon: Briefcase },
            { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
            { name: 'Roadmap', path: '/roadmap', icon: Compass },
            { name: 'Profile', path: '/profile', icon: User },
        ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass px-6 py-3 rounded-2xl">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                        <Briefcase className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold font-outfit tracking-tight">
                        Career<span className="text-purple-500">Gate</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {token ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="flex items-center gap-2 text-sm font-medium hover:text-purple-400 transition-colors"
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium hover:text-purple-400">
                                Log in
                            </Link>
                            <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden mt-2 glass rounded-2xl p-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {token ? (
                        <>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="flex items-center gap-2 text-sm font-medium"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.name}
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium text-red-400"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <Link to="/login" onClick={() => setIsOpen(false)}>Log in</Link>
                            <Link to="/register" className="btn-primary text-center" onClick={() => setIsOpen(false)}>Get Started</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
