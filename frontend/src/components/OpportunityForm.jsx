import { useState } from 'react';

const STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const toDateInput = (d) => d ? new Date(d).toISOString().slice(0, 10) : '';

export default function OpportunityForm({ initial, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    customerName: initial?.customerName || '',
    contactName: initial?.contactName || '',
    contactEmail: initial?.contactEmail || '',
    contactPhone: initial?.contactPhone || '',
    requirement: initial?.requirement || '',
    estimatedValue: initial?.estimatedValue ?? '',
    stage: initial?.stage || 'New',
    priority: initial?.priority || 'Medium',
    nextFollowUpDate: toDateInput(initial?.nextFollowUpDate),
    notes: initial?.notes || '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName.trim()) return setError('Customer name is required');
    if (!form.requirement.trim()) return setError('Requirement summary is required');
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) return setError('Invalid contact email');
    if (form.estimatedValue !== '' && Number(form.estimatedValue) < 0) return setError('Estimated value must be non-negative');

    setError('');
    const payload = {
      ...form,
      estimatedValue: form.estimatedValue === '' ? 0 : Number(form.estimatedValue),
      nextFollowUpDate: form.nextFollowUpDate || undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error-box">{error}</div>}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Customer / Company *</label>
          <input type="text" name="customerName" className="form-input"
            placeholder="Acme Corp" value={form.customerName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Person</label>
          <input type="text" name="contactName" className="form-input"
            placeholder="John Doe" value={form.contactName} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Contact Email</label>
          <input type="email" name="contactEmail" className="form-input"
            placeholder="john@acme.com" value={form.contactEmail} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Phone</label>
          <input type="tel" name="contactPhone" className="form-input"
            placeholder="+91 98765 43210" value={form.contactPhone} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Requirement Summary *</label>
        <textarea name="requirement" className="form-textarea"
          placeholder="Brief description of what the client needs…"
          value={form.requirement} onChange={handleChange} rows={3} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Stage</label>
          <select name="stage" className="form-select" value={form.stage} onChange={handleChange}>
            {STAGES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Estimated Value (₹)</label>
          <input type="number" name="estimatedValue" className="form-input"
            placeholder="0" min="0" value={form.estimatedValue} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Next Follow-up Date</label>
          <input type="date" name="nextFollowUpDate" className="form-input"
            value={form.nextFollowUpDate} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea name="notes" className="form-textarea"
          placeholder="Any additional context or next steps…"
          value={form.notes} onChange={handleChange} rows={2} />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initial ? 'Save changes' : 'Create opportunity'}
        </button>
      </div>
    </form>
  );
}
