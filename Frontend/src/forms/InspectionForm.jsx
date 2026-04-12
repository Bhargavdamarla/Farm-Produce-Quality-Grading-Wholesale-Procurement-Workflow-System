import React, { useState, useEffect } from 'react';
import { submitInspection, getPendingInspections } from '../services/inspectionService';
import '../styles.css';

function InspectionForm({ onInspectionAdded }) {
  const [form, setForm] = useState({
    produceId: '',
    qualityScore: '',
    remarks: '',
  });

  const [pendingProduces, setPendingProduces] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [autoGrade, setAutoGrade] = useState('');

  useEffect(() => {
    fetchPendingInspections();
  }, []);

  const fetchPendingInspections = async () => {
    try {
      const data = await getPendingInspections();
      setPendingProduces(data);
    } catch (error) {
      console.error('Failed to fetch pending inspections:', error);
    }
  };

  const determineGrade = (score) => {
    const s = parseFloat(score);
    if (s >= 85) return 'Grade A (High Quality)';
    if (s >= 60) return 'Grade B (Medium Quality)';
    return 'Grade C (Low Quality)';
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.produceId) newErrors.produceId = 'Please select produce';
    if (!form.qualityScore || form.qualityScore < 0 || form.qualityScore > 100) {
      newErrors.qualityScore = 'Score must be between 0-100';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'qualityScore' && value) {
      setAutoGrade(determineGrade(value));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await submitInspection({
        ...form,
        qualityScore: parseFloat(form.qualityScore),
        assignedGrade: autoGrade,
      });
      
      setSuccess('✓ Inspection submitted successfully!');
      setForm({
        produceId: '',
        qualityScore: '',
        remarks: '',
      });
      setAutoGrade('');
      
      if (onInspectionAdded) {
        onInspectionAdded(form);
      }
      
      fetchPendingInspections();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to submit inspection' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Quality Inspection Form</h3>
      
      {success && <div className="success-message">{success}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label>Select Produce for Inspection *</label>
        <select
          name="produceId"
          value={form.produceId}
          onChange={handleChange}
          className={errors.produceId ? 'input-error' : ''}
        >
          <option value="">-- Choose Produce --</option>
          {pendingProduces.length > 0 ? (
            pendingProduces.map(produce => (
              <option key={produce.id} value={produce.id}>
                {produce.categoryName} - {produce.quantity} {produce.unitType} (Submitted: {produce.createdAt})
              </option>
            ))
          ) : (
            <option disabled>No pending inspections</option>
          )}
        </select>
        {errors.produceId && <span className="error-text">{errors.produceId}</span>}
      </div>

      <div className="form-group">
        <label>Quality Score (0-100) *</label>
        <div className="score-input-group">
          <input
            type="range"
            name="qualityScore"
            min="0"
            max="100"
            value={form.qualityScore}
            onChange={handleChange}
            className="score-slider"
          />
          <input
            type="number"
            name="qualityScore"
            value={form.qualityScore}
            onChange={handleChange}
            placeholder="Enter score"
            min="0"
            max="100"
            className={`score-input ${errors.qualityScore ? 'input-error' : ''}`}
          />
        </div>
        {errors.qualityScore && <span className="error-text">{errors.qualityScore}</span>}
        {form.qualityScore && (
          <div className="grade-display">
            <strong>Assigned Grade: </strong>
            <span className={`grade-badge ${form.qualityScore >= 85 ? 'grade-a' : form.qualityScore >= 60 ? 'grade-b' : 'grade-c'}`}>
              {autoGrade}
            </span>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Inspection Remarks</label>
        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Add any inspection notes or remarks"
          rows="4"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Submitting...' : 'Submit Inspection'}
      </button>
    </form>
  );
}

export default InspectionForm;