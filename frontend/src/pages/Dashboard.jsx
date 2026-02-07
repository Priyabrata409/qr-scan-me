import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Plus, Trash2, Save, LogOut, User as UserIcon, Download } from 'lucide-react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contacts, setContacts] = useState([]);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/users/me');
            setUser(res.data);
            setName(res.data.name || '');
            setEmail(res.data.email || '');
            setContacts(res.data.contacts || []);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await api.put('/users/me', { name, email });
            // Save contacts too
            await api.put('/users/me/contacts', contacts.map(c => ({ name: c.name, phone_number: c.phone_number })));
            alert('Profile saved successfully!');
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    const addContact = () => {
        setContacts([...contacts, { name: '', phone_number: '' }]);
    };

    const updateContact = (index, field, value) => {
        const newContacts = [...contacts];
        newContacts[index][field] = value;
        setContacts(newContacts);
    };

    const removeContact = (index) => {
        const newContacts = contacts.filter((_, i) => i !== index);
        setContacts(newContacts);
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10 border-b border-slate-700 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">My Profile</h1>
                        <p className="text-slate-400 mt-1">Manage your details and emergency contacts</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition border border-slate-700">
                        <LogOut size={18} /> Logout
                    </button>
                </header>

                <div className="space-y-8">
                    {/* Personal Info */}
                    <section className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><UserIcon size={20} className="text-indigo-400" /> Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="john@example.com" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                                <input type="text" value={user?.phone_number} disabled className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed" />
                            </div>
                        </div>
                    </section>

                    {/* Emergency Contacts */}
                    <section className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">Emergency Contacts</h2>
                            <button onClick={addContact} className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition">
                                <Plus size={16} /> Add Contact
                            </button>
                        </div>
                        <div className="space-y-3">
                            {contacts.map((contact, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center bg-slate-700/30 p-3 rounded-lg border border-slate-600/50">
                                    <input placeholder="Name (e.g. Mom)" value={contact.name} onChange={(e) => updateContact(index, 'name', e.target.value)} className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full" />
                                    <input placeholder="Phone Number" value={contact.phone_number} onChange={(e) => updateContact(index, 'phone_number', e.target.value)} className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full" />
                                    <button onClick={() => removeContact(index)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {contacts.length === 0 && <p className="text-slate-500 italic text-sm">No emergency contacts added yet.</p>}
                        </div>
                    </section>

                    <div className="flex justify-end">
                        <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition disabled:opacity-70">
                            <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
