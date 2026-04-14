import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import ProcurementForm from '../forms/ProcurementForm.jsx';
import { getAllOrders, getGradedProduces } from '../services/procurementService';
import '../styles.css';

const ProcurementDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [availableProduce, setAvailableProduce] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersData, acceptedProduce] = await Promise.all([
        getAllOrders(),
        getGradedProduces(),
      ]);

      setOrders(ordersData || []);
      setAvailableProduce(acceptedProduce || []);
    } catch (error) {
      console.error('Failed to fetch procurement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f59e0b',
      APPROVED: '#2563eb',
      COMPLETED: '#16a34a',
      CANCELLED: '#dc2626',
    };

    return colors[status] || '#64748b';
  };

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter((order) => order.status === filter);

  const totalValue = filteredOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const totalQuantity = filteredOrders.reduce((sum, order) => sum + Number(order.quantity || 0), 0);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar userRole="PROCUREMENT_OFFICER" />
        <div className="main-content">
          <div id="dashboard" className="header-section">
            <h1>Procurement Officer Dashboard</h1>
            <p>Manage accepted produce, raise procurement orders, and track buying activity.</p>
          </div>

          <div className="dashboard-sections">
            <section id="order" className="section-card">
              <ProcurementForm onProcurementAdded={fetchDashboardData} />
            </section>

            <section id="graded" className="section-card">
              <h2>Available Accepted Produce</h2>
              {loading ? (
                <div className="loading">Loading accepted produce...</div>
              ) : availableProduce.length > 0 ? (
                <div className="data-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produce ID</th>
                        <th>Category</th>
                        <th>Farmer</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableProduce.map((produce) => (
                        <tr key={produce.id}>
                          <td>#{produce.id}</td>
                          <td>{produce.category?.name || 'Unknown'}</td>
                          <td>{produce.farmer?.name || 'Unknown'}</td>
                          <td>{Number(produce.quantity || 0).toFixed(2)} KG</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(produce.status) }}
                            >
                              {produce.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No accepted produce is ready for procurement.</p>
                </div>
              )}
            </section>

            <section id="orders" className="section-card">
              <h2>Procurement History</h2>
              <div className="filter-section">
                <label>Filter by Status:</label>
                <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                  <option value="ALL">All Orders</option>
                  <option value="PENDING">Pending</option>
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
                        <th>Order ID</th>
                        <th>Produce</th>
                        <th>Officer</th>
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
                          <td>#{order.id}</td>
                          <td>{order.produce?.category?.name || 'Unknown'}</td>
                          <td>{order.officer?.name || 'Unknown'}</td>
                          <td>{Number(order.quantity || 0).toFixed(2)} KG</td>
                          <td>{formatCurrency(order.unitPrice)}</td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No procurement orders found.</p>
                </div>
              )}
            </section>

            <section className="section-card stats-section">
              <h2>Procurement Analytics</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{filteredOrders.length}</div>
                  <div className="stat-label">Orders</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{availableProduce.length}</div>
                  <div className="stat-label">Accepted Produce Lots</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{totalQuantity.toFixed(2)}</div>
                  <div className="stat-label">Total Quantity Procured</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{formatCurrency(totalValue)}</div>
                  <div className="stat-label">Procurement Value</div>
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
