import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activePage, setActivePage] = useState('dashboard');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const [modalStatus, setModalStatus] = useState('pending');
    const [modalNotes, setModalNotes] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch reports from API
    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/reports');
            if (response.data.success) {
                setReports(response.data.data);
                setFilteredReports(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch reports:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter reports by search query
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredReports(reports);
        } else {
            const filtered = reports.filter(report =>
                report.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredReports(filtered);
        }
    }, [searchQuery, reports]);

    const getStatusClass = (status) => {
        switch(status) {
            case 'pending': return 'status-received';
            case 'reviewed': return 'status-processed';
            case 'resolved': return 'status-verified';
            default: return 'status-received';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'pending': return '📥';
            case 'reviewed': return '⏳';
            case 'resolved': return '✓';
            default: return '📥';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'pending': return 'Received';
            case 'reviewed': return 'Processed';
            case 'resolved': return 'Verified';
            default: return 'Received';
        }
    };

    const handleRowClick = (report) => {
        setSelectedReport(report);
    };

    const handleUpdateStatus = async () => {
        try {
            const response = await axios.patch(`/api/reports/${currentEditId}/status`, {
                status: modalStatus
            });
            if (response.data.success) {
                alert(`Report updated to ${modalStatus}`);
                await fetchReports();
                setIsModalOpen(false);
                setCurrentEditId(null);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update report status');
        }
    };

    const openModal = (reportId) => {
        setCurrentEditId(reportId);
        setModalStatus('reviewed');
        setModalNotes('');
        setIsModalOpen(true);
    };

    const stats = {
        received: reports.length,
        verified: reports.filter(r => r.status === 'resolved').length,
        pending: reports.filter(r => r.status === 'pending').length
    };

    return (
        <>
            <Head title="Dashboard" />

            <style>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto;
                    background: #f5f7fa;
                    color: #333;
                }

                .dashboard-container {
                    display: flex;
                    min-height: 100vh;
                }

                .header {
                    background: #000;
                    color: white;
                    padding: 16px 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 100;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .header-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 700;
                    font-size: 18px;
                }

                .header-brand .brand-utm {
                    color: #ff6b35;
                }

                .header-brand .brand-system {
                    color: #ffa500;
                }

                .header-brand .subtitle {
                    font-size: 11px;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .header-user {
                    background: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #000;
                    font-size: 20px;
                    cursor: pointer;
                }

                .sidebar {
                    width: 240px;
                    background: white;
                    border-right: 1px solid #e0e0e0;
                    padding: 80px 0 20px;
                    position: fixed;
                    height: 100vh;
                    overflow-y: auto;
                }

                .sidebar-menu {
                    list-style: none;
                }

                .sidebar-menu li {
                    margin: 0;
                }

                .sidebar-menu a {
                    display: block;
                    padding: 12px 24px;
                    color: #666;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-weight: 500;
                }

                .sidebar-menu a:hover {
                    background: #f5f7fa;
                    color: #333;
                }

                .sidebar-menu a.active {
                    background: #dfe8f5;
                    color: #0066cc;
                    border-left: 4px solid #0066cc;
                    padding-left: 20px;
                }

                .main {
                    margin-left: 240px;
                    margin-top: 64px;
                    flex: 1;
                    padding: 24px;
                }

                .page-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0066cc;
                    margin-bottom: 24px;
                }

                .stats-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .stat-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                .stat-icon {
                    font-size: 40px;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stat-content h3 {
                    font-size: 14px;
                    color: #666;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #333;
                }

                .search-section {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 24px;
                    align-items: center;
                }

                .search-box {
                    flex: 1;
                    max-width: 400px;
                }

                .search-box input {
                    width: 100%;
                    padding: 10px 16px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .view-btn {
                    background: white;
                    border: 1px solid #ddd;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #666;
                }

                .main-layout {
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 20px;
                    margin-top: 20px;
                }

                .table-container {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th {
                    background: #f9f9f9;
                    padding: 16px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 13px;
                    color: #333;
                    border-bottom: 1px solid #e0e0e0;
                }

                td {
                    padding: 14px 16px;
                    border-bottom: 1px solid #f0f0f0;
                    font-size: 13px;
                    color: #666;
                }

                tr:hover {
                    background: #fafafa;
                }

                tr.selected {
                    background: #f0f8ff !important;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .status-received {
                    background: #d1ecf1;
                    color: #0c5460;
                }

                .status-processed {
                    background: #fff3cd;
                    color: #856404;
                }

                .status-verified {
                    background: #d4edda;
                    color: #155724;
                }

                .photo-preview-panel {
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    position: sticky;
                    top: 100px;
                    height: fit-content;
                }

                .photo-preview-title {
                    font-weight: 700;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .photo-preview-container {
                    border-radius: 8px;
                    background: #f0f0f0;
                    min-height: 280px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #999;
                    font-size: 12px;
                    margin-bottom: 12px;
                    overflow: hidden;
                }

                .photo-preview-container img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .photo-info {
                    font-size: 12px;
                    color: #666;
                }

                .btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    width: 100%;
                    margin-top: 12px;
                }

                .btn-primary {
                    background: #0066cc;
                    color: white;
                }

                .btn-primary:hover {
                    background: #0052a3;
                }

                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
                }

                .modal.show {
                    display: flex;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    padding: 32px;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                }

                .modal-title {
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    color: #333;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .form-group label {
                    display: block;
                    font-weight: 600;
                    font-size: 13px;
                    margin-bottom: 6px;
                    color: #333;
                }

                .form-group input,
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 13px;
                    font-family: inherit;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                }

                .btn-secondary {
                    background: #f0f0f0;
                    color: #333;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-secondary:hover {
                    background: #e0e0e0;
                }

                .action-btn {
                    background: none;
                    border: none;
                    color: #0066cc;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 4px;
                }

                .info-box {
                    margin-top: 8px;
                    padding: 8px;
                    background: #fff3cd;
                    border-radius: 4px;
                    font-size: 11px;
                }
            `}</style>

            <div className="dashboard-container">
                {/* Header */}
                <div className="header">
                    <div className="header-brand">
                        <img src="/logo.png" alt="UTM Logo" style={{ height: '60px', width: 'auto' }} />
                    </div>
                    <div className="header-user">👤</div>
                </div>

                {/* Sidebar */}
                <div className="sidebar">
                    <ul className="sidebar-menu">
                        <li><a href="#" className={activePage === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActivePage('dashboard'); }}>Dashboard</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()}>Review Reports</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()}>Report History</a></li>
                        <li style={{ marginTop: '32px' }}><a href="#" onClick={(e) => e.preventDefault()}>Statistics</a></li>
                        <li><a href="#" onClick={(e) => e.preventDefault()}>Settings</a></li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="main">
                    <div className="page-title">Mobile Photo Reports - Transmitted Data</div>

                    {/* Stats Row */}
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Photos Received</h3>
                                <div className="stat-value">{stats.received}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Verified</h3>
                                <div className="stat-value">{stats.verified}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-content">
                                <h3>Awaiting Review</h3>
                                <div className="stat-value">{stats.pending}</div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="search-section">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search email, location or type"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="view-btn">📊 Export Report</button>
                    </div>

                    {/* Main Layout: Table + Photo Preview */}
                    <div className="main-layout">
                        {/* Left: Table */}
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Report ID</th>
                                        <th>User Email</th>
                                        <th>Location</th>
                                        <th>Report Date</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>Loading reports...</td>
                                        </tr>
                                    ) : filteredReports.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No reports found</td>
                                        </tr>
                                    ) : (
                                        filteredReports.map((report, index) => (
                                            <tr
                                                key={report.id}
                                                className={selectedReport?.id === report.id ? 'selected' : ''}
                                                onClick={() => handleRowClick(report)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <td>{index + 1}</td>
                                                <td>#{report.id}</td>
                                                <td><strong>{report.user_email}</strong></td>
                                                <td>{report.location || 'N/A'}</td>
                                                <td>{new Date(report.created_at).toLocaleString()}</td>
                                                <td>{report.type === 'traffic' ? 'Traffic Incident' : 'Suspicious Activity'}</td>
                                                <td>
                                                    <span className={`status-badge ${getStatusClass(report.status)}`}>
                                                        <span>{getStatusIcon(report.status)}</span>
                                                        {getStatusLabel(report.status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="action-btn"
                                                        onClick={(e) => { e.stopPropagation(); openModal(report.id); }}
                                                        title="Update Status"
                                                    >
                                                        ⚙️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Right: Photo Preview Panel */}
                        <div className="photo-preview-panel">
                            <div className="photo-preview-title">Photo Preview</div>
                            <div className="photo-preview-container">
                                {selectedReport ? (
                                    <img src={selectedReport.image_url} alt="Report" />
                                ) : (
                                    'Click a row to view photos'
                                )}
                            </div>
                            {selectedReport && (
                                <div className="photo-info">
                                    <div style={{ marginBottom: '8px' }}><strong>{selectedReport.user_email}</strong></div>
                                    <div style={{ marginBottom: '4px', color: '#999', fontSize: '11px' }}>{selectedReport.location || 'N/A'}</div>
                                    <div style={{ marginBottom: '4px', color: '#999', fontSize: '11px' }}>{new Date(selectedReport.created_at).toLocaleString()}</div>
                                    <div className="info-box">
                                        <strong>{selectedReport.type === 'traffic' ? 'Traffic Incident' : 'Suspicious Activity'}</strong><br />
                                        {selectedReport.description || 'No description provided'}
                                    </div>
                                    <a href={selectedReport.image_url} download className="btn btn-primary">
                                        Download Photo
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={`modal ${isModalOpen ? 'show' : ''}`}>
                    <div className="modal-content">
                        <div className="modal-title">Process Photo Report</div>

                        <div className="form-group">
                            <label>Report ID</label>
                            <input type="text" value={`#${currentEditId}`} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Photo Processing Status</label>
                            <select value={modalStatus} onChange={(e) => setModalStatus(e.target.value)}>
                                <option value="pending">Just Received</option>
                                <option value="reviewed">Processing</option>
                                <option value="resolved">Verified</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Processing Notes</label>
                            <textarea
                                value={modalNotes}
                                onChange={(e) => setModalNotes(e.target.value)}
                                placeholder="Add processing notes..."
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleUpdateStatus}>Update Status</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
