import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Briefcase,
    Code,
    FileText,
    Plus,
    Trash2,
    Upload,
    Check,
    AlertCircle,
    ChevronDown,
    Save
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const [profile, setProfile] = useState<any>({
        totalExperience: 0,
        currentCtc: 0,
        expectedCtc: 0,
        noticePeriodDays: 30,
        resumeUrl: null,
        resumeFilePath: null
    });
    const [skills, setSkills] = useState<any[]>([]);
    const [newSkill, setNewSkill] = useState({ skill: '', rating: 3 });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            if (data.data) {
                setProfile({
                    totalExperience: data.data.totalExperience || 0,
                    currentCtc: data.data.currentCtc || 0,
                    expectedCtc: data.data.expectedCtc || 0,
                    noticePeriodDays: data.data.noticePeriodDays || 0,
                    resumeUrl: data.data.resumeUrl,
                    resumeFilePath: data.data.resumeFilePath
                });
                setSkills(data.data.skills || []);
            }
        } catch (err) {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await api.put('/profile', profile);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddSkill = async () => {
        if (!newSkill.skill) return;
        const updatedSkills = [...skills, newSkill];
        setSkills(updatedSkills);
        setNewSkill({ skill: '', rating: 3 });
        try {
            const sanitized = updatedSkills.map(s => ({ skill: s.skill, rating: s.rating }));
            await api.post('/profile/skills', sanitized);
            toast.success('Skill added!');
        } catch (err) {
            toast.error('Failed to add skill');
        }
    };

    const handleRemoveSkill = async (idx: number) => {
        const updated = skills.filter((_, i) => i !== idx);
        setSkills(updated);
        try {
            const sanitized = updated.map(s => ({ skill: s.skill, rating: s.rating }));
            await api.post('/profile/skills', sanitized);
            toast.success('Skill removed');
        } catch (err) {
            toast.error('Failed to update skills');
        }
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleUploadResume = async () => {
        if (!file || isUploading) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post('/profile/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Resume parsed successfully!');
            fetchProfile(); // Refresh to get new resumeUrl
            setFile(null);
        } catch (err) {
            toast.error('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen pt-32 pb-12 px-6 bg-[#030303]">
            <div className="absolute top-0 left-0 w-full h-full gradient-bg opacity-20 pointer-events-none" />

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Left: General Info */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Briefcase className="text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold font-outfit">Professional Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                            <InputField
                                label="Total Experience (Years)"
                                type="number"
                                value={profile.totalExperience}
                                onChange={(val: any) => setProfile({ ...profile, totalExperience: val })}
                            />
                            <InputField
                                label="Notice Period (Days)"
                                type="number"
                                value={profile.noticePeriodDays}
                                onChange={(val: any) => setProfile({ ...profile, noticePeriodDays: val })}
                            />
                            <InputField
                                label="Current CTC"
                                type="number"
                                value={profile.currentCtc}
                                onChange={(val: any) => setProfile({ ...profile, currentCtc: val })}
                            />
                            <InputField
                                label="Expected CTC"
                                type="number"
                                value={profile.expectedCtc}
                                onChange={(val: any) => setProfile({ ...profile, expectedCtc: val })}
                            />
                        </div>

                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="btn-primary mt-8 w-full md:w-fit px-10 flex items-center gap-2"
                        >
                            {isSaving ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </motion.div>

                    {/* Skill Management */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                <Code className="text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold font-outfit">Skills & Expertise</h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <input
                                type="text"
                                placeholder="Enter skill (e.g. Java, AWS)"
                                className="flex-1 glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50"
                                value={newSkill.skill}
                                onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                            />
                            <select
                                className="glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none text-white appearance-none"
                                value={newSkill.rating}
                                onChange={(e) => setNewSkill({ ...newSkill, rating: parseInt(e.target.value) })}
                            >
                                {[1, 2, 3, 4, 5].map(r => (
                                    <option key={r} value={r} className="bg-[#111] text-white">
                                        {r} / 5 Rating
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddSkill}
                                className="btn-secondary py-3 px-6 flex items-center gap-2 hover:bg-indigo-500 hover:text-white"
                            >
                                <Plus className="w-5 h-5" /> Add
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {skills.map((s, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-bold">
                                            {s.rating}
                                        </div>
                                        <span className="font-medium">{s.skill}</span>
                                    </div>
                                    <button onClick={() => handleRemoveSkill(idx)} className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Resume Upload */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <FileText className="text-blue-400" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold font-outfit">Resume</h2>
                                {profile.resumeUrl && (
                                    <a
                                        href={profile.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 font-semibold hover:underline"
                                    >
                                        Download current
                                    </a>
                                )}
                            </div>
                        </div>

                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-green-500/50 bg-green-500/5' : 'border-white/10 hover:border-blue-500/50 bg-white/5'
                                }`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                            }}
                        >
                            <input
                                type="file"
                                id="resume"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                            />
                            <label htmlFor="resume" className="cursor-pointer block">
                                <Upload className={`mx-auto w-10 h-10 mb-4 ${file ? 'text-green-400' : 'text-muted-foreground'}`} />
                                <p className="font-medium">{file ? file.name : 'Click to upload or drag & drop'}</p>
                                <p className="text-xs text-muted-foreground mt-2">Support: PDF, DOCX (Max 5MB)</p>
                            </label>
                        </div>

                        <button
                            disabled={!file || isUploading}
                            onClick={handleUploadResume}
                            className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
                        >
                            {isUploading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" /> Upload & Analyze Resume
                                </>
                            )}
                        </button>
                    </motion.div>

                    <div className="glass-card bg-amber-500/5 border-amber-500/10">
                        <div className="flex gap-3">
                            <AlertCircle className="text-amber-500 flex-shrink-0" />
                            <p className="text-xs text-amber-200/80 leading-relaxed">
                                CareerGate AI uses your resume text to match keywords and context with job requirements.
                                Keep your resume up-to-date for best compatibility results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, type, value, onChange }: any) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">{label}</label>
        <div className="relative">
            <input
                type={type}
                className="w-full glass bg-white/[0.05] border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500/50 transition-all"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    </div>
);

export default Profile;
