import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#030303]">
            <div className="absolute inset-0 gradient-bg opacity-20 pointer-events-none" />
            <div className="text-center space-y-8 relative z-10">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 primary-gradient rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/20"
                >
                    <AlertCircle className="w-16 h-16 text-white" />
                </motion.div>
                <div className="space-y-2">
                    <h1 className="text-6xl font-black font-outfit">404</h1>
                    <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest">Gate Not Found</p>
                </div>
                <p className="max-w-xs mx-auto text-muted-foreground">
                    The path you are looking for doesn't exist or has been moved to another dimension.
                </p>
                <Link to="/" className="btn-primary inline-flex items-center gap-2">
                    <Home className="w-4 h-4" /> Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
