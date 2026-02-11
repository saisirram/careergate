import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'CANDIDATE'
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', formData);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#030303]">
            <div className="absolute inset-0 gradient-bg opacity-30 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass-card shadow-2xl space-y-8 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 primary-gradient" />

                    <div className="text-center">
                        <h2 className="text-3xl font-black font-outfit mb-2">Join CareerGate</h2>
                        <p className="text-muted-foreground text-sm">Start your AI-driven career journey today</p>
                    </div>

                    {/* Role Selection */}
                    <div className="flex bg-white/[0.05] p-1 rounded-xl glass">
                        {['CANDIDATE', 'RECRUITER'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setFormData({ ...formData, role })}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${formData.role === role
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                {role.charAt(0) + role.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-all font-sans"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-all font-sans"
                                    placeholder="Min 8 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-white/[0.03] p-3 rounded-lg border border-white/5">
                            <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <p>Passwords must contain at least 8 characters, including 1 uppercase, 1 number, and 1 special character.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-5 h-5" /></>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 font-semibold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
