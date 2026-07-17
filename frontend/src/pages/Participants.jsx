import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getParticipants, searchParticipants, updateParticipant, markPayment } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useDebounce } from '../hooks/useAuth';
import SearchBox from '../components/SearchBox';
import ParticipantCard from '../components/ParticipantCard';

export default function Participants() {
  const { isAuthenticated } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [cardModal, setCardModal] = useState(null);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadParticipants();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (debouncedSearch.trim()) {
      searchParticipants(debouncedSearch)
        .then((res) => setParticipants(res.data))
        .catch((err) => setError(err.message));
    } else {
      loadParticipants();
    }
  }, [debouncedSearch, isAuthenticated]);

  const loadParticipants = () => {
    setLoading(true);
    getParticipants()
      .then((res) => setParticipants(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleMarkPayment = async (id, status) => {
    try {
      await markPayment(id, status);
      loadParticipants();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const updates = Object.fromEntries(form.entries());

    try {
      await updateParticipant(editModal.registrationId, updates);
      setEditModal(null);
      loadParticipants();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Participants</h1>
        <p className="page-subtitle">Search, edit, and manage registrations.</p>

        <div className="search-section">
          <SearchBox value={search} onChange={setSearch} />
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {loading && <div className="loading">Loading participants...</div>}

        {!loading && participants.length === 0 && (
          <div className="empty-state">No participants found.</div>
        )}

        {!loading && participants.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Registration ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Church</th>
                  <th>Address</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p) => (
                  <tr key={p.registrationId}>
                    <td>
                      <code>{p.registrationId}</code>
                    </td>
                    <td>{p.name}</td>
                    <td>{p.phone}</td>
                    <td>{p.church}</td>
                    <td>{p.address}</td>
                    <td>
                      <span className={`badge ${p.payment === 'Paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                        {p.payment || 'Unpaid'}
                      </span>
                    </td>
                    <td>{p.date}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditModal(p)}
                        >
                          Edit
                        </button>
                        {p.payment !== 'Paid' ? (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleMarkPayment(p.registrationId, 'Paid')}
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleMarkPayment(p.registrationId, 'Unpaid')}
                          >
                            Mark Unpaid
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setCardModal(p)}
                        >
                          Card
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editModal && (
          <div className="modal-overlay" onClick={() => setEditModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Participant</h2>
                <button className="modal-close" onClick={() => setEditModal(null)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" defaultValue={editModal.name} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input name="phone" defaultValue={editModal.phone} required />
                </div>
                <div className="form-group">
                  <label>Church</label>
                  <input name="church" defaultValue={editModal.church} required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input name="address" defaultValue={editModal.address} required />
                </div>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {cardModal && (
          <div className="modal-overlay" onClick={() => setCardModal(null)}>
            <div className="modal card-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Registration Card</h2>
                <button className="modal-close" onClick={() => setCardModal(null)}>
                  ×
                </button>
              </div>
              <ParticipantCard participant={cardModal} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        .search-section {
          margin-bottom: 1.5rem;
          max-width: 480px;
        }
        .action-buttons {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
        }
        code {
          font-size: 0.8125rem;
          background: var(--color-bg);
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }
        .card-modal {
          max-width: 400px;
        }
      `}</style>
    </div>
  );
}
