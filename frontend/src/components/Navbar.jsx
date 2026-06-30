import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNewOpportunity }) {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Pipeline <span>CRM</span>
      </Link>
      <div className="navbar-right">
        {onNewOpportunity && (
          <button className="btn btn-primary btn-sm" onClick={onNewOpportunity}>
            + New Opportunity
          </button>
        )}
        <span className="navbar-user">👤 {user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={logout}>Sign out</button>
      </div>
    </nav>
  );
}
