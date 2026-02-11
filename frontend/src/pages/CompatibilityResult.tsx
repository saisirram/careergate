import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Zap,
    ArrowLeft,
    AlertTriangle,
    Compass,
    ShieldCheck,
    BarChart3,
    Sparkles,
    Trophy,
    Target
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const CompatibilityResult = () => {
    const { jobId } = useParams();
    const [result, setResult] = useState<any>(null);
    const [job, setJob] = useState<any>(null);
    const [gaps, setGaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const analyze = async () => {
            try {
                // Fetch job info first for context
                const jobRes = await api.get(`/jobs/${jobId}`);
                setJob(jobRes.data.data);

                const { data } = await api.post(`/jobs/${jobId}/compatibility`);
                setResult(data.data);

                // Fetch details for gaps
                const detailRes = await api.get(`/compatibility/${data.data.id}`);
                setGaps(detailRes.data.data.gaps || []);
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Analysis failed. Make sure resume is uploaded.');
                navigate('/profile');
            } finally {
                setLoading(false);
            }
        };
        analyze();
    }, [jobId]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#030303] space-y-8">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-bold font-outfit animate-pulse">AI is analyzing your profile...</h3>
                <p className="text-muted-foreground mt-2">Correlating skills, experience, and resume resonance with the job description.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-[#030303] overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-20 pointer-events-none" />

            {/* Ambient Background Orbs */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <Link to="/jobs" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors w-fit group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Jobs
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-4xl md:text-5xl font-black font-outfit tracking-tight">
                                Compatibility <span className="text-stroke-sm">Report</span>
                            </h1>
                            <p className="text-muted-foreground text-lg mt-2 flex items-center gap-2 italic">
                                Matching your profile with <span className="text-white font-bold underline decoration-purple-500/50 underline-offset-4">{job?.title || 'this role'}</span> @ <span className="text-white">{job?.companyName || 'the organization'}</span>
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-md"
                    >
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                            <Trophy className="text-purple-400 w-6 h-6" />
                        </div>
                        <div className="pr-4 text-left">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Generated For</p>
                            <p className="font-bold text-sm">Career Navigator AI</p>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Result Overview */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-0 overflow-hidden relative"
                        >
                            <div className="p-8 pb-0 text-center relative z-10">
                                <div className="relative inline-block">
                                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
                                    <svg className="w-48 h-48 transform -rotate-90 relative z-10">
                                        <circle
                                            cx="96" cy="96" r="84"
                                            className="stroke-white/5"
                                            strokeWidth="12" fill="transparent"
                                        />
                                        <motion.circle
                                            cx="96" cy="96" r="84"
                                            className="stroke-purple-500"
                                            strokeWidth="12" fill="transparent"
                                            strokeDasharray={528}
                                            initial={{ strokeDashoffset: 528 }}
                                            animate={{ strokeDashoffset: 528 - (528 * result.compatibilityScore) / 100 }}
                                            transition={{ duration: 2, ease: "circOut" }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                            className="text-5xl font-black font-outfit"
                                        >
                                            {result.compatibilityScore}%
                                        </motion.span>
                                        <span className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase mt-1">Match Index</span>
                                    </div>
                                </div>
                                <div className="mt-8 mb-4">
                                    <h3 className="text-2xl font-bold font-outfit">Excellent Resonance</h3>
                                    <p className="text-sm text-muted-foreground mt-2 px-4 max-w-[250px] mx-auto">Your profile aligns significantly with the core technical architecture of this role.</p>
                                </div>
                            </div>

                            <div className="bg-white/5 border-t border-white/10 p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                                        <span className="text-sm font-medium">Top Advantage</span>
                                    </div>
                                    <span className="text-sm font-bold text-amber-500">Core Logic</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
                                        <span className="text-sm font-medium">Risk Factor</span>
                                    </div>
                                    <span className="text-sm font-bold text-blue-500">Low</span>
                                </div>
                            </div>

                            <Link
                                to={`/roadmap/generate/${jobId}`}
                                className="w-full h-16 bg-white flex items-center justify-center gap-3 text-black font-black uppercase text-xs tracking-widest hover:bg-purple-500 hover:text-white transition-all duration-300 group"
                            >
                                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                                Construct Growth Roadmap
                            </Link>
                        </motion.div>

                        <div className="glass-card space-y-8">
                            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-4">Profile Breakdown</h4>
                            <div className="space-y-8 py-2">
                                <DimensionItem icon={<Zap className="w-4 h-4 text-purple-400" />} label="Technical Skills" score={result.skillMatchScore} color="stroke-purple-500" />
                                <DimensionItem icon={<BarChart3 className="w-4 h-4 text-blue-400" />} label="Experience Match" score={result.experienceMatchScore} color="stroke-blue-500" />
                                <DimensionItem icon={<Target className="w-4 h-4 text-green-400" />} label="Resume Relevance" score={result.resumeMatchScore} color="stroke-green-500" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: AI & Skill Gaps */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* AI Summary Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card relative border-purple-500/20 shadow-[0_0_40px_-15px_rgba(168,85,247,0.1)]"
                        >
                            <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                <Sparkles className="w-3 h-3 fill-white" /> AI Insights Active
                            </div>

                            <h3 className="text-2xl font-bold font-outfit mb-6">Expert Evaluation</h3>

                            <div className="flex gap-6">
                                <div className="hidden sm:flex flex-col items-center gap-2 opacity-50">
                                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-500 to-transparent" />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-3xl italic leading-relaxed text-purple-100/90 text-[15px]">
                                        "{result.aiAnalysisSummary || 'Analyzing profile resonance...'}"
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2 ml-4">
                                        <Bot className="w-4 h-4 opacity-50" />
                                        Based on cross-analysis of Resume Parsed Content & Defined Role Parameters.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Skill Gap Missions */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card bg-white/[0.02]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold font-outfit flex items-center gap-3">
                                    Skill Alignment <span className="bg-white/5 border border-white/10 text-[10px] px-2 py-0.5 rounded font-black text-muted-foreground">{gaps.length} MISSIONS Found</span>
                                </h3>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                                    <AlertTriangle className="w-3 h-3 text-amber-500" /> Improvement Area
                                </div>
                            </div>

                            <div className="space-y-4">
                                {gaps.length > 0 ? gaps.map((gap, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 + 0.2 }}
                                        className="group p-5 bg-white/[0.02] hover:bg-white/[0.04] rounded-3xl border border-white/5 hover:border-white/10 transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="relative">
                                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                                        <AlertTriangle className="text-amber-500 w-6 h-6" />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#030303] flex items-center justify-center border border-white/10 text-[10px] font-black">
                                                        {gap.gap}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-bold font-outfit text-white group-hover:text-amber-400 transition-colors">{gap.skill?.name || 'Unknown Skill'}</h4>
                                                    <p className="text-xs text-muted-foreground mr-4 leading-relaxed italic">
                                                        {gap.improvementSuggestions}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-black">Required</span>
                                                        <span className="text-sm font-bold text-amber-500/80">{gap.requiredRating}/5</span>
                                                    </div>
                                                    <div className="w-1 h-8 bg-white/10 rounded-full" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-black">Current</span>
                                                        <span className="text-sm font-bold text-white/50">{gap.userRating}/5</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-muted-foreground">
                                                    Difficulty: <span className="text-white">Medium</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <div className="text-center py-12 bg-white/[0.01] rounded-3xl border border-dashed border-white/10">
                                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Trophy className="text-green-500 w-10 h-10" />
                                        </div>
                                        <h4 className="text-2xl font-bold font-outfit text-white">Requirement Absolute Match</h4>
                                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">CareerGate AI indicates your profile fulfills 100% of the critical technical mandates for this role.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DimensionItem = ({ label, score, icon, color }: any) => (
    <div className="flex items-center gap-6 group">
        <div className="relative shrink-0">
            <svg className="w-24 h-24 transform -rotate-90">
                <circle
                    cx="48" cy="48" r="42"
                    className="stroke-white/5"
                    strokeWidth="6" fill="transparent"
                />
                <motion.circle
                    cx="48" cy="48" r="42"
                    className={cn(color || "stroke-purple-500")}
                    strokeWidth="6" fill="transparent"
                    strokeDasharray={264}
                    initial={{ strokeDashoffset: 264 }}
                    animate={{ strokeDashoffset: 264 - (264 * score) / 100 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    {icon}
                </div>
            </div>
        </div>
        <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block">{label}</span>
            <span className="text-2xl font-black font-outfit">{score}%</span>
        </div>
    </div>
);

const Bot = ({ className }: any) => (
    <div className={cn("flex items-center justify-center", className)}>
        <Sparkles className="w-full h-full text-purple-400 fill-purple-400" />
    </div>
);

export default CompatibilityResult;
