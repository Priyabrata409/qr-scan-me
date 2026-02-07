import React, { useEffect, useState } from 'react';
import api from '../api';
import QRCode from 'react-qr-code';
import { Plus, Users, Download, ExternalLink, Trash2, QrCode as QrIcon } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generatedUser, setGeneratedUser] = useState(null);
    const [downloadingUser, setDownloadingUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const [userToDelete, setUserToDelete] = useState(null);

    const deleteUser = (userId) => {
        setUserToDelete(userId);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/admin/users/${userToDelete}`);
            setUsers(users.filter(u => u.id !== userToDelete));
            setUserToDelete(null);
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Failed to delete user");
        }
    };

    const handleDownloadClick = (user) => {
        // Construct claim link if not present (users list might not have it computed)
        const claimLink = user.claim_link || `${window.location.origin}/view/${user.id}`;
        setDownloadingUser({ ...user, claim_link: claimLink });
    };

    // Effect to trigger download once the hidden QR is rendered
    useEffect(() => {
        if (downloadingUser) {
            // Give React a moment to render the hidden QR
            const timer = setTimeout(() => {
                const svg = document.getElementById("hidden-qr-code");
                if (svg) {
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    const size = 200;
                    const padding = 20;
                    const width = size + padding * 2;
                    canvas.width = width;
                    canvas.height = width;

                    img.onload = () => {
                        ctx.fillStyle = "white";
                        ctx.fillRect(0, 0, width, width);
                        ctx.drawImage(img, padding, padding, size, size);
                        const pngFile = canvas.toDataURL("image/png");
                        const downloadLink = document.createElement("a");
                        downloadLink.download = `qr-${downloadingUser.id}.png`;
                        downloadLink.href = pngFile;
                        downloadLink.click();
                        setDownloadingUser(null);
                    };
                    img.src = "data:image/svg+xml;base64," + btoa(svgData);
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [downloadingUser]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateProfile = async () => {
        const formData = new FormData();
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        try {
            const res = await api.post('/admin/generate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setGeneratedUser({ ...res.data, imagePreview: previewUrl });
            fetchUsers(); // Refresh list
            // Reset file input
            setSelectedFile(null);
            setPreviewUrl(null);
            // Clear file input value
            const fileInput = document.getElementById('qr-image-input');
            if (fileInput) fileInput.value = "";
        } catch (error) {
            console.error("Failed to generate profile", error);
            alert("Failed to generate profile");
        }
    };

    const downloadQR = () => {
        const svg = document.getElementById("generated-qr-code");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        const size = 200;
        const padding = 20;
        const width = size + padding * 2;
        canvas.width = width;
        canvas.height = width;

        const drawFinalQR = () => {
            ctx.drawImage(img, padding, padding, size, size);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `qr-${generatedUser.user_id}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.onload = () => {
            // Fill white background
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, width);

            if (generatedUser.imagePreview) {
                const logoImg = new Image();
                logoImg.crossOrigin = "anonymous";
                logoImg.onload = () => {
                    // Draw QR first
                    ctx.drawImage(img, padding, padding, size, size);

                    // Draw Logo in center
                    const logoSize = size * 0.2; // 20% of QR size
                    const logoX = (width - logoSize) / 2;
                    const logoY = (width - logoSize) / 2;

                    // Draw white background for logo
                    ctx.fillStyle = "white";
                    ctx.fillRect(logoX - 2, logoY - 2, logoSize + 4, logoSize + 4);

                    // Draw logo
                    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

                    const pngFile = canvas.toDataURL("image/png");
                    const downloadLink = document.createElement("a");
                    downloadLink.download = `qr-${generatedUser.user_id}.png`;
                    downloadLink.href = pngFile;
                    downloadLink.click();
                };
                logoImg.src = generatedUser.imagePreview;
            } else {
                drawFinalQR();
            }
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 relative">
            {/* Custom Delete Confirmation Modal */}
            {userToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl max-w-sm w-full mx-4">
                        <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                        <p className="text-slate-300 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setUserToDelete(null)}
                                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition shadow-lg shadow-red-500/20"
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden QR for downloading from list */}
            <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
                {downloadingUser && (
                    <QRCode
                        id="hidden-qr-code"
                        value={downloadingUser.claim_link}
                        size={200}
                        level="H"
                    />
                )}
            </div>

            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10 border-b border-slate-700 pb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="text-indigo-400" /> Admin Dashboard
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={fetchUsers}
                            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Refresh List
                        </button>
                    </div>
                </header>

                {/* Generation Controls */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Custom Logo (Optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="qr-image-input"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-indigo-50 file:text-indigo-700
                                hover:file:bg-indigo-100
                            "
                        />
                        {previewUrl && (
                            <div className="mt-2 text-xs text-green-400">Image selected</div>
                        )}
                    </div>
                    <button
                        onClick={generateProfile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg shadow-indigo-500/20 h-10"
                    >
                        <Plus size={20} /> Generate Blank Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User List */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-slate-300">Registered Users ({users.length})</h2>
                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-700/50 text-slate-400 text-sm">
                                    <tr>
                                        <th className="p-4">Name / ID</th>
                                        <th className="p-4">Phone</th>
                                        <th className="p-4">QR</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-700/30 transition">
                                            <td className="p-4">
                                                <div className="font-medium text-white">{u.name || "Unnamed"}</div>
                                                <div className="text-xs text-slate-500 font-mono">{u.id}</div>
                                            </td>
                                            <td className="p-4 text-slate-300">{u.phone_number || "-"}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDownloadClick(u)}
                                                    className="text-slate-400 hover:text-white transition"
                                                    title="Download QR"
                                                >
                                                    <QrIcon size={20} />
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.is_claimed ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                    {u.is_claimed ? 'Claimed' : 'Unclaimed'}
                                                </span>
                                            </td>
                                            <td className="p-4 flex gap-3">
                                                <a
                                                    href={`/view/${u.id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm"
                                                >
                                                    View <ExternalLink size={14} />
                                                </a>
                                                <button
                                                    onClick={() => deleteUser(u.id)}
                                                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm transition"
                                                >
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500 italic">No users found. Generate one!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Generated QR View */}
                    <div className="lg:col-span-1">
                        {generatedUser ? (
                            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 sticky top-8 text-center">
                                <h2 className="text-xl font-semibold mb-6 text-white">New QR Code</h2>
                                <div className="bg-white p-4 rounded-xl inline-block mb-6 relative">
                                    <QRCode
                                        id="generated-qr-code"
                                        value={generatedUser.claim_link}
                                        size={200}
                                        level="H"
                                    />
                                    {generatedUser.imagePreview && (
                                        <img
                                            src={generatedUser.imagePreview}
                                            alt="Logo"
                                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 object-cover rounded-md bg-white p-0.5 border border-gray-200"
                                        />
                                    )}
                                </div>
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400">
                                        Scan to activate this profile or click below.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={downloadQR}
                                            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                                        >
                                            <Download size={18} /> Download QR PNG
                                        </button>
                                        <a
                                            href={generatedUser.claim_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-500/20"
                                        >
                                            <ExternalLink size={18} /> Open Public Profile
                                        </a>
                                    </div>
                                    <div className="bg-slate-900 p-3 rounded text-left overflow-hidden">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Claim Link</p>
                                        <a href={generatedUser.claim_link} target="_blank" className="text-xs text-indigo-400 truncate hover:underline block">
                                            {generatedUser.claim_link}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center text-slate-500 border-dashed">
                                Configure options above and click "Generate" to create a QR code.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
