import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, QrCode, Heart, ChevronRight, Lock, Clock, CheckCircle, Briefcase } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Shield className="text-red-500" size={28} />
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                JanQR
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#features" className="text-slate-400 hover:text-white transition text-sm font-medium hidden md:block">Features</a>
                            <a href="#how-it-works" className="text-slate-400 hover:text-white transition text-sm font-medium hidden md:block">How it Works</a>
                            <Link to="/login" className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-semibold transition border border-slate-700">
                                Login
                            </Link>
                            <a href="#order" className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-full text-sm font-semibold transition shadow-lg shadow-red-500/20">
                                Order Now
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300 mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span>The Smartest Way to Stay Safe</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                        Your Emergency Profile <br /> & Gear Protection inside a QR Code.
                    </h1>

                    <p className="max-w-2xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed">
                        Instantly share critical medical info with first responders and help lost items find their way back to you—all with one smart QR code.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="#order" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition flex items-center justify-center gap-2 shadow-xl shadow-white/10">
                            Get Your QR Sticker <ChevronRight size={20} />
                        </a>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white rounded-full font-bold text-lg hover:bg-slate-700 transition border border-slate-700">
                            Manage Profile
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why you need JanQR</h2>
                        <p className="text-slate-400">Simple, secure, and potentially life-saving features.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<Briefcase className="text-blue-400" size={32} />}
                            title="Protect Your Gear"
                            desc="Smart tags for laptops and bags. Help lost items find their way back to you securely."
                        />
                        <FeatureCard
                            icon={<Lock className="text-indigo-400" size={32} />}
                            title="Secure & Private"
                            desc="You control what information is public. Your data is encrypted and secure."
                        />
                        <FeatureCard
                            icon={<Smartphone className="text-green-400" size={32} />}
                            title="Instant Access"
                            desc="No app required for rescuers. They simply verify their number via OTP to access your details (optional)."
                        />
                        <FeatureCard
                            icon={<Heart className="text-red-400" size={32} />}
                            title="Vital Info"
                            desc="Show blood group, allergies, and emergency contacts immediately to save precious time."
                        />
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
                        <p className="text-slate-400">Get protected in 3 simple steps.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 z-0"></div>

                        <StepCard
                            number="1"
                            title="Order & Recieve"
                            desc="Order your high-quality UV resistant QR stickers and Smart Bag Tags from our store."
                        />
                        <StepCard
                            number="2"
                            title="Scan & Setup"
                            desc="Scan the blank QR code to link it instantly to your phone number."
                        />
                        <StepCard
                            number="3"
                            title="Stay Safe"
                            desc="Stick them on your helmet, bike, laptop, or bag. You are now protected 24/7."
                        />
                    </div>
                </div>
            </section>

            {/* CTA / Order Section */}
            <section id="order" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="max-w-4xl mx-auto bg-slate-800 border border-slate-700 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-orange-500"></div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your peace of mind?</h2>
                    <p className="text-xl text-slate-400 mb-10">
                        Join thousands of smart riders and travelers who trust JanQR.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 w-full md:w-96 hover:bg-slate-800 transition cursor-pointer group shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">BEST VALUE</div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-red-400 transition text-white">Standard Pack</h3>
                            <div className="text-4xl font-bold mb-2 text-white">$12.99</div>
                            <p className="text-slate-500 text-sm mb-6">Everything you need for complete peace of mind.</p>

                            <ul className="text-left text-slate-300 text-sm space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-500/10 p-1 rounded-full"><CheckCircle size={16} className="text-green-500" /></div>
                                    <span>2x <span className="font-semibold text-white">Helmet Stickers</span> (Reflective)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-500/10 p-1 rounded-full"><CheckCircle size={16} className="text-green-500" /></div>
                                    <span>1x <span className="font-semibold text-white">Wallet Card</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-blue-500/10 p-1 rounded-full"><CheckCircle size={16} className="text-blue-400" /></div>
                                    <span className="flex items-center gap-2">2x <span className="font-semibold text-white">Smart Bag Tags</span> <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full uppercase tracking-wider">New</span></span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-500/10 p-1 rounded-full"><CheckCircle size={16} className="text-green-500" /></div>
                                    <span>Lifetime App Access & Updates</span>
                                </li>
                            </ul>

                            <button className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-500/25 transition transform hover:-translate-y-0.5">
                                Pre-order Now
                            </button>
                            <p className="text-slate-500 text-xs mt-4">Free shipping on orders over $25</p>
                        </div>
                    </div>

                    <p className="mt-8 text-slate-500 text-sm">
                        Need help? <a href="mailto:support@janqr.com" className="text-white underline">Contact Support</a>
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} JanQR. All rights reserved.</p>
                <div className="flex justify-center gap-6 mt-4">
                    <a href="#" className="hover:text-white transition">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-600 transition hover:-translate-y-1 duration-300">
        <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

const StepCard = ({ number, title, desc }) => (
    <div className="relative z-10 text-center px-4">
        <div className="w-16 h-16 bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 mx-auto shadow-xl">
            {number}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-400 text-sm">
            {desc}
        </p>
    </div>
);

export default LandingPage;
