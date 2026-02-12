import { useState, useEffect, type ReactNode } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch, FiChevronUp, FiChevronDown } from 'react-icons/fi';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface GenericTableProps<T> {
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
  title?: string;
  headerActions?: ReactNode;
}

function GenericTable<T>({
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
  title,
  headerActions,
}: GenericTableProps<T>) {
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

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {filteredData.length} kayıttan {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} arası gösteriliyor
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  pageNum === currentPage
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title || 'Liste'}</h3>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              className="pl-9 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-56"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
          </div>
          {headerActions}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-500">Yükleniyor...</span>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                      col.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                    } ${col.className || ''}`}
                  >
                    <div className="flex items-center gap-1">
                      {col.header}
                      {col.sortable && sortConfig?.key === col.key && (
                        sortConfig.direction === 'asc' ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    İşlemler
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((row, index) => (
                <tr
                  key={String(row[rowKey])}
                  className={`transition-colors hover:bg-gray-50 ${
                    index % 2 === 1 ? 'bg-blue-50/30' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={`px-4 py-3 text-sm text-gray-700 ${col.className || ''}`}>
                      {col.render ? col.render(row) : String(getNestedValue(row, col.key as string) ?? '-')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && paginatedData.length > 0 && renderPagination()}
    </div>
  );
}

export default GenericTable;
