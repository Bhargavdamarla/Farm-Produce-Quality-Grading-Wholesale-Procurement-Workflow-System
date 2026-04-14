import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ProduceForm from '../forms/ProduceForm.jsx';
import { getFarmerProduce } from '../services/produceService';
import '../styles.css';

const FarmerDashboard = () => {
  const [produces, setProduces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  // Get real logged-in user from localStorage
  const authData = JSON.parse(localStorage.getItem('authData') || '{}');
  const farmerId = authData.id;

  useEffect(() => {
    fetchProduces();
  }, []);

  const fetchProduces = async () => {
    setLoading(true);
    try {
      const data = await getFarmerProduce(farmerId);
      setProduces(data || []);
    } catch (error) {
      console.error('Failed to fetch produces:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING_INSPECTION: '#FFA500',
      ACCEPTED: '#27AE60',
      REJECTED: '#E74C3C',
      PROCURED: '#3498DB',
    };
    return colors[status] || '#95A5A6';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING_INSPECTION: '🔍',
      ACCEPTED: '✅',
      REJECTED: '❌',
      PROCURED: '🛒',
    };
    return icons[status] || '📦';
  };

  const filteredProduces = filter === 'ALL' 
    ? produces 
    : produces.filter(p => p.status === filter);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar userRole="FARMER" />
        <div className="main-content">
          <div className="header-section">
            <h1>👨‍🌾 Farmer Dashboard</h1>
            <p>Submit and track your farm produce</p>
          </div>

          <div className="dashboard-sections">
            {/* Produce Submission Form */}
            <section className="section-card">
              <ProduceForm onProduceAdded={fetchProduces} />
            </section>

            {/* Produces List */}
            <section className="section-card">
              <h2>📦 My Produces</h2>
              
              <div className="filter-section">
                <label>Filter by Status:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="ALL">All Status</option>
                  <option value="PENDING_INSPECTION">Pending Inspection</option>
                  <option value="ACCEPTED">Accepted / Graded</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="PROCURED">Procured</option>
                </select>
              </div>

              {loading ? (
                <div className="loading">Loading produces...</div>
              ) : filteredProduces.length > 0 ? (
                <div className="produces-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Quantity (KG)</th>
                        <th>Status</th>
                        <th>Submission Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProduces.map((produce) => (
                        <tr key={produce.id}>
                          <td className="category">{produce.category ? produce.category.name : 'Unknown'}</td>
                          <td>{produce.quantity}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(produce.status) }}
                            >
                              {getStatusIcon(produce.status)} {(produce.status || 'UNKNOWN').replace('_', ' ')}
                            </span>
                          </td>
                          <td>{produce.submissionDate ? new Date(produce.submissionDate).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No produces submitted yet</p>
                  <p className="hint">Fill the form above to submit your first produce</p>
                </div>
              )}
            </section>

            {/* Stats Card */}
            <section className="section-card stats-section">
              <h2>📊 Quick Stats</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{produces.length}</div>
                  <div className="stat-label">Total Submissions</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{produces.filter(p => p.status === 'ACCEPTED').length}</div>
                  <div className="stat-label">Accepted</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{produces.filter(p => p.status === 'PENDING_INSPECTION').length}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{produces.filter(p => p.status === 'REJECTED').length}</div>
                  <div className="stat-label">Rejected</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
