import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, User, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import api from '../api';

const PublicView = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Claim State
    const [claimStep, setClaimStep] = useState('phone'); // 'phone' | 'otp'
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [claimLoading, setClaimLoading] = useState(false);
    const [claimError, setClaimError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/public/${userId}`);
                setUser(res.data);
            } catch (err) {
                setError('User not found or link expired.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleSendClaimOtp = async (e) => {
        e.preventDefault();
        setClaimLoading(true);
        setClaimError(null);
        try {
            await api.post('/auth/send-otp', {
                phone_number: phoneNumber,
                user_id: userId // Important for claim flow
            });
            setClaimStep('otp');
        } catch (error) {
            console.error(error);
            setClaimError(error.response?.data?.detail || 'Failed to send OTP.');
        } finally {
            setClaimLoading(false);
        }
    };

    const handleVerifyClaimOtp = async (e) => {
        e.preventDefault();
        setClaimLoading(true);
        setClaimError(null);
        try {
            const res = await api.post('/auth/verify-otp', {
                phone_number: phoneNumber,
                otp: otp,
                user_id: userId
            });
            // Claim success! logging in...
            localStorage.setItem('token', res.data.access_token);
            alert("Profile Activated Successfully!");
            navigate('/');
        } catch (error) {
            console.error(error);
            setClaimError(error.response?.data?.detail || 'Failed to verify OTP.');
        } finally {
            setClaimLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading info...</div>;
    if (error) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400">{error}</div>;

    // --- Claim / Activate View ---
    if (!user.is_claimed) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-slate-100">
                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
                    <div className="text-center mb-6">
                        <Shield className="mx-auto text-indigo-400 mb-2" size={48} />
                        <h1 className="text-2xl font-bold text-white">Activate Profile</h1>
                        <p className="text-slate-400 text-sm mt-1">This QR code is valid but unclaimed.</p>
                        <p className="text-slate-300 mt-4">Enter your phone number to link this QR code to your new emergency profile.</p>
                    </div>

                    {claimError && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                            {claimError}
                        </div>
                    )}

                    {claimStep === 'phone' ? (
                        <form onSubmit={handleSendClaimOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="1234567890"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <button disabled={claimLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                                {claimLoading ? 'Sending...' : 'Send OTP & Activate'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyClaimOtp} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Enter OTP</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-xl"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <button disabled={claimLoading} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
                                {claimLoading ? 'Verifying...' : 'Verify & Claim Profile'}
                            </button>
                            <button type="button" onClick={() => setClaimStep('phone')} className="w-full text-slate-400 hover:text-white text-sm">Back</button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // --- Public View (Claimed) ---
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center">
            {/* ... Existing UI ... */}
            <div className="w-full max-w-lg bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 mb-6">
                <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 text-center">
                    <AlertCircle className="mx-auto text-white mb-2" size={48} />
                    <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Emergency Profile</h1>
                </div>
                <div className="p-8">
                    {user.image_data && (
                        <div className="flex justify-center mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-slate-700 overflow-hidden shadow-lg">
                                {/* Use generic endpoint for public image if needed, assuming /users/{id}/image works publicly? 
                                   Actually users.py get_user_image doesn't fetch current_user, it takes user_id. 
                                   But it uses session. 
                                   Wait, routers/users.py:get_user_image has `user_id` param.
                                   It does NOT depend on `current_user` in signature.
                                   So it is public? NO, `get_user_image` implementation:
                                   `def get_user_image(user_id: UUID, session: Session = Depends(get_session)):`
                                   It doesn't use `Depends(get_current_user)`.
                                   So it IS public.
                                */}
                                <img src={`${api.defaults.baseURL}/users/${user.id}/image`} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    )}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-1">{user.name || "Unknown Name"}</h2>
                        {/* Hide email in public view maybe? Requirement: "See the public view". 
                           Let's show it for now as per previous design. 
                        */}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold border-b border-slate-700 pb-2 mb-4 text-red-400">Emergency Contacts</h3>
                        {user.contacts && user.contacts.length > 0 ? (
                            user.contacts.map((contact, idx) => (
                                <div key={idx} className="bg-slate-700/50 p-4 rounded-xl flex items-center justify-between border border-slate-600 hover:bg-slate-700 transition">
                                    <div>
                                        <p className="font-medium text-white text-lg">{contact.name}</p>
                                        <p className="text-slate-400 text-sm">Tap to Call</p>
                                    </div>
                                    <a href={`tel:${contact.phone_number}`} className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-full transition shadow-lg shadow-green-900/20">
                                        <Phone size={24} />
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center italic">No contacts listed.</p>
                        )}
                    </div>
                </div>
                <div className="bg-slate-900/50 p-4 text-center text-xs text-slate-500 border-t border-slate-700">
                    Verified Emergency Profile System
                </div>
            </div>

            <a href="/login" className="text-slate-500 hover:text-white text-sm flex items-center gap-2 transition">
                <User size={14} /> Own this profile? Login to edit
            </a>
        </div>
    );
};

export default PublicView;
