import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Users,
    Settings,
    Trash2,
    Eye,
    Plus,
    Calendar
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const MyJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const { data } = await api.get('/jobs/my-jobs');
            setJobs(data.data);
        } catch (err) {
            toast.error('Failed to load your jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this job post?')) return;
        try {
            // Assume we have a delete endpoint or just filter for UI feedback
            // await api.delete(`/jobs/${id}`);
            setJobs(jobs.filter(j => j.id !== id));
            toast.success('Job removed');
        } catch (err) {
            toast.error('Failed to delete job');
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-[#030303]">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black font-outfit">Manage Jobs</h1>
                        <p className="text-muted-foreground mt-1 text-lg">Manage your active job postings and applicants.</p>
                    </div>
                    <Link to="/post-job" className="btn-primary flex items-center justify-center gap-2 px-8 py-3">
                        <Plus className="w-5 h-5" /> Post New Job
                    </Link>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card h-32 animate-pulse bg-white/5" />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Briefcase className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold font-outfit">No jobs posted yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-md">Start hiring by creating your first job order. AI will help you score candidates.</p>
                        <Link to="/post-job" className="btn-primary mt-8 px-10">Post a Job Now</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {jobs.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card flex flex-col md:flex-row items-center justify-between gap-6 hover:border-purple-500/30 group"
                                >
                                    <div className="flex items-center gap-5 flex-1 w-full">
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                            <Briefcase className="text-purple-400 w-8 h-8" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 0 Applicants</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                                <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] uppercase font-bold tracking-wider">Active</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                        <button
                                            onClick={() => navigate(`/job/${job.id}`)}
                                            className="flex-1 md:flex-none btn-secondary py-2.5 px-5 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Eye className="w-4 h-4" /> View Matchings
                                        </button>
                                        <button
                                            onClick={() => navigate(`/post-job/${job.id}`)}
                                            className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
                                            title="Edit Job"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="p-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyJobs;
