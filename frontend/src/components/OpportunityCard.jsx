import { useAuth } from '../context/AuthContext';

const STAGE_CLASS = {
  'New': 'badge-stage-new',
  'Contacted': 'badge-stage-contacted',
  'Qualified': 'badge-stage-qualified',
  'Proposal Sent': 'badge-stage-proposal',
  'Won': 'badge-stage-won',
  'Lost': 'badge-stage-lost',
};

const PRIORITY_CLASS = {
  'Low': 'badge-priority-low',
  'Medium': 'badge-priority-medium',
  'High': 'badge-priority-high',
};

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

export default function OpportunityCard({ opp, onEdit, onDelete }) {
  const { user } = useAuth();
  const isOwner = opp.owner?._id === user?._id;

  return (
    <div className={`opp-card ${isOwner ? 'mine' : ''}`}>
      <div className="opp-card-header">
        <div className="opp-customer">{opp.customerName}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
          <span className={`badge ${STAGE_CLASS[opp.stage] || ''}`}>{opp.stage}</span>
          <span className={`badge ${PRIORITY_CLASS[opp.priority] || ''}`}>{opp.priority}</span>
        </div>
      </div>

      <p className="opp-requirement">{opp.requirement}</p>

      {opp.estimatedValue > 0 && (
        <div className="opp-value">{fmt(opp.estimatedValue)}</div>
      )}

      <div className="opp-details">
        {opp.contactName && <span>👤 {opp.contactName}</span>}
        {opp.nextFollowUpDate && <span>📅 Follow-up: {fmtDate(opp.nextFollowUpDate)}</span>}
        {opp.notes && <span>📝 {opp.notes.length > 60 ? opp.notes.slice(0, 60) + '…' : opp.notes}</span>}
      </div>

      <div className="opp-card-footer">
        <div className="opp-owner">
          {isOwner ? '✦ ' : ''}{opp.owner?.name || 'Unknown'} · {fmtDate(opp.createdAt)}
        </div>
        {isOwner && (
          <div className="opp-actions">
            <button className="btn btn-ghost btn-sm btn-icon" title="Edit" onClick={() => onEdit(opp)}>✏️</button>
            <button className="btn btn-danger btn-sm btn-icon" title="Delete" onClick={() => onDelete(opp)}>🗑️</button>
          </div>
        )}
      </div>
    </div>
  );
}
