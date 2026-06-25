const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const rowsToCsv = (rows, columns) => {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(',');
  const body = rows
    .map((row) =>
      columns.map((column) => escapeCsvValue(column.getValue(row))).join(',')
    )
    .join('\n');

  return `${header}\n${body}`;
};

module.exports = { rowsToCsv, escapeCsvValue };
