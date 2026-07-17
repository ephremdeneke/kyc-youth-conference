export default function SearchBox({ value, onChange, placeholder = 'Search by name, ID, phone, or church...' }) {
  return (
    <div className="search-box">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
          ×
        </button>
      )}

      <style>{`
        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.875rem;
          font-size: 0.875rem;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          padding: 0.625rem 2.5rem 0.625rem 2.5rem;
          font-size: 0.9375rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          font-family: inherit;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-light);
        }
        .search-clear {
          position: absolute;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: var(--color-text-muted);
          line-height: 1;
          padding: 0.25rem;
        }
      `}</style>
    </div>
  );
}
