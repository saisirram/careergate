import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import CompatibilityResult from './pages/CompatibilityResult';
import Roadmap from './pages/Roadmap';
import LearningItem from './pages/LearningItem';
import PostJob from './pages/PostJob';
import MyJobs from './pages/MyJobs';
import JobDetails from './pages/JobDetails';
import NotFound from './pages/NotFound';
import DeploymentNotice from './components/DeploymentNotice';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#030303] text-white">
                <Toaster position="top-right"
                    toastOptions={{
                        style: {
                            background: '#121212',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontFamily: 'Plus Jakarta Sans',
                        }
                    }}
                />
                <Navbar />
                <DeploymentNotice />
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    <Route path="/jobs" element={
                        <ProtectedRoute><Jobs /></ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute><Profile /></ProtectedRoute>
                    } />
                    <Route path="/post-job" element={
                        <ProtectedRoute><PostJob /></ProtectedRoute>
                    } />
                    <Route path="/post-job/:id" element={
                        <ProtectedRoute><PostJob /></ProtectedRoute>
                    } />
                    <Route path="/my-jobs" element={
                        <ProtectedRoute><MyJobs /></ProtectedRoute>
                    } />
                    <Route path="/job/:id" element={
                        <ProtectedRoute><JobDetails /></ProtectedRoute>
                    } />
                    <Route path="/job/:jobId/compatibility" element={
                        <ProtectedRoute><CompatibilityResult /></ProtectedRoute>
                    } />
                    <Route path="/roadmap/generate/:jobId" element={
                        <ProtectedRoute><Roadmap /></ProtectedRoute>
                    } />
                    <Route path="/roadmap/:id" element={
                        <ProtectedRoute><Roadmap /></ProtectedRoute>
                    } />
                    <Route path="/roadmap/:roadmapId/item/:itemId" element={
                        <ProtectedRoute><LearningItem /></ProtectedRoute>
                    } />
                    <Route path="/roadmap" element={
                        <ProtectedRoute><Roadmap /></ProtectedRoute>
                    } />

                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
