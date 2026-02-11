import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
    Compass,
    ArrowLeft,
    CheckCircle2,
    PlayCircle,
    Target,
    Sparkles,
    ChevronRight,
    Briefcase
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Roadmap = () => {
    const { id, jobId } = useParams();
    const [roadmap, setRoadmap] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [userRoadmaps, setUserRoadmaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchRoadmap(id);
        } else if (jobId) {
            generateRoadmap(jobId);
        } else {
            fetchUserRoadmaps();
        }
    }, [id, jobId]);

    const fetchUserRoadmaps = async () => {
        try {
            const { data } = await api.get('/roadmaps/my-roadmaps');
            setUserRoadmaps(data.data || []);
        } catch (err) {
            toast.error('Failed to load your roadmaps');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoadmap = async (roadmapId: string) => {
        try {
            const { data } = await api.get(`/roadmaps/${roadmapId}`);
            setRoadmap(data.data.roadmap);
            setItems(data.data.items);
        } catch (err) {
            toast.error('Failed to load roadmap');
        } finally {
            setLoading(false);
        }
    };

    const generateRoadmap = async (targetJobId: string) => {
        setGenerating(true);
        try {
            const { data } = await api.post(`/roadmaps/generate/${targetJobId}`);
            setRoadmap(data.data);
            const detailRes = await api.get(`/roadmaps/${data.data.id}`);
            setItems(detailRes.data.data.items);
            toast.success('Your personalized roadmap is ready!');
        } catch (err) {
            toast.error('Roadmap generation failed');
        } finally {
            setGenerating(false);
            setLoading(false);
        }
    };

    if (loading || generating) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] space-y-8 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
            <div className="relative">
                <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-indigo-400 animate-pulse" />
            </div>
            <div className="text-center relative z-10">
                <h3 className="text-3xl font-black font-outfit bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic">CARVING YOUR PATH</h3>
                <p className="text-muted-foreground mt-4 max-w-sm tracking-wide font-medium">AI is distilling expert knowledge into specific missions for your growth.</p>
            </div>
        </div>
    );

    // List View
    if (!id && !jobId) {
        return (
            <div className="min-h-screen pt-32 pb-32 px-6 bg-[#030303]">
                <div className="fixed inset-0 gradient-bg opacity-[0.08] pointer-events-none" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="mb-16 space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black font-outfit tracking-tighter leading-none"
                        >
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Roadmaps</span>
                        </motion.h1>
                        <p className="text-xl text-muted-foreground">Select a roadmap to continue your learning journey.</p>
                    </div>

                    {userRoadmaps.length === 0 ? (
                        <div className="text-center py-20 glass-card rounded-3xl border-dashed border-2 border-white/10">
                            <Compass className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No Roadmaps Yet</h3>
                            <p className="text-muted-foreground mb-6">Apply to jobs and generate compatibility reports to get personalized roadmaps.</p>
                            <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Browse Jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userRoadmaps.map((map, idx) => (
                                <motion.div
                                    key={map.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link to={`/roadmap/${map.id}`} className="glass-card hover:border-indigo-500/30 transition-all group block h-full">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                                                <Compass className="w-6 h-6 text-indigo-400" />
                                            </div>
                                            <span className="text-xs font-mono text-muted-foreground bg-white/5 px-2 py-1 rounded-lg">
                                                {new Date(map.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                                            {map.job?.title || 'Job Roadmap'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                            {map.job?.description || 'Personalized learning path for this role.'}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-indigo-400 font-bold">
                                            Continue Learning <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const groupedItems = items.reduce((acc: any, item: any) => {
        if (!acc[item.weekNo]) acc[item.weekNo] = [];
        acc[item.weekNo].push(item);
        return acc;
    }, {});

    const totalCompleted = items.filter(i => i.completed).length;
    const progressPercentage = items.length > 0 ? Math.round((totalCompleted / items.length) * 100) : 0;

    return (
        <div className="min-h-screen pt-32 pb-32 px-6 bg-[#030303]">
            <div className="fixed inset-0 gradient-bg opacity-[0.08] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <Link to="/jobs" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-all w-fit mb-12 group">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-bold tracking-tight uppercase text-[10px]">Back to Jobs</span>
                </Link>

                {/* Header */}
                <div className="mb-16 space-y-8">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <Sparkles className="w-3 h-3 fill-indigo-400" /> AI-Powered Learning Path
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black font-outfit tracking-tighter leading-none"
                        >
                            Your Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Roadmap</span>
                        </motion.h1>
                        {/* Display Job Title if available */}
                        {roadmap?.job && (
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl text-muted-foreground font-medium"
                            >
                                for {roadmap.job.title}
                            </motion.h2>
                        )}
                    </div>

                    {/* Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card">
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Total Weeks</p>
                            <p className="text-4xl font-black font-outfit">{Object.keys(groupedItems).length}</p>
                        </div>
                        <div className="glass-card">
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Learning Items</p>
                            <p className="text-4xl font-black font-outfit">{items.length}</p>
                        </div>
                        <div className="glass-card">
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Progress</p>
                            <div className="flex items-center gap-4">
                                <p className="text-4xl font-black font-outfit text-green-400">{progressPercentage}%</p>
                                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Roadmap Items */}
                <div className="space-y-16">
                    {Object.entries(groupedItems).map(([week, weekItems]: any, wIdx) => {
                        const weekCompleted = (weekItems as any[]).filter(i => i.completed).length;
                        const weekProgress = Math.round((weekCompleted / weekItems.length) * 100);

                        return (
                            <motion.div
                                key={week}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: wIdx * 0.1 }}
                                className="space-y-6"
                            >
                                {/* Week Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/30">
                                            W{week}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black font-outfit">Week {week}</h2>
                                            <p className="text-sm text-muted-foreground">{weekItems.length} learning items</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-muted-foreground">{weekCompleted}/{weekItems.length} completed</span>
                                        <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                                style={{ width: `${weekProgress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Week Items */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(weekItems as any[]).map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/roadmap/${roadmap.id}/item/${item.id}`}
                                            className="glass-card group hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden"
                                        >
                                            {item.completed && (
                                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                </div>
                                            )}

                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-all">
                                                    <PlayCircle className="w-6 h-6 text-indigo-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Day {item.dayNo}</span>
                                                    </div>
                                                    <h4 className="text-lg font-bold mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                                                        {item.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold group-hover:gap-3 transition-all">
                                                        <span>Start Learning</span>
                                                        <ChevronRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Completion Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-24 p-12 glass-card border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-[60px] text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
                        <Target className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-3xl font-black font-outfit uppercase">Ready for Success</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg">
                        Complete this roadmap to master the skills needed for your target role. Each lesson is carefully curated to bridge your skill gaps and accelerate your career growth.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Roadmap;
