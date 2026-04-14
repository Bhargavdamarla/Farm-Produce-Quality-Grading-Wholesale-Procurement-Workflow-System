import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import InspectionForm from '../forms/InspectionForm.jsx';
import { getAllInspections } from '../services/inspectionService';
import { getPendingProduce } from '../services/produceService';
import '../styles.css';

const InspectorDashboard = () => {
  const [inspections, setInspections] = useState([]);
  const [pendingProduce, setPendingProduce] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInspectionData();
  }, []);

  const fetchInspectionData = async () => {
    setLoading(true);
    try {
      const [pendingData, inspectionsData] = await Promise.all([
        getPendingProduce(),
        getAllInspections(),
      ]);

      setPendingProduce(pendingData || []);
      setInspections(inspectionsData || []);
    } catch (error) {
      console.error('Failed to fetch inspection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deriveGrade = (score) => {
    const numericScore = Number(score || 0);
    if (numericScore >= 85) return 'Grade A';
    if (numericScore >= 60) return 'Grade B';
    return 'Grade C';
  };

  const deriveDecision = (inspection) => inspection.produce?.status || inspection.status || 'PENDING_INSPECTION';

  const completedInspections = inspections.filter(
    (inspection) => inspection.produce?.status === 'ACCEPTED' || inspection.produce?.status === 'REJECTED'
  );

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar userRole="QUALITY_INSPECTOR" />
        <div className="main-content">
          <div id="dashboard" className="header-section">
            <h1>Quality Inspector Dashboard</h1>
            <p>Work through the pending inspection pool and submit grades with valid produce IDs.</p>
          </div>

          <div className="dashboard-sections">
            <section id="inspect" className="section-card">
              <InspectionForm onInspectionAdded={fetchInspectionData} />
            </section>

            <section id="pending" className="section-card">
              <h2>Assigned Inspection List</h2>
              {loading ? (
                <div className="loading">Loading pending produce...</div>
              ) : pendingProduce.length > 0 ? (
                <div className="inspections-list">
                  {pendingProduce.map((produce) => (
                    <div key={produce.id} className="inspection-card">
                      <div className="card-header">
                        <h4>
                          Produce #{produce.id} - {produce.category?.name || 'Unknown'}
                        </h4>
                        <span className="status-badge" style={{ backgroundColor: '#f59e0b' }}>
                          PENDING_INSPECTION
                        </span>
                      </div>
                      <div className="card-body">
                        <p><strong>Farmer:</strong> {produce.farmer?.name || 'Unknown'}</p>
                        <p><strong>Quantity:</strong> {Number(produce.quantity || 0).toFixed(2)} KG</p>
                        <p>
                          <strong>Submitted:</strong>{' '}
                          {produce.submissionDate
                            ? new Date(produce.submissionDate).toLocaleString()
                            : 'N/A'}
                        </p>
                        <p><strong>Action:</strong> Use produce ID #{produce.id} in the grade form.</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No pending inspections in the pool.</p>
                </div>
              )}
            </section>

            <section id="history" className="section-card">
              <h2>Inspection History</h2>
              {loading ? (
                <div className="loading">Loading inspection history...</div>
              ) : completedInspections.length > 0 ? (
                <div className="inspections-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Inspection ID</th>
                        <th>Produce</th>
                        <th>Inspector</th>
                        <th>Score</th>
                        <th>Derived Grade</th>
                        <th>Decision</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedInspections.map((inspection) => (
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
                            <span className="status-badge">{deriveDecision(inspection)}</span>
                          </td>
                          <td>
                            {inspection.inspectionDate
                              ? new Date(inspection.inspectionDate).toLocaleDateString()
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No completed inspections yet.</p>
                </div>
              )}
            </section>

            <section className="section-card stats-section">
              <h2>Inspection Status Dashboard</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{pendingProduce.length}</div>
                  <div className="stat-label">Pending Pool</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">
                    {completedInspections.filter((inspection) => inspection.produce?.status === 'ACCEPTED').length}
                  </div>
                  <div className="stat-label">Accepted Lots</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">
                    {completedInspections.filter((inspection) => inspection.produce?.status === 'REJECTED').length}
                  </div>
                  <div className="stat-label">Rejected Lots</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{completedInspections.length}</div>
                  <div className="stat-label">Inspections Completed</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectorDashboard;
