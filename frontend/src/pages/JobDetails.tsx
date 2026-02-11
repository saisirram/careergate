import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Briefcase,
    Building2,
    IndianRupee,
    Clock,
    Zap,
    ArrowLeft,
    CheckCircle2,
    Calendar,
    MapPin,
    Target,
    Send,
    Settings
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const [jobRes, statusRes] = await Promise.all([
                    api.get(`/jobs/${id}`),
                    userRole === 'CANDIDATE' ? api.get(`/applications/status/${id}`) : Promise.resolve({ data: { data: false } })
                ]);
                setJob(jobRes.data.data);
                setHasApplied(statusRes.data.data);
            } catch (err) {
                toast.error('Failed to load job details');
                navigate(userRole === 'RECRUITER' ? '/my-jobs' : '/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobData();
    }, [id, navigate, userRole]);

    const handleApply = async () => {
        setApplying(true);
        try {
            await api.post(`/applications/apply/${id}`);
            toast.success('Application submitted successfully!');
            setHasApplied(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303]">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-[#030303]">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-20 pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <Link
                    to={userRole === 'RECRUITER' ? "/my-jobs" : "/jobs"}
                    className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 group w-fit"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {userRole === 'RECRUITER' ? 'Back to My Jobs' : 'Back to Jobs'}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                        <Briefcase className="text-purple-400 w-8 h-8" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black font-outfit leading-tight">{job.title}</h1>
                                        <div className="flex items-center gap-2 text-purple-300 font-bold mt-1">
                                            <Building2 className="w-4 h-4" />
                                            <span>{job.companyName}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs uppercase font-bold tracking-widest text-purple-400 bg-purple-500/5 px-3 py-1.5 rounded-full border border-purple-500/10">Full-Time</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">CTC Range</p>
                                    <div className="flex items-center gap-1.5 font-bold">
                                        <IndianRupee className="w-3.5 h-3.5" />
                                        <span>{new Intl.NumberFormat('en-IN').format(job.minCtc)} - {new Intl.NumberFormat('en-IN').format(job.maxCtc)}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Experience</p>
                                    <div className="flex items-center gap-1.5 font-bold text-blue-400">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{job.minExperience}-{job.maxExperience} yrs</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Location</p>
                                    <div className="flex items-center gap-1.5 font-bold text-green-400">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>Remote</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Posted</p>
                                    <div className="flex items-center gap-1.5 font-bold text-amber-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>New</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-purple-400" />
                                        About the Role
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {job.description}
                                    </p>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                        Required Skills
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requiredSkills?.map((rs: any) => (
                                            <div key={rs.id} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                                                <span className="text-sm font-medium">{rs.skill?.name}</span>
                                                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-1.5 rounded">RATING {rs.minRating}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card sticky top-32"
                        >
                            <h3 className="text-lg font-bold mb-6">{userRole === 'RECRUITER' ? 'Job Management' : 'Take Action'}</h3>
                            <div className="space-y-4">
                                {userRole === 'CANDIDATE' && (
                                    <>
                                        <button
                                            onClick={() => navigate(`/job/${id}/compatibility`)}
                                            className="w-full btn-primary py-4 flex items-center justify-center gap-3 font-bold group shadow-lg shadow-purple-500/20"
                                        >
                                            <Zap className="w-5 h-5 fill-white" /> Check Compatibility
                                        </button>

                                        <button
                                            onClick={handleApply}
                                            disabled={applying || hasApplied}
                                            className={`w-full py-4 flex items-center justify-center gap-3 font-bold transition-all ${hasApplied
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                                                    : 'btn-secondary border-purple-500/20'
                                                }`}
                                        >
                                            {applying ? (
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : hasApplied ? (
                                                <><CheckCircle2 className="w-5 h-5" /> Applied Successfully</>
                                            ) : (
                                                <><Send className="w-5 h-5" /> Apply for Job</>
                                            )}
                                        </button>
                                    </>
                                )}

                                {userRole === 'RECRUITER' && (
                                    <button
                                        onClick={() => navigate(`/post-job/${id}`)}
                                        className="w-full btn-primary py-4 flex items-center justify-center gap-3 font-bold group shadow-lg shadow-purple-500/20"
                                    >
                                        <Settings className="w-5 h-5" /> Edit Job Post
                                    </button>
                                )}

                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                                        <Target className="w-3 h-3" />
                                        {userRole === 'RECRUITER' ? 'Matching engine active.' : 'AI-driven recruitment and matching.'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <div className="glass-card bg-purple-500/5 border-purple-500/10">
                            <h4 className="font-bold text-purple-400 mb-2 text-sm">Pro Tip</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Our AI analyzes your resume and skills against the job requirements. Use 'Check Compatibility' to see where you stand and get improvement tips.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
