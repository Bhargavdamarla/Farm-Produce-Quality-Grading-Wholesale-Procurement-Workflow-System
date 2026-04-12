import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { getAllInspections } from '../services/inspectionService';
import { getAllProduce } from '../services/produceService';
import { getAllOrders } from '../services/procurementService';
import '../styles.css';

const AdminDashboard = () => {
  const [produces, setProduces] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [producesData, inspectionsData, ordersData] = await Promise.all([
        getAllProduce().catch(() => []),
        getAllInspections().catch(() => []),
        getAllOrders().catch(() => []),
      ]);
      setProduces(producesData || []);
      setInspections(inspectionsData || []);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      SUBMITTED: '📤',
      UNDER_INSPECTION: '🔍',
      GRADED: '✅',
      REJECTED: '❌',
      ASSIGNED: '📋',
      INSPECTED: '🔍',
      APPROVED: '✔️',
      COMPLETED: '✅',
      CREATED: '📝',
      CANCELLED: '❌',
    };
    return icons[status] || '❓';
  };

  const stats = {
    totalProduces: produces.length,
    submittedProduces: produces.filter(p => p.produceStatus === 'SUBMITTED').length,
    gradedProduces: produces.filter(p => p.produceStatus === 'GRADED').length,
    rejectedProduces: produces.filter(p => p.produceStatus === 'REJECTED').length,
    totalInspections: inspections.length,
    approvedInspections: inspections.filter(i => i.inspectionStatus === 'APPROVED').length,
    rejectedInspections: inspections.filter(i => i.inspectionStatus === 'REJECTED').length,
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.orderStatus === 'COMPLETED').length,
    totalProcuredValue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar userRole="ADMIN" />
        <div className="main-content">
          <div className="header-section">
            <h1>⚙️ Admin Dashboard</h1>
            <p>System monitoring and analytics</p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-sections">
              {/* Key Metrics */}
              <section className="section-card metrics-section">
                <h2>📊 Key Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon">🌾</div>
                    <div className="metric-content">
                      <h3>Total Produces</h3>
                      <p className="metric-value">{stats.totalProduces}</p>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">✅</div>
                    <div className="metric-content">
                      <h3>Graded</h3>
                      <p className="metric-value">{stats.gradedProduces}</p>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">❌</div>
                    <div className="metric-content">
                      <h3>Rejected</h3>
                      <p className="metric-value">{stats.rejectedProduces}</p>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🔍</div>
                    <div className="metric-content">
                      <h3>Inspections</h3>
                      <p className="metric-value">{stats.totalInspections}</p>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">🛒</div>
                    <div className="metric-content">
                      <h3>Orders</h3>
                      <p className="metric-value">{stats.totalOrders}</p>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon">💰</div>
                    <div className="metric-content">
                      <h3>Total Value</h3>
                      <p className="metric-value">₹ {stats.totalProcuredValue.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Network Diagram */}
              <section className="section-card">
                <h2>🔄 Workflow Status</h2>
                <div className="workflow-diagram">
                  <div className="workflow-step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Produce Submission</h4>
                      <p>{stats.submittedProduces} Submitted</p>
                    </div>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Quality Inspection</h4>
                      <p>{stats.approvedInspections} Approved</p>
                    </div>
                  </div>
                  <div className="workflow-arrow">→</div>
                  <div className="workflow-step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Procurement Order</h4>
                      <p>{stats.completedOrders} Completed</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent Activities */}
              <section className="section-card">
                <h2>📋 Recent Productions</h2>
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : produces.length > 0 ? (
                  <div className="activity-list">
                    {produces.slice(0, 10).map((produce) => (
                      <div key={produce.id} className="activity-item">
                        <span className="activity-icon">{getStatusIcon(produce.produceStatus)}</span>
                        <div className="activity-content">
                          <h4>{produce.categoryName}</h4>
                          <p>{produce.quantity} {produce.unitType} • {produce.produceStatus}</p>
                          <small>{new Date(produce.createdAt).toLocaleDateString()}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No produce data available</p>
                )}
              </section>
            </div>
          )}

          {/* Produce Tab */}
          {activeTab === 'produce' && (
            <section className="section-card">
              <h2>🌾 All Produces</h2>
              {produces.length > 0 ? (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Status</th>
                        <th>Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {produces.map((p) => (
                        <tr key={p.id}>
                          <td>{p.categoryName}</td>
                          <td>{p.quantity}</td>
                          <td>{p.unitType}</td>
                          <td><span className="status-badge">{getStatusIcon(p.produceStatus)} {p.produceStatus}</span></td>
                          <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No produce data</p>
              )}
            </section>
          )}

          {/* Inspection Tab */}
          {activeTab === 'inspection' && (
            <section className="section-card">
              <h2>🔍 All Inspections</h2>
              {inspections.length > 0 ? (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produce</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspections.map((i) => (
                        <tr key={i.id}>
                          <td>{i.produceCategory}</td>
                          <td>{i.qualityScore}</td>
                          <td>{i.assignedGrade}</td>
                          <td><span className="status-badge">{getStatusIcon(i.inspectionStatus)} {i.inspectionStatus}</span></td>
                          <td>{new Date(i.inspectionDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No inspection data</p>
              )}
            </section>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <section className="section-card">
              <h2>🛒 All Orders</h2>
              {orders.length > 0 ? (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produce</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td>{o.categoryName}</td>
                          <td>{o.procurementQuantity} {o.unitType}</td>
                          <td>₹ {parseFloat(o.totalAmount).toFixed(2)}</td>
                          <td><span className="status-badge">{getStatusIcon(o.orderStatus)} {o.orderStatus}</span></td>
                          <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No order data</p>
              )}
            </section>
          )}

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'produce' ? 'active' : ''}`}
              onClick={() => setActiveTab('produce')}
            >
              🌾 Produces
            </button>
            <button
              className={`tab-btn ${activeTab === 'inspection' ? 'active' : ''}`}
              onClick={() => setActiveTab('inspection')}
            >
              🔍 Inspections
            </button>
            <button
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              🛒 Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
