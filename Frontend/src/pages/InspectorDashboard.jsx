import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import InspectionForm from '../forms/InspectionForm.jsx';
import { getAllInspections } from '../services/inspectionService';
import '../styles.css';

const InspectorDashboard = () => {
  const [inspections, setInspections] = useState([]);
  const [pendingInspections, setPendingInspections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    setLoading(true);
    try {
      const data = await getAllInspections();
      const pending = data.filter(i => i.inspectionStatus === 'ASSIGNED' || i.inspectionStatus === 'INSPECTED');
      setPendingInspections(pending);
      setInspections(data);
    } catch (error) {
      console.error('Failed to fetch inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'Grade A': '#27AE60',
      'Grade B': '#F39C12',
      'Grade C': '#E74C3C',
    };
    return colors[grade] || '#95A5A6';
  };

  const getStatusIcon = (status) => {
    const icons = {
      ASSIGNED: '📋',
      INSPECTED: '🔍',
      APPROVED: '✅',
      REJECTED: '❌',
    };
    return icons[status] || '❓';
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar userRole="QUALITY_INSPECTOR" />
        <div className="main-content">
          <div className="header-section">
            <h1>🔍 Quality Inspector Dashboard</h1>
            <p>Inspect produce and assign quality grades</p>
          </div>

          <div className="dashboard-sections">
            {/* Inspection Form */}
            <section className="section-card">
              <InspectionForm onInspectionAdded={fetchInspections} />
            </section>

            {/* Pending Inspections */}
            <section className="section-card">
              <h2>📋 Pending Inspections ({pendingInspections.length})</h2>
              
              {loading ? (
                <div className="loading">Loading inspections...</div>
              ) : pendingInspections.length > 0 ? (
                <div className="inspections-list">
                  {pendingInspections.map((inspection) => (
                    <div key={inspection.id} className="inspection-card">
                      <div className="card-header">
                        <h4>{inspection.produceCategory}</h4>
                        <span className="status-badge">
                          {getStatusIcon(inspection.inspectionStatus)} {inspection.inspectionStatus}
                        </span>
                      </div>
                      <div className="card-body">
                        <p><strong>Quantity:</strong> {inspection.quantity} {inspection.unitType}</p>
                        <p><strong>Submitted:</strong> {new Date(inspection.submittedDate).toLocaleDateString()}</p>
                        {inspection.qualityScore && (
                          <p><strong>Score:</strong> {inspection.qualityScore}/100</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No pending inspections</p>
                </div>
              )}
            </section>

            {/* Inspection History */}
            <section className="section-card">
              <h2>✅ Completed Inspections ({inspections.filter(i => i.inspectionStatus === 'APPROVED' || i.inspectionStatus === 'REJECTED').length})</h2>
              
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="inspections-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Produce</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Status</th>
                        <th>Inspection Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspections
                        .filter(i => i.inspectionStatus === 'APPROVED' || i.inspectionStatus === 'REJECTED')
                        .map((inspection) => (
                          <tr key={inspection.id}>
                            <td>{inspection.produceCategory}</td>
                            <td className="score">{inspection.qualityScore}/100</td>
                            <td>
                              <span
                                className="grade-badge"
                                style={{ backgroundColor: getGradeColor(inspection.assignedGrade) }}
                              >
                                {inspection.assignedGrade}
                              </span>
                            </td>
                            <td>
                              <span className="status-badge">
                                {getStatusIcon(inspection.inspectionStatus)} {inspection.inspectionStatus}
                              </span>
                            </td>
                            <td>{new Date(inspection.inspectionDate).toLocaleDateString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Stats */}
            <section className="section-card stats-section">
              <h2>📊 Inspection Stats</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{pendingInspections.length}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{inspections.filter(i => i.inspectionStatus === 'APPROVED').length}</div>
                  <div className="stat-label">Approved</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{inspections.filter(i => i.inspectionStatus === 'REJECTED').length}</div>
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

export default InspectorDashboard;
