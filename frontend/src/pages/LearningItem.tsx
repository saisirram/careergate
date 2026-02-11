import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    CheckCircle2,
    ExternalLink,
    BookOpen,
    PlayCircle,
    Sparkles
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const LearningItem = () => {
    const { roadmapId, itemId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [articleLinks, setArticleLinks] = useState<string[]>([]);

    useEffect(() => {
        fetchItem();
    }, [itemId]);

    const fetchItem = async () => {
        try {
            const { data } = await api.get(`/roadmaps/${roadmapId}`);
            const foundItem = data.data.items.find((i: any) => i.id === itemId);
            if (foundItem) {
                setItem(foundItem);
                // Parse article links from JSON string
                if (foundItem.articleLinks) {
                    try {
                        const links = JSON.parse(foundItem.articleLinks);
                        setArticleLinks(Array.isArray(links) ? links : []);
                    } catch {
                        setArticleLinks([]);
                    }
                }
            } else {
                toast.error('Learning item not found');
                navigate(`/roadmap/${roadmapId}`);
            }
        } catch (err) {
            toast.error('Failed to load learning item');
            navigate(`/roadmap/${roadmapId}`);
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async () => {
        try {
            await api.patch(`/roadmaps/items/${itemId}/complete`);
            toast.success('Great job! Item marked as complete 🎉');
            setItem({ ...item, completed: true });
        } catch (err) {
            toast.error('Failed to mark as complete');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#030303]">
            <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    if (!item) return null;

    return (
        <div className="min-h-screen bg-[#030303] pt-24 pb-16 px-6">
            <div className="fixed inset-0 gradient-bg opacity-[0.1] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <Link
                    to={`/roadmap/${roadmapId}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-white transition-all w-fit mb-8 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-bold tracking-tight uppercase text-[10px]">Back to Roadmap</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                    Week {item.weekNo} • Day {item.dayNo}
                                </div>
                                {item.completed && (
                                    <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 className="w-3 h-3" /> Completed
                                    </div>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black font-outfit tracking-tight leading-none">
                                {item.title}
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>

                    {/* Video Player */}
                    <div className="glass-card p-0 overflow-hidden rounded-[40px] border-white/5">
                        <div className="aspect-video bg-black relative">
                            {item.youtubeVideoId ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${item.youtubeVideoId}?rel=0`}
                                    title={item.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onError={() => {
                                        // If video fails to load, show search option
                                        console.log('Video failed to load');
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                                    <PlayCircle className="w-20 h-20 text-indigo-400 opacity-40" />
                                    <div className="text-center space-y-4">
                                        <h3 className="text-2xl font-bold">Find Your Learning Video</h3>
                                        <p className="text-muted-foreground max-w-md">
                                            Search for tutorials on this topic to start learning
                                        </p>
                                        <a
                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.youtubeSearchQuery || (item.title + ' tutorial complete guide'))}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-red-600 hover:bg-red-500 font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                                        >
                                            <PlayCircle className="w-5 h-5" />
                                            Search on YouTube
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fallback search button */}
                        <div className="p-6 bg-white/[0.02] border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Video not loading? Try searching directly
                                </p>
                                <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.youtubeSearchQuery || (item.title + ' tutorial complete guide'))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-xs font-bold transition-all"
                                >
                                    <PlayCircle className="w-4 h-4 text-red-500" />
                                    Search YouTube
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Resources Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-card space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <BookOpen className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h2 className="text-2xl font-black font-outfit">Supporting Resources</h2>
                                </div>

                                {articleLinks.length > 0 ? (
                                    <div className="space-y-3">
                                        {articleLinks.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group"
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 group-hover:bg-blue-600/20 transition-all">
                                                    <ExternalLink className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-bold truncate group-hover:text-indigo-400 transition-colors">
                                                        {new URL(link).hostname.replace('www.', '')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">{link}</p>
                                                </div>
                                                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors shrink-0" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-muted-foreground">
                                        <p>No additional resources available for this topic.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress Card */}
                        <div className="space-y-6">
                            <div className="glass-card space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                        <Sparkles className="w-5 h-5 text-purple-400 fill-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-black font-outfit">Your Progress</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2">Current Status</p>
                                        <p className="text-2xl font-black font-outfit">
                                            {item.completed ? (
                                                <span className="text-green-400">Completed ✓</span>
                                            ) : (
                                                <span className="text-amber-400">In Progress</span>
                                            )}
                                        </p>
                                    </div>

                                    {!item.completed && (
                                        <button
                                            onClick={markComplete}
                                            className="w-full flex items-center justify-center gap-3 py-5 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Mark as Complete
                                        </button>
                                    )}

                                    <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                                            💡 Complete this lesson to track your progress and unlock the next milestone in your learning journey.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LearningItem;
