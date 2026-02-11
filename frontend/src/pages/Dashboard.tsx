import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Compass,
    User,
    TrendingUp,
    AlertCircle,
    ChevronRight,
    Search,
    CheckCircle2,
    Plus,
    Users,
    ArrowUpRight,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const StatCard = ({ icon: Icon, label, value, trend, delay, colorClass = "text-purple-400" }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass-card flex items-center gap-4 group"
    >
        <div className={`w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors`}>
            <Icon className={`${colorClass} w-6 h-6`} />
        </div>
        <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
            <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold font-outfit">{value}</h3>
                {trend && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 font-bold">{trend}</span>}
            </div>
        </div>
    </motion.div>
);

const CandidateDashboard = ({ stats, recentJobs, latestRoadmap }: any) => (
    <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black font-outfit">Candidate Dashboard</h1>
                <p className="text-muted-foreground mt-1 text-lg">Your personalized career growth command center.</p>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/profile" className="btn-secondary flex items-center gap-2 py-2">
                    <User className="w-4 h-4" /> Edit Profile
                </Link>
                <Link to="/jobs" className="btn-primary flex items-center gap-2 py-2">
                    <Search className="w-4 h-4" /> Find Jobs
                </Link>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={TrendingUp} label="Avg. Compatibility" value={`${stats?.compatibility || 0}%`} delay={0.1} />
            <StatCard icon={Compass} label="Active Roadmaps" value={stats?.activeRoadmaps || 0} delay={0.2} />
            <StatCard icon={CheckCircle2} label="Skill Score" value={stats?.skillScore || 0} delay={0.3} />
            <StatCard icon={Briefcase} label="Jobs Analyzed" value={stats?.jobsApplied || 0} delay={0.4} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-outfit">Recommended Jobs</h2>
                    <Link to="/jobs" className="text-purple-400 text-sm font-semibold hover:underline flex items-center gap-1">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentJobs.length > 0 ? recentJobs.map((job: any, idx: number) => (
                        <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }} className="glass-card hover:border-purple-500/30 group cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                                        <Briefcase className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-none group-hover:text-purple-400 transition-colors">{job.title}</h3>
                                        <p className="text-muted-foreground text-sm mt-1">{job.companyName}</p>
                                        <div className="flex items-center gap-3 mt-3">
                                            <span className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10">{job.minExperience}-{job.maxExperience} yrs</span>
                                            <span className="text-[10px] px-2 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/10">Active</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Link to={`/job/${job.id}/compatibility`} className="mt-4 text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 group-hover:bg-purple-500 transition-all flex items-center gap-2">
                                        Analyze <ArrowUpRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="p-8 text-center glass-card text-muted-foreground">No jobs available to recommend.</div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-outfit">Next Milestone</h2>
                {latestRoadmap ? (
                    <div className="glass-card space-y-4 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                        <div className="flex items-center gap-3 text-purple-400">
                            <Compass className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-wide uppercase">Active Roadmap</span>
                        </div>
                        <h4 className="text-xl font-bold">{latestRoadmap.job?.title || 'Personalized Roadmap'}</h4>
                        <p className="text-muted-foreground text-sm line-clamp-2">{latestRoadmap.job?.description || 'Your custom learning path is ready.'}</p>
                        <div className="space-y-2 mt-4">
                            <div className="flex items-center justify-between text-xs"><span>Started</span><span>{new Date(latestRoadmap.createdAt).toLocaleDateString()}</span></div>
                        </div>
                        <Link to={`/roadmap/${latestRoadmap.id}`} className="btn-primary w-full text-center text-sm py-3 mt-2 block">Continue Learning</Link>
                    </div>
                ) : (
                    <div className="glass-card text-center py-8 space-y-4">
                        <Compass className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p className="text-muted-foreground">No active roadmaps found.</p>
                        <Link to="/jobs" className="btn-secondary w-full text-center text-sm py-2 block">Find Jobs</Link>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const RecruiterDashboard = ({ stats, myJobs }: any) => (
    <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl font-black font-outfit">Recruiter Dashboard</h1>
                <p className="text-muted-foreground mt-1 text-lg">Manage your talent pipeline and AI-scored candidates.</p>
            </div>
            <div className="flex items-center gap-3">
                <Link to="/post-job" className="btn-primary flex items-center gap-2 py-3 px-6">
                    <Plus className="w-5 h-5" /> Post New Job
                </Link>
            </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={Briefcase} label="Jobs Posted" value={stats?.jobsPosted || 0} delay={0.1} />
            <StatCard icon={Users} label="Total Applicants" value={stats?.totalApplicants || 0} delay={0.2} colorClass="text-blue-400" />
            <StatCard icon={Star} label="Avg. Skill Score" value={`${stats?.avgSkillScore || 0}%`} delay={0.3} colorClass="text-amber-400" />
            <StatCard icon={TrendingUp} label="Top Matches" value={stats?.topMatches || 0} delay={0.4} colorClass="text-green-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold font-outfit">Your Active Jobs</h2>
                    <Link to="/my-jobs" className="text-purple-400 text-sm font-semibold hover:underline flex items-center gap-1">
                        Manage all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="space-y-4">
                    {myJobs.slice(0, 3).map((job: any, idx: number) => (
                        <motion.div key={job.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }} className="glass-card hover:border-purple-500/30 group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                                        <Briefcase className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-none group-hover:text-purple-400 transition-colors uppercase tracking-tight">{job.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Applicans</span>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/my-jobs`} className="text-xs font-semibold px-4 py-2 rounded-lg bg-white/5 group-hover:bg-purple-500 transition-all">
                                    Manage
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                    {myJobs.length === 0 && (
                        <div className="glass-card py-10 text-center text-muted-foreground border-dashed border-2 border-white/5">
                            No jobs posted yet. Click 'Post New Job' to start.
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-outfit">Recruitment Tips</h2>
                <div className="glass-card bg-blue-500/5 border-blue-500/10 space-y-3">
                    <h4 className="font-bold text-blue-400 flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" /> AI Matching Tip
                    </h4>
                    <p className="text-xs text-blue-100/70 leading-relaxed">
                        Specify exact minimum ratings for skills in your job orders. This helps our AI rank candidates with higher precision.
                    </p>
                </div>
                <div className="glass-card bg-green-500/5 border-green-500/10 space-y-3">
                    <h4 className="font-bold text-green-400 flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4" /> Fresh Talent
                    </h4>
                    <p className="text-xs text-green-100/70 leading-relaxed">
                        We analyze resumes in real-time. Check back frequently for new top matches.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [recentJobs, setRecentJobs] = useState<any[]>([]);
    const [myJobs, setMyJobs] = useState<any[]>([]);
    const [latestRoadmap, setLatestRoadmap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (role === 'RECRUITER') {
                    const [statsRes, jobsRes] = await Promise.all([
                        api.get('/dashboard/recruiter/stats'),
                        api.get('/jobs/my-jobs')
                    ]);
                    setStats(statsRes.data.data);
                    setMyJobs(jobsRes.data.data);
                } else {
                    const [statsRes, jobsRes, roadmapsRes] = await Promise.all([
                        api.get('/dashboard/candidate/stats'),
                        api.get('/jobs'),
                        api.get('/roadmaps/my-roadmaps')
                    ]);
                    setStats(statsRes.data.data);
                    setRecentJobs(jobsRes.data.data.slice(0, 3));
                    if (roadmapsRes.data.data && roadmapsRes.data.data.length > 0) {
                        setLatestRoadmap(roadmapsRes.data.data[0]);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [role]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303]">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 bg-[#030303]">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-20 pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
                {role === 'RECRUITER' ? (
                    <RecruiterDashboard stats={stats} myJobs={myJobs} />
                ) : (
                    <CandidateDashboard stats={stats} recentJobs={recentJobs} latestRoadmap={latestRoadmap} />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
