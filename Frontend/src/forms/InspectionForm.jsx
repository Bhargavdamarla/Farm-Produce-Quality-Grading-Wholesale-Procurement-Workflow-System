import React, { useEffect, useState } from 'react';
import { getPendingInspections, submitInspection } from '../services/inspectionService';
import '../styles.css';

function InspectionForm({ onInspectionAdded }) {
  const [form, setForm] = useState({
    produceId: '',
    qualityScore: '',
    remarks: '',
  });
  const [pendingProduce, setPendingProduce] = useState([]);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingProduce();
  }, []);

  const fetchPendingProduce = async () => {
    try {
      const data = await getPendingInspections();
      setPendingProduce(data || []);
    } catch (error) {
      console.error('Failed to fetch pending produce:', error);
    }
  };

  const getDerivedGrade = (score) => {
    const numericScore = Number(score);

    if (numericScore >= 85) return 'Grade A';
    if (numericScore >= 60) return 'Grade B';
    return 'Grade C';
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.produceId) {
      nextErrors.produceId = 'Please choose a produce item';
    }

    if (form.qualityScore === '' || Number(form.qualityScore) < 0 || Number(form.qualityScore) > 100) {
      nextErrors.qualityScore = 'Quality score must be between 0 and 100';
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));

    if (name === 'produceId') {
      const match = pendingProduce.find((produce) => String(produce.id) === value);
      setSelectedProduce(match || null);
    }

    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: '' }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess('');

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    try {
      await submitInspection({
        produceId: Number(form.produceId),
        qualityScore: Number(form.qualityScore),
        remarks: form.remarks,
      });

      setSuccess('Inspection submitted successfully.');
      setForm({
        produceId: '',
        qualityScore: '',
        remarks: '',
      });
      setSelectedProduce(null);
      setErrors({});

      if (onInspectionAdded) {
        onInspectionAdded();
      }

      await fetchPendingProduce();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to submit inspection',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Grade Submission Form</h3>

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
          <option value="">-- Choose Pending Produce --</option>
          {pendingProduce.length > 0 ? (
            pendingProduce.map((produce) => (
              <option key={produce.id} value={produce.id}>
                Produce #{produce.id} - {produce.category?.name || 'Unknown'} - {produce.quantity} KG
              </option>
            ))
          ) : (
            <option disabled>No pending produce available</option>
          )}
        </select>
        {errors.produceId && <span className="error-text">{errors.produceId}</span>}
      </div>

      {selectedProduce && (
        <div className="produce-info">
          <div className="info-item">
            <span>Category</span>
            <strong>{selectedProduce.category?.name || 'Unknown'}</strong>
          </div>
          <div className="info-item">
            <span>Farmer</span>
            <strong>{selectedProduce.farmer?.name || 'Unknown'}</strong>
          </div>
          <div className="info-item">
            <span>Quantity</span>
            <strong>{Number(selectedProduce.quantity || 0).toFixed(2)} KG</strong>
          </div>
          <div className="info-item">
            <span>Submitted</span>
            <strong>
              {selectedProduce.submissionDate
                ? new Date(selectedProduce.submissionDate).toLocaleString()
                : 'N/A'}
            </strong>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Quality Score (0 - 100) *</label>
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
            min="0"
            max="100"
            placeholder="Score"
            className={`score-input ${errors.qualityScore ? 'input-error' : ''}`}
          />
        </div>
        {errors.qualityScore && <span className="error-text">{errors.qualityScore}</span>}
        {form.qualityScore !== '' && (
          <div className="grade-display">
            <strong>Auto grade:</strong>{' '}
            <span
              className={`grade-badge ${
                Number(form.qualityScore) >= 85
                  ? 'grade-a'
                  : Number(form.qualityScore) >= 60
                    ? 'grade-b'
                    : 'grade-c'
              }`}
            >
              {getDerivedGrade(form.qualityScore)}
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
          placeholder="Add notes about freshness, damage, moisture, or market readiness"
          rows="4"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Submitting...' : 'Submit Inspection'}
      </button>
    </form>
  );
}

export default InspectionForm;
