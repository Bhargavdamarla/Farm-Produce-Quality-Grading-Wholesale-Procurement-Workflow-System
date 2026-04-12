import React, { useState, useEffect } from 'react';
import { createOrder, getGradedProduces } from '../services/procurementService';
import '../styles.css';

function ProcurementForm({ onProcurementAdded }) {
  const [form, setForm] = useState({
    produceId: '',
    procurementQuantity: '',
    unitPrice: '',
  });

  const [gradedProduces, setGradedProduces] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedProduce, setSelectedProduce] = useState(null);

  useEffect(() => {
    fetchGradedProduces();
  }, []);

  const fetchGradedProduces = async () => {
    try {
      const data = await getGradedProduces();
      setGradedProduces(data);
    } catch (error) {
      console.error('Failed to fetch graded produces:', error);
    }
  };

  const calculateTotal = (quantity, price) => {
    return (parseFloat(quantity) * parseFloat(price)).toFixed(2);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.produceId) newErrors.produceId = 'Please select produce';
    if (!form.procurementQuantity || form.procurementQuantity <= 0) {
      newErrors.procurementQuantity = 'Quantity must be greater than 0';
    }
    if (selectedProduce && form.procurementQuantity > selectedProduce.availableQuantity) {
      newErrors.procurementQuantity = `Cannot exceed available: ${selectedProduce.availableQuantity} ${selectedProduce.unitType}`;
    }
    if (!form.unitPrice || form.unitPrice <= 0) {
      newErrors.unitPrice = 'Price must be greater than 0';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'produceId') {
      const produce = gradedProduces.find(p => p.id === parseInt(value));
      setSelectedProduce(produce || null);
    }
    
    if ((name === 'procurementQuantity' || name === 'unitPrice') && form.procurementQuantity && form.unitPrice) {
      const total = calculateTotal(
        name === 'procurementQuantity' ? value : form.procurementQuantity,
        name === 'unitPrice' ? value : form.unitPrice
      );
      setTotalAmount(total);
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
      await createOrder({
        ...form,
        procurementQuantity: parseFloat(form.procurementQuantity),
        unitPrice: parseFloat(form.unitPrice),
        totalAmount: parseFloat(totalAmount),
      });
      
      setSuccess('✓ Procurement order created successfully!');
      setForm({
        produceId: '',
        procurementQuantity: '',
        unitPrice: '',
      });
      setSelectedProduce(null);
      setTotalAmount(0);
      
      if (onProcurementAdded) {
        onProcurementAdded(form);
      }
      
      fetchGradedProduces();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to create order' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Create Procurement Order</h3>
      
      {success && <div className="success-message">{success}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label>Select Graded Produce *</label>
        <select
          name="produceId"
          value={form.produceId}
          onChange={handleChange}
          className={errors.produceId ? 'input-error' : ''}
        >
          <option value="">-- Choose Graded Produce --</option>
          {gradedProduces.length > 0 ? (
            gradedProduces.map(produce => (
              <option key={produce.id} value={produce.id}>
                {produce.categoryName} - Grade {produce.grade} (Available: {produce.availableQuantity} {produce.unitType})
              </option>
            ))
          ) : (
            <option disabled>No graded produce available</option>
          )}
        </select>
        {errors.produceId && <span className="error-text">{errors.produceId}</span>}
      </div>

      {selectedProduce && (
        <div className="produce-info">
          <div className="info-item">
            <span>Category:</span> <strong>{selectedProduce.categoryName}</strong>
          </div>
          <div className="info-item">
            <span>Grade:</span> <strong className={`grade-${selectedProduce.grade.toLowerCase()}`}>Grade {selectedProduce.grade}</strong>
          </div>
          <div className="info-item">
            <span>Available Quantity:</span> <strong>{selectedProduce.availableQuantity} {selectedProduce.unitType}</strong>
          </div>
          <div className="info-item">
            <span>Quality Score:</span> <strong>{selectedProduce.qualityScore}/100</strong>
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Procurement Quantity *</label>
        <input
          type="number"
          name="procurementQuantity"
          value={form.procurementQuantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          step="0.01"
          min="0"
          max={selectedProduce ? selectedProduce.availableQuantity : undefined}
          className={errors.procurementQuantity ? 'input-error' : ''}
        />
        {errors.procurementQuantity && <span className="error-text">{errors.procurementQuantity}</span>}
      </div>

      <div className="form-group">
        <label>Unit Price *</label>
        <input
          type="number"
          name="unitPrice"
          value={form.unitPrice}
          onChange={handleChange}
          placeholder="Enter price per unit"
          step="0.01"
          min="0"
          className={errors.unitPrice ? 'input-error' : ''}
        />
        {errors.unitPrice && <span className="error-text">{errors.unitPrice}</span>}
      </div>

      {totalAmount > 0 && (
        <div className="total-amount-display">
          <label>Total Amount</label>
          <div className="total-value">₹ {totalAmount}</div>
          <div className="calculation">
            {form.procurementQuantity} × ₹{form.unitPrice} = ₹{totalAmount}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Creating Order...' : 'Create Order'}
      </button>
    </form>
  );
}

export default ProcurementForm;