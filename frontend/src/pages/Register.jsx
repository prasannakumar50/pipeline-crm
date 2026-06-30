import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Please enter a valid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setError(err);
    setError('');
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Pipeline</div>
        <div className="auth-tagline">CRM Opportunity Tracker</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Start tracking your sales pipeline</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input type="text" name="name" className="form-input" placeholder="Jane Smith"
              value={form.name} onChange={handleChange} autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" placeholder="you@company.com"
              value={form.email} onChange={handleChange} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input type="password" name="confirm" className="form-input" placeholder="Re-enter password"
              value={form.confirm} onChange={handleChange} autoComplete="new-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
