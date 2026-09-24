import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Pencil, Trash2, Search, ArrowUpRight, ArrowDownRight, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Modal } from './Modal';

export const TransactionTable = ({ limit = null }) => {
  const { transactions, deleteTransaction, editTransaction } = useFinance();

  // Filters state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Advanced filters accordion
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit || 10;

  // Edit states
  const [editingTx, setEditingTx] = useState(null);
  const [editDesc, setEditDesc] = useState('');
  const [editAmt, setEditAmt] = useState('');
  const [editCat, setEditCat] = useState('');
  const [editMethod, setEditMethod] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Categories list extracted dynamically
  const categories = Array.from(new Set(transactions.map(t => t.category)));
  const paymentMethods = Array.from(new Set(transactions.map(t => t.paymentMethod).filter(Boolean)));

  // Filter & Sort Logic
  const getFilteredTransactions = () => {
    let result = [...transactions];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(q) || 
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // Type
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Payment Method
    if (paymentFilter !== 'all') {
      result = result.filter(t => t.paymentMethod === paymentFilter);
    }

    // Min Amount
    if (minAmount) {
      result = result.filter(t => t.amount >= parseFloat(minAmount));
    }

    // Max Amount
    if (maxAmount) {
      result = result.filter(t => t.amount <= parseFloat(maxAmount));
    }

    // Date Range
    if (startDate) {
      result = result.filter(t => t.date >= startDate);
    }
    if (endDate) {
      result = result.filter(t => t.date <= endDate);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'desc-asc') return a.description.localeCompare(b.description);
      if (sortBy === 'desc-desc') return b.description.localeCompare(a.description);
      return 0;
    });

    return result;
  };

  const filtered = getFilteredTransactions();
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Paginated chunk
  const paginated = limit 
    ? filtered.slice(0, limit)
    : filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleEditClick = (tx) => {
    setEditingTx(tx);
    setEditDesc(tx.description);
    setEditAmt(tx.amount);
    setEditCat(tx.category);
    setEditMethod(tx.paymentMethod || 'UPI');
    setEditDate(tx.date);
    setEditNotes(tx.notes || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editDesc || !editAmt) return;
    
    editTransaction(editingTx.id, {
      description: editDesc,
      amount: parseFloat(editAmt),
      category: editCat,
      paymentMethod: editMethod,
      date: editDate,
      notes: editNotes
    });

    setEditingTx(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Filtering Header Interface */}
      {!limit && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search description, notes..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                style={{ width: '100%', paddingLeft: '2.3rem' }}
              />
            </div>

            {/* Type selector */}
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} style={{ minWidth: '130px' }}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Category selector */}
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} style={{ minWidth: '140px' }}>
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>

            {/* Sort selector */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ minWidth: '150px' }}>
              <option value="date-desc">Newest Date</option>
              <option value="date-asc">Oldest Date</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
              <option value="desc-asc">Name A-Z</option>
              <option value="desc-desc">Name Z-A</option>
            </select>

            {/* Advanced Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="btn btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.65rem 0.85rem',
                fontSize: '0.85rem',
                borderColor: showAdvanced ? 'var(--accent)' : 'var(--border)'
              }}
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvanced && (
            <div className="animate-fade-in" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Min Amount (₹)</span>
                <input type="number" placeholder="Min" value={minAmount} onChange={(e) => { setMinAmount(e.target.value); setCurrentPage(1); }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Max Amount (₹)</span>
                <input type="number" placeholder="Max" value={maxAmount} onChange={(e) => { setMaxAmount(e.target.value); setCurrentPage(1); }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Start Date</span>
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>End Date</span>
                <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Payment Method</span>
                <select value={paymentFilter} onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}>
                  <option value="all">All Methods</option>
                  {paymentMethods.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Table Layout */}
      <div className="table-container animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                  No matching transactions found. Add a transaction or modify your filters!
                </td>
              </tr>
            ) : (
              paginated.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600 }}>{tx.description}</span>
                        {tx.notes && <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>{tx.notes}</p>}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                        {tx.category}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 700,
                        color: isIncome ? 'var(--success)' : 'var(--danger)',
                        fontSize: '0.8rem'
                      }}>
                        {isIncome ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Cleared</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => handleEditClick(tx)} style={{ color: 'var(--text-secondary)' }} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => deleteTransaction(tx.id)} style={{ color: 'var(--danger)' }} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {!limit && totalPages > 1 && (
        <div className="flex-between" style={{ padding: '0.25rem 0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} items
          </span>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ alignSelf: 'center', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Edit Transaction Modal popup overlay */}
      {editingTx && (
        <Modal isOpen={!!editingTx} onClose={() => setEditingTx(null)} title="Edit Transaction">
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</label>
              <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} required />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Amount (₹)</label>
                <input type="number" value={editAmt} onChange={(e) => setEditAmt(e.target.value)} required min="1" step="any" />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
                <select value={editCat} onChange={(e) => setEditCat(e.target.value)}>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Investment">Investment</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</label>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} required />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Payment Method</label>
                <select value={editMethod} onChange={(e) => setEditMethod(e.target.value)}>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Notes</label>
              <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingTx(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
