const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

export const rowsToCsv = (rows, columns) => {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(',');
  const body = rows
    .map((row) =>
      columns.map((column) => escapeCsvValue(column.getValue(row))).join(',')
    )
    .join('\n');

  return `${header}\n${body}`;
};

export const downloadCsv = (rows, columns, filename) => {
  const csv = rowsToCsv(rows, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
