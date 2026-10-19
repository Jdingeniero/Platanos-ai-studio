import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';

function createValidPdf(textLines) {
  let content = 'BT\n/F1 16 Tf\n50 780 Td\n(PLATANOS DEL NORTE S.L. - TARIFA MAYORISTA 2024) Tj\n';
  content += '/F1 10 Tf\n0 -22 Td\n(Cooperativa Agricola del Norte de Gran Canaria - Poligono Candina, Santander) Tj\n';
  content += '/F1 12 Tf\n0 -35 Td\n(CATALOGO OFICIAL DE PRECIOS MAYORISTAS 2024 - DISTRIBUCION PENINSULAR) Tj\n';
  content += '/F1 10 Tf\n';

  const items = [
    'Platano de Canarias IGP - Categoria Extra: 1.42 EUR/kg (Caja 18 kg a granel)',
    'Platano de Canarias IGP - Categoria Primera: 1.28 EUR/kg (Caja 15 kg bandejas)',
    'Aguacate Hass Gran Canaria - Categoria I: 3.95 EUR/kg (Caja 4 kg alveolar)',
    'Platano Madurado en Camara de Etileno (Santander): 1.35 EUR/kg (Pale 864 kg)',
    'Papaya Canaria Sweet Mary: 2.10 EUR/kg (Caja 5 kg)',
    'Transporte frigorifico con temperatura regulada garantizada a 13.5 C.',
    'Entrega mayorista en 24-48 horas a plataformas logisticas de distribucion alimentaria.',
    '----------------------------------------------------------------------------------',
    'DOCUMENTO PUBLICO INDEXADO PARA CLIENTES MAYORISTAS Y DISTRIBUIDORES:',
    'Firma de indexacion OSINT de verificacion: FLAG-D4-PDF-FOUND'
  ];

  for (const item of items) {
    content += `0 -20 Td\n(${item}) Tj\n`;
  }
  content += 'ET';

  const streamLength = Buffer.byteLength(content, 'utf8');

  // We build objects and track exact byte offsets
  let header = '%PDF-1.4\n';
  let offsets = [];

  let obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  let obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  let obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n';
  let obj4 = `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${content}\nendstream\nendobj\n`;
  let obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  let currentOffset = Buffer.byteLength(header, 'utf8');
  offsets.push(currentOffset);
  currentOffset += Buffer.byteLength(obj1, 'utf8');
  offsets.push(currentOffset);
  currentOffset += Buffer.byteLength(obj2, 'utf8');
  offsets.push(currentOffset);
  currentOffset += Buffer.byteLength(obj3, 'utf8');
  offsets.push(currentOffset);
  currentOffset += Buffer.byteLength(obj4, 'utf8');
  offsets.push(currentOffset);
  currentOffset += Buffer.byteLength(obj5, 'utf8');

  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let off of offsets) {
    xref += off.toString().padStart(10, '0') + ' 00000 n \n';
  }

  let trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${currentOffset}\n%%EOF\n`;

  return Buffer.from(header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer, 'utf8');
}

async function main() {
  const outputDir = path.resolve(process.cwd(), 'public/documentos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. PDF
  const pdfBuffer = createValidPdf();
  const pdfPath = path.join(outputDir, 'tarifa_mayorista_2024.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log('✓ Generated PDF:', pdfPath, 'Bytes:', pdfBuffer.length);

  // 2. XLSX with FLAG-D5-METADATA exclusively in metadata (Creator / Title / Description)
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'FLAG-D5-METADATA';
  workbook.lastModifiedBy = 'FLAG-D5-METADATA';
  workbook.created = new Date('2024-01-15T08:30:00Z');
  workbook.modified = new Date('2024-01-18T10:45:00Z');
  workbook.title = 'Calendario de Recogida y Envíos 2024 - FLAG-D5-METADATA';
  workbook.subject = 'Planificación Agrícola de Cosecha y Embarque Gáldar - Santander';
  workbook.company = 'Plátanos del Norte S.L.';
  workbook.description = 'Planificación semanal de cortes de piña de plátano en fincas de Gran Canaria. Autor: FLAG-D5-METADATA';

  const sheet = workbook.addWorksheet('Calendario Recogida 2024', {
    views: [{ showGridLines: true }]
  });

  sheet.columns = [
    { header: 'Semana', key: 'semana', width: 10 },
    { header: 'Fecha de Corte', key: 'fechaCorte', width: 16 },
    { header: 'Finca / Municipio', key: 'finca', width: 26 },
    { header: 'Variedad', key: 'variedad', width: 22 },
    { header: 'Kilos Estimados', key: 'kilos', width: 16 },
    { header: 'Buque de Carga', key: 'buque', width: 22 },
    { header: 'Llegada Puerto Santander', key: 'llegada', width: 22 },
    { header: 'Estado', key: 'estado', width: 14 }
  ];

  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF15803D' }
  };
  sheet.getRow(1).alignment = { horizontal: 'center' };

  const calendarRows = [
    { semana: 'Sem 02', fechaCorte: '2024-01-08', finca: 'Finca El Agujero (Gáldar)', variedad: 'Gran Enana (Extra)', kilos: 24500, buque: 'Volcán de Tinamar', llegada: '2024-01-12', estado: 'Completado' },
    { semana: 'Sem 03', fechaCorte: '2024-01-15', finca: 'Hoya de Pineda (Gáldar)', variedad: 'Gruesa Palmera', kilos: 28000, buque: 'Bentayga Cargo', llegada: '2024-01-19', estado: 'Completado' },
    { semana: 'Sem 04', fechaCorte: '2024-01-22', finca: 'Costa Arucas Lote 3', variedad: 'Gran Enana', kilos: 31200, buque: 'Volcán de Tinamar', llegada: '2024-01-26', estado: 'Completado' },
    { semana: 'Sem 05', fechaCorte: '2024-01-29', finca: 'Guía Cooperativa N-2', variedad: 'Brier / Extra', kilos: 26400, buque: 'Bentayga Cargo', llegada: '2024-02-02', estado: 'En tránsito' },
    { semana: 'Sem 06', fechaCorte: '2024-02-05', finca: 'Finca El Agujero (Gáldar)', variedad: 'Gran Enana (Extra)', kilos: 29800, buque: 'Volcán de Tinamar', llegada: '2024-02-09', estado: 'Programado' },
    { semana: 'Sem 07', fechaCorte: '2024-02-12', finca: 'Finca Bañaderos', variedad: 'Gruesa Palmera', kilos: 27500, buque: 'Bentayga Cargo', llegada: '2024-02-16', estado: 'Programado' },
    { semana: 'Sem 08', fechaCorte: '2024-02-19', finca: 'Hoya de Pineda (Gáldar)', variedad: 'Gran Enana', kilos: 33000, buque: 'Volcán de Tinamar', llegada: '2024-02-23', estado: 'Programado' },
    { semana: 'Sem 09', fechaCorte: '2024-02-26', finca: 'Costa Arucas Lote 1', variedad: 'Aguacate Hass', kilos: 12000, buque: 'Bentayga Cargo', llegada: '2024-03-01', estado: 'Programado' }
  ];

  calendarRows.forEach((r, idx) => {
    const row = sheet.addRow(r);
    row.alignment = { vertical: 'middle' };
    if (idx % 2 === 1) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0FDF4' }
      };
    }
  });

  const xlsxPath = path.join(outputDir, 'calendario_recogida_2024.xlsx');
  await workbook.xlsx.writeFile(xlsxPath);
  console.log('✓ Generated XLSX:', xlsxPath);
}

main().catch(console.error);
