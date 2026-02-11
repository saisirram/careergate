import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Briefcase,
    Building2,
    IndianRupee,
    Clock,
    ChevronRight
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Jobs = () => {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs');
                setJobs(data.data);
            } catch (err) {
                toast.error('Failed to load jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const timeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-[#030303]">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-20 pointer-events-none" />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <div className="glass p-6 rounded-3xl flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-purple-400" />
                        <input
                            type="text"
                            placeholder="Search for roles, skills, or companies..."
                            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-6 outline-none focus:border-purple-500/50 transition-all font-sans text-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="btn-secondary h-full py-4 px-8 flex items-center gap-2">
                        <Filter className="w-5 h-5" /> Filters
                    </button>
                    <button className="btn-primary h-full py-4 px-10">
                        Search
                    </button>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-outfit">Showing {filteredJobs.length} Jobs</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="glass-card h-64 animate-pulse bg-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredJobs.map((job, idx) => (
                                <motion.div
                                    key={job.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="glass-card flex flex-col justify-between group h-full hover:border-purple-500/30"
                                >
                                    <div>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                                <Briefcase className="text-purple-400 w-7 h-7" />
                                            </div>
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400/80 bg-purple-500/5 px-2 py-1 rounded-full border border-purple-500/10">Full-Time</span>
                                        </div>

                                        <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors line-clamp-1">{job.title}</h3>
                                        <div className="flex items-center gap-2 mb-3 text-sm text-purple-300 font-medium">
                                            <Building2 className="w-4 h-4" />
                                            <span>{job.companyName}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {job.requiredSkills?.slice(0, 3).map((rs: any) => (
                                                <span key={rs.id} className="text-[10px] px-2 py-1 bg-white/5 border border-white/5 rounded-md">
                                                    {rs.skill?.name || 'Skill'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {timeAgo(job.createdAt)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <IndianRupee className="w-3 h-3" /> {job.minCtc ? `${job.minCtc}-${job.maxCtc}` : 'Not Specified'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/job/${job.id}`)}
                                            className="w-full btn-secondary flex items-center justify-center gap-2 py-3 group-hover:border-purple-500/50 transition-all font-bold"
                                        >
                                            View Details <ChevronRight className="w-4 h-4" />
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

export default Jobs;
