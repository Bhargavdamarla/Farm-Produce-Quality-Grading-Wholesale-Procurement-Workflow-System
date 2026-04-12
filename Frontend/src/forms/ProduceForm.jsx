import React, { useState } from 'react';
import { createProduce } from '../services/produceService';
import '../styles.css';

function ProduceForm({ onProduceAdded }) {
  const [form, setForm] = useState({
    categoryId: '',
    categoryName: '',
    quantity: '',
    unitType: 'KG',
    harvestDate: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const categories = ['Wheat', 'Rice', 'Corn', 'Tomato', 'Potato'];

  const validateForm = () => {
    const newErrors = {};
    if (!form.categoryName) newErrors.categoryName = 'Category is required';
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!form.harvestDate) newErrors.harvestDate = 'Harvest date is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      await createProduce({
        ...form,
        quantity: parseFloat(form.quantity),
      });
      
      setSuccess('✓ Produce submitted successfully!');
      setForm({
        categoryId: '',
        categoryName: '',
        quantity: '',
        unitType: 'KG',
        harvestDate: '',
      });
      
      if (onProduceAdded) {
        onProduceAdded(form);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to submit produce' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>Submit Farm Produce</h3>
      
      {success && <div className="success-message">{success}</div>}
      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <div className="form-group">
        <label>Produce Category *</label>
        <select
          name="categoryName"
          value={form.categoryName}
          onChange={handleChange}
          className={errors.categoryName ? 'input-error' : ''}
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.categoryName && <span className="error-text">{errors.categoryName}</span>}
      </div>

      <div className="form-group">
        <label>Quantity *</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          step="0.01"
          min="0"
          className={errors.quantity ? 'input-error' : ''}
        />
        {errors.quantity && <span className="error-text">{errors.quantity}</span>}
      </div>

      <div className="form-group">
        <label>Unit Type *</label>
        <select
          name="unitType"
          value={form.unitType}
          onChange={handleChange}
        >
          <option value="KG">KG (Kilogram)</option>
          <option value="QUINTAL">QUINTAL</option>
          <option value="TON">TON</option>
        </select>
      </div>

      <div className="form-group">
        <label>Harvest Date *</label>
        <input
          type="date"
          name="harvestDate"
          value={form.harvestDate}
          onChange={handleChange}
          className={errors.harvestDate ? 'input-error' : ''}
        />
        {errors.harvestDate && <span className="error-text">{errors.harvestDate}</span>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? 'Submitting...' : 'Submit Produce'}
      </button>
    </form>
  );
}

export default ProduceForm;