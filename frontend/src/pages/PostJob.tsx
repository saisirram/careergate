import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PostJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        minExperience: 0,
        maxExperience: 0,
        minCtc: 0,
        maxCtc: 0,
        requiredSkills: [] as { skill: string, minRating: number }[]
    });
    const [newSkill, setNewSkill] = useState({ skill: '', minRating: 3 });

    useEffect(() => {
        if (id) {
            const fetchJob = async () => {
                setFetching(true);
                try {
                    const { data } = await api.get(`/jobs/${id}`);
                    const job = data.data;
                    setFormData({
                        title: job.title,
                        companyName: job.companyName,
                        description: job.description,
                        minExperience: job.minExperience,
                        maxExperience: job.maxExperience,
                        minCtc: job.minCtc,
                        maxCtc: job.maxCtc,
                        requiredSkills: job.requiredSkills.map((rs: any) => ({
                            skill: rs.skill.name,
                            minRating: rs.minRating
                        }))
                    });
                } catch (err: any) {
                    toast.error('Failed to load job details');
                } finally {
                    setFetching(false);
                }
            };
            fetchJob();
        }
    }, [id]);

    const handleAddSkill = () => {
        if (!newSkill.skill) return;
        setFormData({
            ...formData,
            requiredSkills: [...formData.requiredSkills, newSkill]
        });
        setNewSkill({ skill: '', minRating: 3 });
    };

    const handleRemoveSkill = (idx: number) => {
        setFormData({
            ...formData,
            requiredSkills: formData.requiredSkills.filter((_, i) => i !== idx)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.requiredSkills.length === 0) {
            toast.error('Please add at least one required skill');
            return;
        }
        setLoading(true);
        try {
            if (id) {
                await api.put(`/jobs/${id}`, formData);
                toast.success('Job updated successfully!');
            } else {
                await api.post('/jobs', formData);
                toast.success('Job posted successfully!');
            }
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to save job');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303]">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-[#030303]">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-20 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 group w-fit">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                            <Plus className={`text-purple-400 w-8 h-8 ${id ? 'rotate-45' : ''}`} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black font-outfit">{id ? 'Edit Job Posting' : 'Post New Job'}</h1>
                            <p className="text-muted-foreground mt-1">{id ? 'Update your job requirements and details.' : 'Hire the best talent with AI-assisted screening.'}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Job Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Senior Backend Engineer"
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-sans"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Google, Amazon, Startup Inc."
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-sans"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Job Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Describe the role, responsibilities, and perks..."
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all resize-none font-sans"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Min Experience (Yrs)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-sans text-lg font-bold"
                                    value={formData.minExperience}
                                    onChange={(e) => setFormData({ ...formData, minExperience: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Max Experience (Yrs)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-sans text-lg font-bold"
                                    value={formData.maxExperience}
                                    onChange={(e) => setFormData({ ...formData, maxExperience: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 font-bold text-emerald-400">Min CTC (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-sans text-lg font-bold text-emerald-300"
                                    value={formData.minCtc}
                                    onChange={(e) => setFormData({ ...formData, minCtc: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1 font-bold text-emerald-400">Max CTC (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all font-sans text-lg font-bold text-emerald-300"
                                    value={formData.maxCtc}
                                    onChange={(e) => setFormData({ ...formData, maxCtc: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Required Skills */}
                        <div className="space-y-4 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-purple-400" />
                                <h3 className="text-xl font-bold font-outfit">Required Skills & Min Rating</h3>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    placeholder="Skill (e.g. React, Spring Boot)"
                                    className="flex-1 glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50"
                                    value={newSkill.skill}
                                    onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                                />
                                <select
                                    className="glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none text-white font-bold"
                                    value={newSkill.minRating}
                                    onChange={(e) => setNewSkill({ ...newSkill, minRating: parseInt(e.target.value) })}
                                >
                                    {[1, 2, 3, 4, 5].map(r => (
                                        <option key={r} value={r} className="bg-[#111] text-white">
                                            Min Rating: {r}/5
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddSkill}
                                    className="btn-secondary py-3 px-6 flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" /> Add
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                {formData.requiredSkills.map((s, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 text-xs font-bold">
                                                {s.minRating}+
                                            </div>
                                            <span className="font-medium">{s.skill}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(idx)}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Save className="w-5 h-5" /> {id ? 'Update Job Details' : 'Post Job Order'}</>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default PostJob;
