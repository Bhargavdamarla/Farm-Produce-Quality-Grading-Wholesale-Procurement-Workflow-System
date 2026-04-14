import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import API from '../api/api';
import { getAllInspections } from '../services/inspectionService';
import { getAllOrders } from '../services/procurementService';
import { getAllProduce } from '../services/produceService';
import '../styles.css';

const AdminDashboard = () => {
  const [produces, setProduces] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('produce');

  const syncTabWithHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['produce', 'inspection', 'procurement', 'inventory'];

    if (validTabs.includes(hash)) {
      setActiveTab(hash);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    syncTabWithHash();
    window.addEventListener('hashchange', syncTabWithHash);

    return () => {
      window.removeEventListener('hashchange', syncTabWithHash);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [producesData, inspectionsData, ordersData, inventoryData] = await Promise.all([
        getAllProduce().catch(() => []),
        getAllInspections().catch(() => []),
        getAllOrders().catch(() => []),
        API.get('/inventory').then((response) => response.data).catch(() => []),
      ]);

      setProduces(producesData || []);
      setInspections(inspectionsData || []);
      setOrders(ordersData || []);
      setInventory(inventoryData || []);
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(2)}`;
  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'N/A');
  const deriveGrade = (score) => {
    const numericScore = Number(score || 0);
    if (numericScore >= 85) return 'Grade A';
    if (numericScore >= 60) return 'Grade B';
    return 'Grade C';
  };

  const produceStats = {
    total: produces.length,
    pending: produces.filter((produce) => produce.status === 'PENDING_INSPECTION').length,
    accepted: produces.filter((produce) => produce.status === 'ACCEPTED').length,
    rejected: produces.filter((produce) => produce.status === 'REJECTED').length,
    procured: produces.filter((produce) => produce.status === 'PROCURED').length,
  };

  const inspectionStats = {
    total: inspections.length,
    accepted: inspections.filter((inspection) => inspection.produce?.status === 'ACCEPTED').length,
    rejected: inspections.filter((inspection) => inspection.produce?.status === 'REJECTED').length,
    inspected: inspections.filter((inspection) => inspection.status === 'INSPECTED').length,
  };

  const procurementStats = {
    total: orders.length,
    pending: orders.filter((order) => order.status === 'PENDING').length,
    completed: orders.filter((order) => order.status === 'COMPLETED').length,
    quantity: orders.reduce((sum, order) => sum + Number(order.quantity || 0), 0),
    value: orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar userRole="ADMIN" />
        <div className="main-content">
          <div className="header-section">
            <h1>Admin Dashboard</h1>
            <p>Track produce flow, inspection outcomes, procurement analytics, and warehouse inventory.</p>
          </div>

          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'produce' ? 'active' : ''}`}
              onClick={() => handleTabChange('produce')}
            >
              Produce Tracking Table
            </button>
            <button
              className={`tab-btn ${activeTab === 'inspection' ? 'active' : ''}`}
              onClick={() => handleTabChange('inspection')}
            >
              Inspection Status Dashboard
            </button>
            <button
              className={`tab-btn ${activeTab === 'procurement' ? 'active' : ''}`}
              onClick={() => handleTabChange('procurement')}
            >
              Procurement Analytics
            </button>
            <button
              className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => handleTabChange('inventory')}
            >
              Inventory Monitoring Panel
            </button>
          </div>

          {activeTab === 'produce' && (
            <div className="dashboard-sections">
              <section className="section-card stats-section">
                <h2>Produce Tracking Summary</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{produceStats.total}</div>
                    <div className="stat-label">Total Lots</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{produceStats.pending}</div>
                    <div className="stat-label">Pending Inspection</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{produceStats.accepted}</div>
                    <div className="stat-label">Accepted</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{produceStats.procured}</div>
                    <div className="stat-label">Procured</div>
                  </div>
                </div>
              </section>

              <section className="section-card">
                <h2>Produce Tracking Table</h2>
                {loading ? (
                  <div className="loading">Loading produce records...</div>
                ) : produces.length > 0 ? (
                  <div className="data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Farmer</th>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Status</th>
                          <th>Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {produces.map((produce) => (
                          <tr key={produce.id}>
                            <td>#{produce.id}</td>
                            <td>{produce.farmer?.name || 'Unknown'}</td>
                            <td>{produce.category?.name || 'Unknown'}</td>
                            <td>{Number(produce.quantity || 0).toFixed(2)} KG</td>
                            <td><span className="status-badge">{produce.status}</span></td>
                            <td>{formatDate(produce.submissionDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No produce records available.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'inspection' && (
            <div className="dashboard-sections">
              <section className="section-card stats-section">
                <h2>Inspection Status Dashboard</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{inspectionStats.total}</div>
                    <div className="stat-label">Inspections Logged</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{inspectionStats.inspected}</div>
                    <div className="stat-label">Inspected</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{inspectionStats.accepted}</div>
                    <div className="stat-label">Accepted Outcomes</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{inspectionStats.rejected}</div>
                    <div className="stat-label">Rejected Outcomes</div>
                  </div>
                </div>
              </section>

              <section className="section-card">
                <h2>Inspection Status Dashboard</h2>
                {loading ? (
                  <div className="loading">Loading inspection records...</div>
                ) : inspections.length > 0 ? (
                  <div className="data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Produce</th>
                          <th>Inspector</th>
                          <th>Score</th>
                          <th>Derived Grade</th>
                          <th>Result</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inspections.map((inspection) => (
                          <tr key={inspection.id}>
                            <td>#{inspection.id}</td>
                            <td>{inspection.produce?.category?.name || 'Unknown'}</td>
                            <td>{inspection.inspector?.name || 'Unknown'}</td>
                            <td>{Number(inspection.qualityScore || 0).toFixed(0)}/100</td>
                            <td>
                              <span
                                className={`grade-badge ${
                                  Number(inspection.qualityScore || 0) >= 85
                                    ? 'grade-a'
                                    : Number(inspection.qualityScore || 0) >= 60
                                      ? 'grade-b'
                                      : 'grade-c'
                                }`}
                              >
                                {deriveGrade(inspection.qualityScore)}
                              </span>
                            </td>
                            <td>
                              <span className="status-badge">
                                {inspection.produce?.status || inspection.status}
                              </span>
                            </td>
                            <td>{formatDate(inspection.inspectionDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No inspection records available.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'procurement' && (
            <div className="dashboard-sections">
              <section className="section-card stats-section">
                <h2>Procurement Analytics</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{procurementStats.total}</div>
                    <div className="stat-label">Orders Raised</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{procurementStats.pending}</div>
                    <div className="stat-label">Pending Orders</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{procurementStats.quantity.toFixed(2)}</div>
                    <div className="stat-label">Quantity Procured</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{formatCurrency(procurementStats.value)}</div>
                    <div className="stat-label">Procurement Value</div>
                  </div>
                </div>
              </section>

              <section className="section-card">
                <h2>Procurement Analytics</h2>
                {loading ? (
                  <div className="loading">Loading procurement data...</div>
                ) : orders.length > 0 ? (
                  <div className="data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Produce</th>
                          <th>Officer</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.produce?.category?.name || 'Unknown'}</td>
                            <td>{order.officer?.name || 'Unknown'}</td>
                            <td>{Number(order.quantity || 0).toFixed(2)} KG</td>
                            <td>{formatCurrency(order.unitPrice)}</td>
                            <td>{formatCurrency(order.totalAmount)}</td>
                            <td><span className="status-badge">{order.status}</span></td>
                            <td>{formatDate(order.orderDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No procurement orders available.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="dashboard-sections">
              <section className="section-card stats-section">
                <h2>Inventory Monitoring Panel</h2>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{inventory.length}</div>
                    <div className="stat-label">Inventory Categories</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {inventory.reduce((sum, item) => sum + Number(item.totalQuantity || 0), 0).toFixed(2)}
                    </div>
                    <div className="stat-label">Total Stored Quantity</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{produceStats.procured}</div>
                    <div className="stat-label">Procured Produce Lots</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">{procurementStats.completed}</div>
                    <div className="stat-label">Completed Orders</div>
                  </div>
                </div>
              </section>

              <section className="section-card">
                <h2>Inventory Monitoring Panel</h2>
                {loading ? (
                  <div className="loading">Loading inventory...</div>
                ) : inventory.length > 0 ? (
                  <div className="data-table">
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Total Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.map((item) => (
                          <tr key={item.id}>
                            <td>#{item.id}</td>
                            <td>{item.category?.name || 'Unknown'}</td>
                            <td>{Number(item.totalQuantity || 0).toFixed(2)} KG</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No inventory records yet. Inventory fills as procurement orders are created.</p>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
