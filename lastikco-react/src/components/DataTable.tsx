import { useState, useEffect, type ReactNode } from 'react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  serverSideSearch?: boolean;
  pageSize?: number;
  rowKey: keyof T;
  actions?: (row: T) => ReactNode;
  tableClassName?: string;
}

function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'Kayıt bulunamadı.',
  searchPlaceholder = 'Ara...',
  onSearch,
  serverSideSearch = false,
  pageSize = 10,
  rowKey,
  actions,
  tableClassName = 'table table-hover',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Filter data based on search term (client-side)
  useEffect(() => {
    if (serverSideSearch) {
      setFilteredData(data);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredData(data);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = data.filter((row) => {
      return columns.some((col) => {
        const value = getNestedValue(row, col.key as string);
        return value?.toString().toLowerCase().includes(searchLower);
      });
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchTerm, columns, serverSideSearch]);

  // Sort data
  useEffect(() => {
    if (!sortConfig) return;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredData(sorted);
  }, [sortConfig]);

  const getNestedValue = (obj: T, key: string): unknown => {
    const keys = key.split('.');
    let value: unknown = obj;
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    return value;
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (serverSideSearch && onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = () => {
    if (serverSideSearch && onSearch) {
      onSearch(searchTerm);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              &laquo;
            </button>
          </li>
          {pages.map((page, index) => (
            <li
              key={index}
              className={`page-item ${page === currentPage ? 'active' : ''} ${typeof page === 'string' ? 'disabled' : ''}`}
            >
              {typeof page === 'string' ? (
                <span className="page-link">{page}</span>
              ) : (
                <button className="page-link" onClick={() => handlePageChange(page)}>
                  {page}
                </button>
              )}
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="datatable-container">
      {/* Search and Info Bar */}
      <div className="datatable-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div className="datatable-info">
          <small className="text-muted">
            {filteredData.length} kayıt bulundu
            {filteredData.length > pageSize && ` (${startIndex + 1}-${Math.min(startIndex + pageSize, filteredData.length)} arası gösteriliyor)`}
          </small>
        </div>
        <div className="datatable-search" style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            style={{ width: '200px' }}
          />
          {serverSideSearch && (
            <button className="btn btn-sm btn-secondary" onClick={handleSearchSubmit}>
              Ara
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive-sm">
        {loading ? (
          <p className="text-center py-4">Yükleniyor...</p>
        ) : paginatedData.length === 0 ? (
          <p className="text-center py-4">{emptyMessage}</p>
        ) : (
          <table className={tableClassName}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                  >
                    {col.header}
                    {col.sortable && sortConfig?.key === col.key && (
                      <span style={{ marginLeft: '4px' }}>
                        {sortConfig.direction === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </th>
                ))}
                {actions && <th>İşlemler</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={String(row[rowKey])}>
                  {columns.map((col) => (
                    <td key={String(col.key)}>
                      {col.render ? col.render(row) : String(getNestedValue(row, col.key as string) ?? '-')}
                    </td>
                  ))}
                  {actions && <td>{actions(row)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && paginatedData.length > 0 && renderPagination()}

      {/* Page Size Selector */}
      {!loading && filteredData.length > 10 && (
        <div className="datatable-footer" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <select
            className="form-control form-control-sm"
            style={{ width: '100px' }}
            value={pageSize}
            onChange={() => {
              setCurrentPage(1);
            }}
            disabled
          >
            <option value={10}>10 / sayfa</option>
            <option value={25}>25 / sayfa</option>
            <option value={50}>50 / sayfa</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default DataTable;
