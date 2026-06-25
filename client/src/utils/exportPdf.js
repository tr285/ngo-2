export const downloadTablePdf = ({ title, subtitle, columns, rows, filename }) => {
  const tableHeaders = columns.map((column) => `<th>${column.label}</th>`).join('');
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td>${column.getValue(row) ?? ''}</td>`)
          .join('')}</tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          p { color: #666; font-size: 12px; margin-top: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 11px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
        <table>
          <thead><tr>${tableHeaders}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');

  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};
