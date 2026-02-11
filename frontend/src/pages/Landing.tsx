import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, Target, Zap, ChevronRight, BarChart3, GraduationCap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="glass-card group"
    >
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Icon className="text-purple-400 w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold mb-2 font-outfit">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </motion.div>
);

const Landing = () => {
    return (
        <div className="min-h-screen bg-[#030303] overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-50 z-0" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 z-10">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 mb-8"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-semibold tracking-wider uppercase">AI-Powered Career Evolution</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 font-outfit leading-tight lg:leading-[1.1]"
                    >
                        Bridge Your <span className="text-gradient">Skill Gap</span> <br />
                        with <span className="text-purple-500">AI Intelligence</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Upload your resume, analyze your compatibility with dream jobs, and get a
                        personalized learning roadmap powered by advanced AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                            Get Started Free <ChevronRight className="w-5 h-5" />
                        </Link>
                        <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                            View Demo
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-20 relative px-4"
                    >
                        <div className="max-w-5xl mx-auto glass rounded-3xl p-4 md:p-8 aspect-video overflow-hidden border-white/10 group">
                            <div className="absolute inset-0 primary-gradient opacity-10 animate-pulse pointer-events-none" />
                            <div className="w-full h-full bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                                {/* Placeholder for App Mockup */}
                                <BarChart3 className="w-32 h-32 text-white/10 animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <Bot className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-bounce" />
                                        <h4 className="text-2xl font-bold font-outfit uppercase tracking-[0.2em] text-white/50">Next-Gen Hiring</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-6 z-10 border-t border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4">Powerful Features</h2>
                        <p className="text-muted-foreground">Everything you need to land your dream career.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Bot}
                            title="Resume AI Analysis"
                            description="Our LLMs extract deep insights from your resume, identifying core strengths and areas for improvement."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={Target}
                            title="Compatibility Score"
                            description="Get an instant percentage match for any job posting based on experience, skills, and resume resonance."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Skill Gap Discovery"
                            description="Visualized breakdown of exactly what you are missing compared to market requirements for your target role."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={GraduationCap}
                            title="Personalized Roadmap"
                            description="A week-by-week learning plan generated by AI to bridge your skill gaps with direct course links."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Instant Feedback"
                            description="Real-time validation of your profile updates and skill additions with immediate score adjustments."
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="Job Recommendations"
                            description="AI-curated job feed that matches your unique profile and career aspirations."
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 relative z-10 text-center">
                <div className="max-w-3xl mx-auto glass p-12 rounded-[3rem] border-white/10 relative overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full primary-gradient opacity-10 blur-[100px] pointer-events-none" />
                    <h2 className="text-4xl font-bold font-outfit mb-6">Ready to scale your career?</h2>
                    <p className="text-muted-foreground mb-10 text-lg">Join thousands of developers leveling up with CareerGate.</p>
                    <Link to="/register" className="btn-primary text-lg px-10">
                        Join Now - It's Free
                    </Link>
                </div>
            </section>

            <footer className="py-10 text-center text-muted-foreground text-sm border-t border-white/5 bg-black">
                <p>&copy; 2026 CareerGate. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
