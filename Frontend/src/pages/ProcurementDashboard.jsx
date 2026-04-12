import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ProcurementForm from '../forms/ProcurementForm.jsx';
import { getAllOrders } from '../services/procurementService';
import '../styles.css';

const ProcurementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CREATED: '#3498DB',
      APPROVED: '#2E86C1',
      COMPLETED: '#27AE60',
      CANCELLED: '#E74C3C',
    };
    return colors[status] || '#95A5A6';
  };

  const getStatusIcon = (status) => {
    const icons = {
      CREATED: '📝',
      APPROVED: '✔️',
      COMPLETED: '✅',
      CANCELLED: '❌',
    };
    return icons[status] || '❓';
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.orderStatus === filter);

  const totalProcuredValue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const totalQuantityOrdered = filteredOrders.reduce((sum, order) => sum + (order.procurementQuantity || 0), 0);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar userRole="PROCUREMENT_OFFICER" />
        <div className="main-content">
          <div className="header-section">
            <h1>🛒 Procurement Officer Dashboard</h1>
            <p>Create and manage wholesale procurement orders</p>
          </div>

          <div className="dashboard-sections">
            {/* Procurement Form */}
            <section className="section-card">
              <ProcurementForm onProcurementAdded={fetchOrders} />
            </section>

            {/* Orders Management */}
            <section className="section-card">
              <h2>📦 Procurement Orders</h2>
              
              <div className="filter-section">
                <label>Filter by Status:</label>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="ALL">All Orders</option>
                  <option value="CREATED">Created</option>
                  <option value="APPROVED">Approved</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {loading ? (
                <div className="loading">Loading orders...</div>
              ) : filteredOrders.length > 0 ? (
                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produce</th>
                        <th>Grade</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Order Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="produce-name">{order.categoryName}</td>
                          <td>
                            <span className={`grade-badge grade-${order.grade?.toLowerCase()}`}>
                              {order.grade}
                            </span>
                          </td>
                          <td>{order.procurementQuantity} {order.unitType}</td>
                          <td>₹ {parseFloat(order.unitPrice).toFixed(2)}</td>
                          <td className="amount">₹ {parseFloat(order.totalAmount).toFixed(2)}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                            >
                              {getStatusIcon(order.orderStatus)} {order.orderStatus}
                            </span>
                          </td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No orders found</p>
                  <p className="hint">Create your first procurement order using the form above</p>
                </div>
              )}
            </section>

            {/* Summary Stats */}
            <section className="section-card stats-section">
              <h2>📊 Procurement Summary</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{filteredOrders.length}</div>
                  <div className="stat-label">Total Orders</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{orders.filter(o => o.orderStatus === 'COMPLETED').length}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{totalQuantityOrdered.toFixed(2)}</div>
                  <div className="stat-label">Total Qty Ordered</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">₹ {totalProcuredValue.toFixed(0)}</div>
                  <div className="stat-label">Total Value</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementDashboard;
