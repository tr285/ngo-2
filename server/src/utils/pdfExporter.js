const PDFDocument = require('pdfkit');

const createPdfBuffer = ({ title, subtitle, columns, rows, summaryLines = [] }) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(18).font('Helvetica-Bold').text(title, { align: 'center' });

    if (subtitle) {
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#666666').text(subtitle, { align: 'center' });
      doc.fillColor('#000000');
    }

    if (summaryLines.length > 0) {
      doc.moveDown();
      doc.fontSize(10).font('Helvetica-Bold').text('Summary');
      summaryLines.forEach((line) => {
        doc.font('Helvetica').text(line);
      });
    }

    doc.moveDown();

    const tableTop = doc.y;
    const columnWidth = (doc.page.width - 100) / columns.length;
    const rowHeight = 20;

    doc.fontSize(9).font('Helvetica-Bold');
    columns.forEach((column, index) => {
      doc.text(column.label, 50 + index * columnWidth, tableTop, {
        width: columnWidth - 4,
        ellipsis: true,
      });
    });

    doc.moveTo(50, tableTop + rowHeight - 4).lineTo(doc.page.width - 50, tableTop + rowHeight - 4).stroke();

    let y = tableTop + rowHeight;

    doc.font('Helvetica');
    rows.forEach((row) => {
      if (y > doc.page.height - 70) {
        doc.addPage();
        y = 50;
      }

      columns.forEach((column, index) => {
        doc.text(String(column.getValue(row) ?? ''), 50 + index * columnWidth, y, {
          width: columnWidth - 4,
          ellipsis: true,
        });
      });

      y += rowHeight;
    });

    doc.end();
  });

module.exports = { createPdfBuffer };
