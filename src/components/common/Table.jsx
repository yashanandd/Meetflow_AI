import React from 'react';

export const Table = ({ headers, children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-gray-800 glass-panel ${className}`}>
      <table className="w-full text-left text-sm text-gray-300">
        <thead className="bg-gray-900/90 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-800">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60 font-medium">
          {children}
        </tbody>
      </table>
    </div>
  );
};
