import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  VerticalAlign,
  ShadingType
} from 'docx';
import { RingkasanMateriDoc } from '../types';

export async function exportRingkasanToDocx(doc: RingkasanMateriDoc) {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 4, color: '334155' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: '334155' },
    left: { style: BorderStyle.SINGLE, size: 4, color: '334155' },
    right: { style: BorderStyle.SINGLE, size: 4, color: '334155' },
  };

  const headerBg = '064E3B'; // Emerald deep
  const headerSubBg = 'E2E8F0'; // Slate light
  const altRowBg = 'F8FAFC';

  // Helper for Section Header Row
  const createSectionHeader = (title: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          shading: { fill: headerBg, type: ShadingType.CLEAR, color: 'auto' },
          margins: { top: 120, bottom: 120, left: 180, right: 180 },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  color: 'FFFFFF',
                  size: 22,
                  font: 'Arial',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };

  // Helper for Sub-table header row
  const createColumnHeaderRow = (col1: string, col2: string, col3: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          shading: { fill: headerSubBg, type: ShadingType.CLEAR, color: 'auto' },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: col1, bold: true, size: 19, font: 'Arial' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 27, type: WidthType.PERCENTAGE },
          shading: { fill: headerSubBg, type: ShadingType.CLEAR, color: 'auto' },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: col2, bold: true, size: 19, font: 'Arial' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          shading: { fill: headerSubBg, type: ShadingType.CLEAR, color: 'auto' },
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: col3, bold: true, size: 19, font: 'Arial' })],
            }),
          ],
        }),
      ],
    });
  };

  // Helper for key-value row inside Identitas
  const createIdentitasRow = (no: string, label: string, value: string, isAlt: boolean = false) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          shading: isAlt ? { fill: altRowBg, type: ShadingType.CLEAR, color: 'auto' } : undefined,
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: no, size: 19, font: 'Arial' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 27, type: WidthType.PERCENTAGE },
          shading: isAlt ? { fill: altRowBg, type: ShadingType.CLEAR, color: 'auto' } : undefined,
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: label, bold: true, size: 19, font: 'Arial' })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          shading: isAlt ? { fill: altRowBg, type: ShadingType.CLEAR, color: 'auto' } : undefined,
          verticalAlign: VerticalAlign.CENTER,
          margins: { top: 90, bottom: 90, left: 120, right: 120 },
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [new TextRun({ text: value || '-', size: 19, font: 'Arial' })],
            }),
          ],
        }),
      ],
    });
  };

  // Helper for narrative block row (e.g. Pendahuluan, Kesimpulan)
  const createNarrativeBlockRow = (label: string, text: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnSpan: 3,
          margins: { top: 120, bottom: 120, left: 160, right: 160 },
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              children: [new TextRun({ text: text, size: 20, font: 'Arial', color: '1E293B' })],
            }),
          ],
        }),
      ],
    });
  };

  // Build the complete spreadsheet rows
  const idt = doc.identitas;
  const masalahText = idt.aspekMasalahCustom || idt.aspekMasalah;

  const tableRows: TableRow[] = [
    // --- Bagian A. IDENTITAS KEGIATAN ---
    createSectionHeader('A. IDENTITAS KEGIATAN'),
    createColumnHeaderRow('No', 'Komponen', 'Keterangan'),
    createIdentitasRow('1', 'Aspek / Masalah', masalahText, true),
    createIdentitasRow('2', 'Nama Kegiatan', idt.namaKegiatan, false),
    createIdentitasRow('3', 'Hari / Tanggal', idt.hariTanggal, true),
    createIdentitasRow('4', 'Waktu Pelaksanaan', idt.waktu, false),
    createIdentitasRow('5', 'Narasumber', idt.narasumber, true),
    createIdentitasRow('6', 'Jumlah Peserta', idt.jumlahPeserta, false),
    createIdentitasRow('7', 'Sasaran / Satuan Pendidikan', idt.satuanPendidikan || 'Guru PAI Binaan', true),

    // --- Bagian B. PENDAHULUAN ---
    createSectionHeader('B. PENDAHULUAN (Maksimal 150 Kata)'),
    createNarrativeBlockRow('Uraian Pendahuluan', doc.pendahuluan),

    // --- Bagian C. OUTLINE MATERI ---
    createSectionHeader('C. OUTLINE MATERI'),
    createColumnHeaderRow('No', 'Sub-Materi', 'Garis Besar Topik Bahasan'),
    createIdentitasRow('1', 'Sub-materi 1', doc.outlineMateri.subMateri1, true),
    createIdentitasRow('2', 'Sub-materi 2', doc.outlineMateri.subMateri2, false),
    createIdentitasRow('3', 'Sub-materi 3', doc.outlineMateri.subMateri3, true),

    // --- Bagian D. ISI MATERI ---
    createSectionHeader('D. ISI MATERI (Masing-Masing Sub-Materi Maksimal 300 Kata)'),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '1', bold: true, size: 20 })] })],
        }),
        new TableCell({
          width: { size: 92, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: doc.outlineMateri.subMateri1, bold: true, size: 20, color: '064E3B' })],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 80 },
              children: [new TextRun({ text: doc.isiMateri.subMateri1, size: 20, font: 'Arial' })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '2', bold: true, size: 20 })] })],
        }),
        new TableCell({
          width: { size: 92, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: doc.outlineMateri.subMateri2, bold: true, size: 20, color: '064E3B' })],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 80 },
              children: [new TextRun({ text: doc.isiMateri.subMateri2, size: 20, font: 'Arial' })],
            }),
          ],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.TOP,
          margins: { top: 100, bottom: 100, left: 120, right: 120 },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '3', bold: true, size: 20 })] })],
        }),
        new TableCell({
          width: { size: 92, type: WidthType.PERCENTAGE },
          columnSpan: 2,
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: doc.outlineMateri.subMateri3, bold: true, size: 20, color: '064E3B' })],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 80 },
              children: [new TextRun({ text: doc.isiMateri.subMateri3, size: 20, font: 'Arial' })],
            }),
          ],
        }),
      ],
    }),

    // --- Bagian E. SESI DISKUSI ---
    createSectionHeader('E. SESI DISKUSI (Tanya Jawab Berdasarkan Sub-Materi)'),
    ...doc.sesiDiskusi.map((item, idx) => {
      return new TableRow({
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            margins: { top: 100, bottom: 100, left: 120, right: 120 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${idx + 1}`, bold: true, size: 20 })] })],
          }),
          new TableCell({
            width: { size: 92, type: WidthType.PERCENTAGE },
            columnSpan: 2,
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `Topik Terkait: `, bold: true, size: 19, color: '064E3B' }),
                  new TextRun({ text: item.subMateriJudul, bold: true, size: 19, color: '064E3B' }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60 },
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({ text: `Pertanyaan (${item.penanya || 'Peserta'}): `, bold: true, size: 19, color: 'B45309' }),
                  new TextRun({ text: item.pertanyaan, italics: true, size: 19 }),
                ],
              }),
              new Paragraph({
                spacing: { before: 60 },
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({ text: `Jawaban Narasumber: `, bold: true, size: 19, color: '047857' }),
                  new TextRun({ text: item.jawaban, size: 19 }),
                ],
              }),
            ],
          }),
        ],
      });
    }),

    // --- Bagian F. KESIMPULAN DAN TINDAK LANJUT ---
    createSectionHeader('F. KESIMPULAN DAN TINDAK LANJUT (Maksimal 150 Kata)'),
    createNarrativeBlockRow('Uraian Kesimpulan dan Tindak Lanjut', doc.kesimpulanTindakLanjut),
  ];

  // Document Heading & Kop
  const documentTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorder,
    rows: tableRows,
  });

  // Signature block table (2 columns)
  const signatureTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 80, left: 40, right: 40 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: 'Mengetahui,', size: 20, font: 'Arial' })],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: 'Ketua Pokjawas PAI,', bold: true, size: 20, font: 'Arial' })],
              }),
              new Paragraph({
                spacing: { before: 800 },
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: idt.namaKetuaPokjawas || '(....................................................)',
                    bold: true,
                    underline: {},
                    size: 20,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: `NIP. ${idt.nipKetuaPokjawas || '...........................................'}`,
                    size: 19,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 200, bottom: 80, left: 40, right: 40 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: `${idt.kotaKabupaten || 'Ditetapkan'}, ${idt.hariTanggal || '......................'}`,
                    size: 20,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [new TextRun({ text: 'Pengawas PAI Pembina,', bold: true, size: 20, font: 'Arial' })],
              }),
              new Paragraph({
                spacing: { before: 800 },
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: idt.namaPengawasPAI || '(....................................................)',
                    bold: true,
                    underline: {},
                    size: 20,
                    font: 'Arial',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: `NIP. ${idt.nipPengawasPAI || '...........................................'}`,
                    size: 19,
                    font: 'Arial',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const wordDoc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch (72pt * 20 = 1440)
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: [
          // Kop / Heading
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'KEMENTERIAN AGAMA REPUBLIK INDONESIA',
                bold: true,
                size: 24,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'KELOMPOK KERJA PENGAWAS PENDIDIKAN AGAMA ISLAM (POKJAWAS PAI)',
                bold: true,
                size: 22,
                font: 'Arial',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `${idt.satuanPendidikan || 'Wilayah Binaan Pengawas PAI'} - ${idt.kotaKabupaten || ''}`,
                size: 19,
                font: 'Arial',
                color: '475569',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({
                text: 'RINGKASAN MATERI PEMBINAAN PENGAWAS PAI',
                bold: true,
                size: 26,
                font: 'Arial',
                color: '064E3B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 280 },
            children: [
              new TextRun({
                text: 'Lampiran Laporan Pelaksanaan Pengawasan Akademik Guru PAI dan Budi Pekerti',
                italics: true,
                size: 18,
                font: 'Arial',
                color: '64748B',
              }),
            ],
          }),

          // The Spreadsheet Table
          documentTable,

          // Spacing before Signatures
          new Paragraph({ spacing: { before: 300 } }),

          // Signature Block
          signatureTable,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(wordDoc);
  const fileName = `Ringkasan_Materi_Pembinaan_PAI_${doc.identitas.namaKegiatan.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30) || 'Dokumen'}.docx`;

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
