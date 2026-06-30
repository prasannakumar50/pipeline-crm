import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityForm from '../components/OpportunityForm';
import {
  getOpportunities, createOpportunity, updateOpportunity, deleteOpportunity,
} from '../services/api';

// ── Toast system ─────────────────────────────────────────────────────────────
let toastIdCounter = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = ++toastIdCounter;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

// ── Summary helpers ───────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const { user } = useAuth();
  const { toasts, add: toast } = useToast();

  const [opportunities, setOpportunities] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [savingForm, setSavingForm] = useState(false);

  // modal state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = create, opp = edit
  const [deleteConfirm, setDeleteConfirm] = useState(null); // opp to delete

  // filters
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const fetchRef = useRef(null);

  const fetchOpportunities = useCallback(async () => {
    setLoadingList(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (stageFilter) params.stage = stageFilter;
      if (priorityFilter) params.priority = priorityFilter;
      params.sortBy = sortBy;
      const { data } = await getOpportunities(params);
      setOpportunities(data);
    } catch {
      toast('Failed to load opportunities', 'error');
    } finally {
      setLoadingList(false);
    }
  }, [search, stageFilter, priorityFilter, sortBy]);  // eslint-disable-line

  // Debounce search
  useEffect(() => {
    clearTimeout(fetchRef.current);
    fetchRef.current = setTimeout(fetchOpportunities, 350);
    return () => clearTimeout(fetchRef.current);
  }, [fetchOpportunities]);

  const openCreate = () => { setEditTarget(null); setShowForm(true); };
  const openEdit = (opp) => { setEditTarget(opp); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); };

  const handleSave = async (payload) => {
    setSavingForm(true);
    try {
      if (editTarget) {
        const { data } = await updateOpportunity(editTarget._id, payload);
        setOpportunities((prev) => prev.map((o) => o._id === data._id ? data : o));
        toast('Opportunity updated');
      } else {
        const { data } = await createOpportunity(payload);
        setOpportunities((prev) => [data, ...prev]);
        toast('Opportunity created');
      }
      closeForm();
    } catch (err) {
      toast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSavingForm(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteOpportunity(deleteConfirm._id);
      setOpportunities((prev) => prev.filter((o) => o._id !== deleteConfirm._id));
      toast('Opportunity deleted');
    } catch (err) {
      toast(err.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Summary stats
  const total = opportunities.length;
  const mine = opportunities.filter((o) => o.owner?._id === user?._id).length;
  const pipeline = opportunities.reduce((s, o) => s + (o.estimatedValue || 0), 0);
  const won = opportunities.filter((o) => o.stage === 'Won').reduce((s, o) => s + (o.estimatedValue || 0), 0);
  const highPriority = opportunities.filter((o) => o.priority === 'High').length;

  return (
    <>
      <Navbar onNewOpportunity={openCreate} />

      <main className="dashboard">
        <div className="page-header">
          <div>
            <h1 className="page-title">Opportunity Pipeline</h1>
            <p className="page-subtitle">Shared pipeline · {total} opportunities</p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-value">{total}</div>
            <div className="summary-label">Total Deals</div>
          </div>
          <div className="summary-card">
            <div className="summary-value">{mine}</div>
            <div className="summary-label">My Deals</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--teal)', fontSize: '1.15rem' }}>{fmt(pipeline)}</div>
            <div className="summary-label">Pipeline Value</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--success)', fontSize: '1.15rem' }}>{fmt(won)}</div>
            <div className="summary-label">Won Value</div>
          </div>
          <div className="summary-card">
            <div className="summary-value" style={{ color: 'var(--danger)' }}>{highPriority}</div>
            <div className="summary-label">High Priority</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="search" className="form-input" placeholder="Search customer, requirement…"
            value={search} onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="">All stages</option>
            {['New','Contacted','Qualified','Proposal Sent','Won','Lost'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            {['Low','Medium','High'].map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Newest first</option>
            <option value="estimatedValue">Deal value</option>
            <option value="nextFollowUpDate">Follow-up date</option>
          </select>
        </div>

        {/* Opportunity grid */}
        {loadingList ? (
          <div className="loading"><div className="spinner" /></div>
        ) : opportunities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>{search || stageFilter || priorityFilter ? 'No results found' : 'No opportunities yet'}</h3>
            <p>{search || stageFilter || priorityFilter ? 'Try adjusting your filters' : 'Create your first opportunity to get started'}</p>
          </div>
        ) : (
          <div className="opp-grid">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp._id} opp={opp} onEdit={openEdit} onDelete={setDeleteConfirm} />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit modal */}
      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{editTarget ? 'Edit Opportunity' : 'New Opportunity'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={closeForm}>✕</button>
            </div>
            <OpportunityForm
              initial={editTarget}
              onSubmit={handleSave}
              onClose={closeForm}
              loading={savingForm}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h2 className="modal-title">Delete Opportunity</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setDeleteConfirm(null)}>✕</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleteConfirm.customerName}</strong>?
              This action cannot be undone.
            </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === 'success' ? '✓' : '✕'} {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}
