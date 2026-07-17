import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { getDashboardStats, deleteParticipant } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import SearchBox from '../components/SearchBox';
import RegistrationCard from '../components/RegistrationCard';

function StatCard({ title, value, color, icon }) {
  return (
    <div className="stat-card-modern">
      <div className="stat-icon-modern" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content-modern">
        <div className="stat-label-modern">{title}</div>
        <div className="stat-value-modern">{value}</div>
      </div>
    </div>
  );
}

function ParticipantTableRow({ participant, isAdmin, onDelete, onMarkPaid }) {
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${participant.name}?`)) {
      try {
        await onDelete(participant);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const paymentColor = participant.payment === 'Paid' ? '#11998e' : '#eb3349';
  const paymentBgColor = participant.payment === 'Paid' ? '#d1fae5' : '#fef3c7';
  const paymentTextColor = participant.payment === 'Paid' ? '#065f46' : '#92400e';

  return (
    <tr className="participant-row">
      <td className="table-cell">{participant.registrationId}</td>
      <td className="table-cell">{participant.name}</td>
      <td className="table-cell">{participant.gender}</td>
      <td className="table-cell">{participant.age}</td>
      <td className="table-cell">{participant.phone}</td>
      <td className="table-cell">{participant.telegram}</td>
      <td className="table-cell">{participant.address}</td>
      <td className="table-cell">{participant.church}</td>
      <td className="table-cell">
        <span className="payment-badge" style={{ backgroundColor: paymentBgColor, color: paymentTextColor }}>
          {participant.payment}
        </span>
      </td>
      <td className="table-cell">{participant.transactionNumber}</td>
      <td className="table-cell">{participant.date}</td>
      <td className="table-cell actions-cell">
        <button 
          className="btn-action btn-view-card" 
          title="View Registration Card"
          onClick={() => onViewCard && onViewCard(participant)}
        >
          View Card
        </button>
        <button className="btn-action btn-edit" title="Edit">
          Edit
        </button>
        <button 
          className="btn-action btn-mark-paid" 
          title="Mark Paid"
          onClick={() => onMarkPaid && onMarkPaid(participant)}
        >
          Mark Paid
        </button>
        {isAdmin && (
          <button
            className="btn-action btn-delete"
            title="Delete"
            onClick={handleDelete}
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const loadDashboard = () => {
    setLoading(true);
    setError('');
    return getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadDashboard();
  }, [isAuthenticated]);

  const handleDelete = async (participant) => {
    try {
      await deleteParticipant(participant.registrationId);
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to delete row.');
      throw err;
    }
  };

  const handleMarkPaid = async (participant) => {
    try {
      const { markPayment } = await import('../services/api');
      await markPayment(participant.registrationId, 'Paid');
      await loadDashboard();
    } catch (err) {
      setError(err.message || 'Failed to mark as paid.');
    }
  };

  const filteredParticipants = useMemo(() => {
    if (!stats?.participants) return [];
    const q = search.trim().toLowerCase();
    if (!q) return stats.participants;

    return stats.participants.filter(
      (p) =>
        p.registrationId?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.church?.toLowerCase().includes(q)
    );
  }, [stats, search]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const exportCSV = () => {
    if (!stats?.participants) return;

    const headers = [
      'Registration ID',
      'Name',
      'Gender',
      'Age',
      'Phone',
      'Telegram',
      'Address',
      'Church',
      'Payment',
      'Transaction Number',
      'Screenshot',
       'Date'
    ];
    const rows = stats.participants.map((p) => [
      p.registrationId,
      p.name,
      p.gender,
      p.age,
      p.phone,
      p.telegram,
      p.address,
      p.church,
      p.payment,
      p.transactionNumber,
      p.screenshot,
      p.date,
    ]);

    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kyc-participants-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    if (!stats?.participants) return;

    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('KYC Registration Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total: ${stats.total} | Paid: ${stats.paid} | Unpaid: ${stats.unpaid}`, 14, 36);

    let y = 48;
    doc.setFontSize(8);
    stats.participants.forEach((p) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${p.registrationId} | ${p.name} | ${p.church} | ${p.payment}`, 14, y);
      y += 6;
    });

    doc.save(`kyc-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-header-modern">
          <div className="dashboard-title-section">
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Overview of all registrations</p>
          </div>
          <div className="export-actions-modern">
            <button onClick={exportCSV} className="btn btn-secondary btn-sm">
              Export CSV
            </button>
            <button onClick={exportPDF} className="btn btn-secondary btn-sm">
              Export PDF
            </button>
          </div>
        </div>

        {loading && <div className="loading-modern">Loading dashboard...</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {stats && (
          <>
            <div className="stats-grid-modern">
              <StatCard
                title="Total Participants"
                value={stats.total}
                color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                icon="👥"
              />
              <StatCard
                title="Paid"
                value={stats.paid}
                color="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                icon="✅"
              />
              <StatCard
                title="Unpaid"
                value={stats.unpaid}
                color="linear-gradient(135deg, #eb3349 0%, #f45c43 100%)"
                icon="⏳"
              />
              <StatCard
                title="Male"
                value={stats.male}
                color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                icon="👨"
              />
              <StatCard
                title="Female"
                value={stats.female}
                color="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                icon="👩"
              />
            </div>

            {stats.byChurch && Object.keys(stats.byChurch).length > 0 && (
              <div className="card church-stats-modern">
                <h3 className="section-title-modern">Participants by Church</h3>
                <div className="church-grid-modern">
                  {Object.entries(stats.byChurch).map(([church, count]) => (
                    <div key={church} className="church-item-modern">
                      <div className="church-info-modern">
                        <span className="church-name-modern">{church}</span>
                        <span className="church-count-modern">{count}</span>
                      </div>
                      <div className="church-bar-modern">
                        <div
                          className="church-bar-fill-modern"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="card registrations-section-modern">
              <div className="registrations-header-modern">
                <div>
                  <h3 className="section-title-modern">All Registrations</h3>
                  <p className="section-subtitle-modern">{filteredParticipants.length} participants</p>
                </div>
                <div className="search-wrap-modern">
                  <SearchBox value={search} onChange={setSearch} />
                </div>
              </div>
              <div className="table-container">
                <table className="participants-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Age</th>
                      <th>Phone</th>
                      <th>Telegram</th>
                      <th>Address</th>
                      <th>Church</th>
                      <th>Payment</th>
                      <th>Transaction</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.length > 0 ? (
                      filteredParticipants.map((participant) => (
                        <ParticipantTableRow
                          key={participant.registrationId}
                          participant={participant}
                          isAdmin={user?.role === 'admin'}
                          onDelete={handleDelete}
                          onMarkPaid={handleMarkPaid}
                          onViewCard={setSelectedParticipant}
                        />
                      ))
                    ) : (
                      <tr>
                        <td colSpan="12" className="no-participants-message">
                          <p>No participants found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedParticipant && (
        <RegistrationCard 
          participant={selectedParticipant} 
          onClose={() => setSelectedParticipant(null)} 
        />
      )}

      <style>{`
        .dashboard-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dashboard-title-section {
          flex: 1;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 0.5rem 0;
        }

        .page-subtitle {
          font-size: 1rem;
          color: #6b7280;
          margin: 0;
        }

        .export-actions-modern {
          display: flex;
          gap: 0.75rem;
        }

        .stats-grid-modern {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card-modern {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .stat-icon-modern {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          flex-shrink: 0;
        }

        .stat-content-modern {
          flex: 1;
        }

        .stat-label-modern {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .stat-value-modern {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1a1a2e;
        }

        .church-stats-modern {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }

        .section-title-modern {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 1rem 0;
        }

        .section-subtitle-modern {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0 0 1rem 0;
        }

        .church-grid-modern {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .church-item-modern {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .church-info-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .church-name-modern {
          font-size: 0.9375rem;
          color: #374151;
          font-weight: 500;
        }

        .church-count-modern {
          font-size: 1.125rem;
          font-weight: 700;
          color: #667eea;
        }

        .church-bar-modern {
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .church-bar-fill-modern {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .registrations-section-modern {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .registrations-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .search-wrap-modern {
          min-width: 280px;
          max-width: 400px;
          flex: 1;
        }

        .loading-modern {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
          font-size: 1.125rem;
        }

        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .participants-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          font-size: 0.875rem;
        }

        .participants-table thead {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-bottom: 2px solid #e5e7eb;
        }

        .participants-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #1a1a2e;
          white-space: nowrap;
          position: sticky;
          top: 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
        }

        .participants-table tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s ease;
        }

        .participants-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .participants-table tbody tr:last-child {
          border-bottom: none;
        }

        .table-cell {
          padding: 0.875rem 1rem;
          color: #374151;
        }

        .actions-cell {
          white-space: nowrap;
          min-width: 200px;
        }

        .payment-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          display: inline-block;
        }

        .btn-action {
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-right: 0.5rem;
          border: none;
        }

        .btn-action:last-child {
          margin-right: 0;
        }

        .btn-view-card {
          background: #8b5cf6;
          color: white;
        }

        .btn-view-card:hover {
          background: #7c3aed;
        }

        .btn-edit {
          background: #dbeafe;
          color: #0369a1;
        }

        .btn-edit:hover {
          background: #bfdbfe;
        }

        .btn-mark-paid {
          background: #10b981;
          color: white;
        }

        .btn-mark-paid:hover {
          background: #059669;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
        }

        .btn-delete:hover {
          background: #dc2626;
        }

        .no-participants-message {
          text-align: center;
          padding: 3rem 1rem;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .dashboard-header-modern {
            flex-direction: column;
            align-items: flex-start;
          }

          .export-actions-modern {
            width: 100%;
          }

          .export-actions-modern button {
            flex: 1;
          }

          .stats-grid-modern {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 1rem;
          }

          .registrations-header-modern {
            flex-direction: column;
            align-items: flex-start;
          }

          .search-wrap-modern {
            width: 100%;
            max-width: none;
          }

          .participants-cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .participants-cards-grid {
            grid-template-columns: 1fr;
          }

          .participant-card-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .payment-badge {
            align-self: flex-start;
          }

          .info-row {
            flex-direction: column;
            gap: 0.25rem;
          }

          .info-label {
            min-width: auto;
          }

          .info-value {
            text-align: left;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
