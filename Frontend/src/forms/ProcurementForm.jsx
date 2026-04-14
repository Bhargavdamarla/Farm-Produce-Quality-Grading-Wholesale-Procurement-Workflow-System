import React, { useEffect, useState } from 'react';
import { createOrder, getGradedProduces } from '../services/procurementService';
import '../styles.css';

function ProcurementForm({ onProcurementAdded }) {
  const [form, setForm] = useState({
    produceId: '',
    priceAgreed: '',
  });
  const [acceptedProduce, setAcceptedProduce] = useState([]);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAcceptedProduce();
  }, []);

  const fetchAcceptedProduce = async () => {
    try {
      const data = await getGradedProduces();
      setAcceptedProduce(data || []);
    } catch (error) {
      console.error('Failed to fetch accepted produce:', error);
    }
  };

  const formatCurrency = (value) => `Rs ${Number(value || 0).toFixed(2)}`;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));

    if (name === 'produceId') {
      const match = acceptedProduce.find((produce) => String(produce.id) === value);
      setSelectedProduce(match || null);
    }

    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.produceId) {
      nextErrors.produceId = 'Please choose an accepted produce lot';
    }

    if (!form.priceAgreed || Number(form.priceAgreed) <= 0) {
      nextErrors.priceAgreed = 'Please enter a valid agreed price';
    }

    return nextErrors;
  };

  const estimatedTotal = selectedProduce
    ? Number(selectedProduce.quantity || 0) * Number(form.priceAgreed || 0)
    : 0;

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
      await createOrder({
        produceId: Number(form.produceId),
        priceAgreed: Number(form.priceAgreed),
      });

      setSuccess('Procurement order created successfully.');
      setForm({
        produceId: '',
        priceAgreed: '',
      });
      setSelectedProduce(null);
      setErrors({});

      if (onProcurementAdded) {
        onProcurementAdded();
      }

      await fetchAcceptedProduce();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Failed to create procurement order',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Procurement Order Form</h3>

      {success && <div className="success-message">{success}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label>Select Accepted Produce *</label>
        <select
          name="produceId"
          value={form.produceId}
          onChange={handleChange}
          className={errors.produceId ? 'input-error' : ''}
        >
          <option value="">-- Choose Accepted Produce --</option>
          {acceptedProduce.length > 0 ? (
            acceptedProduce.map((produce) => (
              <option key={produce.id} value={produce.id}>
                Produce #{produce.id} - {produce.category?.name || 'Unknown'} - {produce.quantity} KG
              </option>
            ))
          ) : (
            <option disabled>No accepted produce is available</option>
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
            <span>Status</span>
            <strong>{selectedProduce.status}</strong>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Agreed Price Per KG *</label>
        <input
          type="number"
          name="priceAgreed"
          value={form.priceAgreed}
          onChange={handleChange}
          placeholder="Enter agreed price"
          step="0.01"
          min="0"
          className={errors.priceAgreed ? 'input-error' : ''}
        />
        {errors.priceAgreed && <span className="error-text">{errors.priceAgreed}</span>}
      </div>

      {selectedProduce && Number(form.priceAgreed || 0) > 0 && (
        <div className="total-amount-display">
          <label>Estimated Order Value</label>
          <div className="total-value">{formatCurrency(estimatedTotal)}</div>
          <div className="calculation">
            {Number(selectedProduce.quantity || 0).toFixed(2)} KG x {formatCurrency(form.priceAgreed)}
          </div>
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Creating order...' : 'Create Procurement Order'}
      </button>
    </form>
  );
}

export default ProcurementForm;
