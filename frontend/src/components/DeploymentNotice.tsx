import React, { useState } from 'react';
import { AlertTriangle, Clock, Database, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DeploymentNotice = () => {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-3xl"
                >
                    <div className="glass-card bg-[#0a0a0a]/80 border-amber-500/20 backdrop-blur-2xl p-4 md:p-6 shadow-[0_0_50px_-12px_rgba(245,158,11,0.2)] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />

                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-full transition-colors group"
                            title="Dismiss for this session"
                        >
                            <X className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                        </button>

                        <div className="flex items-start gap-5 mr-8">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                                <AlertTriangle className="text-amber-500 w-6 h-6" />
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-xl font-black text-amber-500 font-outfit tracking-tight">⚠️ Deployment System Notice</h3>
                                    <p className="text-sm text-amber-100/60 leading-relaxed font-medium mt-1">
                                        CareerGate is currently running on free-tier production nodes. Please be aware of the following behaviors:
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-widest">
                                            <Clock className="w-3.5 h-3.5" /> Cold Start
                                        </div>
                                        <p className="text-[11px] text-amber-100/50 leading-snug">
                                            Backend instances sleep after 15m of inactivity. **First request may take 60-90s** to wake the server.
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-widest">
                                            <Database className="w-3.5 h-3.5" /> DB Standby
                                        </div>
                                        <p className="text-[11px] text-amber-100/50 leading-snug">
                                            Neon Database enters standby. If dashboards appear empty, please **refresh after 5 seconds**.
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-400 font-bold text-[10px] uppercase tracking-widest">
                                            <Sparkles className="w-3.5 h-3.5" /> AI Latency
                                        </div>
                                        <p className="text-[11px] text-amber-100/50 leading-snug">
                                            Resume analysis and roadmap generation use complex LLM chains. High quality requires a few moments.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeploymentNotice;
