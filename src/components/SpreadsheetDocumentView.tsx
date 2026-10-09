import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Edit3, 
  Check, 
  Copy, 
  Sparkles, 
  FileSpreadsheet, 
  Building2, 
  Info, 
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Users,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { RingkasanMateriDoc } from '../types';
import { exportRingkasanToDocx } from '../utils/docxExport';

interface SpreadsheetDocumentViewProps {
  doc: RingkasanMateriDoc;
  onUpdateDoc: (updated: RingkasanMateriDoc) => void;
  onPrint: () => void;
  onNavigateToForm: () => void;
}

export const SpreadsheetDocumentView: React.FC<SpreadsheetDocumentViewProps> = ({
  doc,
  onUpdateDoc,
  onPrint,
  onNavigateToForm,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editedDoc, setEditedDoc] = useState<RingkasanMateriDoc>(doc);

  // Sync editedDoc when doc prop changes
  React.useEffect(() => {
    setEditedDoc(doc);
  }, [doc]);

  const countWords = (text: string) => (text ? text.trim().split(/\s+/).filter(Boolean).length : 0);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await exportRingkasanToDocx(isEditing ? editedDoc : doc);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh dokumen Word.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveEdit = () => {
    onUpdateDoc(editedDoc);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedDoc(doc);
    setIsEditing(false);
  };

  const handleCopyText = () => {
    const activeData = isEditing ? editedDoc : doc;
    const idt = activeData.identitas;
    const masalah = idt.aspekMasalahCustom || idt.aspekMasalah;

    const fullPlainText = `RINGKASAN MATERI PEMBINAAN PENGAWAS PAI

A. IDENTITAS KEGIATAN
1. Aspek / Masalah: ${masalah}
2. Nama Kegiatan: ${idt.namaKegiatan}
3. Hari / Tanggal: ${idt.hariTanggal}
4. Waktu: ${idt.waktu}
5. Narasumber: ${idt.narasumber}
6. Jumlah Peserta: ${idt.jumlahPeserta}
7. Sasaran: ${idt.satuanPendidikan || '-'}

B. PENDAHULUAN
${activeData.pendahuluan}

C. OUTLINE MATERI
1. ${activeData.outlineMateri.subMateri1}
2. ${activeData.outlineMateri.subMateri2}
3. ${activeData.outlineMateri.subMateri3}

D. ISI MATERI
1. ${activeData.outlineMateri.subMateri1}
${activeData.isiMateri.subMateri1}

2. ${activeData.outlineMateri.subMateri2}
${activeData.isiMateri.subMateri2}

3. ${activeData.outlineMateri.subMateri3}
${activeData.isiMateri.subMateri3}

E. SESI DISKUSI
${activeData.sesiDiskusi.map((d, i) => `${i + 1}. Topik: ${d.subMateriJudul}\n   Pertanyaan: ${d.pertanyaan}\n   Jawaban: ${d.jawaban}`).join('\n\n')}

F. KESIMPULAN DAN TINDAK LANJUT
${activeData.kesimpulanTindakLanjut}

Mengetahui,                                 ${idt.kotaKabupaten}, ${idt.hariTanggal}
Ketua Pokjawas PAI                          Pengawas PAI Pembina,


${idt.namaKetuaPokjawas}                    ${idt.namaPengawasPAI}
NIP. ${idt.nipKetuaPokjawas}                NIP. ${idt.nipPengawasPAI}
`;

    navigator.clipboard.writeText(fullPlainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const active = isEditing ? editedDoc : doc;
  const idt = active.identitas;
  const masalahText = idt.aspekMasalahCustom || idt.aspekMasalah;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Top Action Toolbar (Hidden when printing) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Format Tabel Spreadsheet Resmi
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Rata Kanan Kiri (Justified) • Standar PUEBI/EYD
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 mt-1">
            Ringkasan Materi Pembinaan Terstruktur
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Edit Mode */}
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                Simpan Perubahan
              </button>
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all"
              title="Edit langsung teks di dalam tabel"
            >
              <Edit3 className="w-4 h-4 text-emerald-700" />
              <span>Edit Langsung</span>
            </button>
          )}

          {/* Copy Plain Text */}
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all"
            title="Salin teks lengkap ke clipboard"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          {/* Download Word Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-emerald-950 shadow-sm transition-all active:scale-95"
            title="Unduh dokumen resmi dalam format Word (.docx)"
          >
            <Download className="w-4 h-4 font-bold" />
            <span>{downloading ? 'Mengunduh...' : 'Download Word (.docx)'}</span>
          </button>

          {/* Cetak / Save PDF */}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95"
            title="Cetak langsung ke printer atau Simpan sebagai PDF"
          >
            <Printer className="w-4 h-4 text-emerald-200" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Editing notice if active */}
      {isEditing && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-900 text-xs sm:text-sm flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Mode Edit Aktif:</strong> Anda dapat mengedit langsung setiap sel tabel di bawah ini. Pastikan jumlah kata tetap sesuai pedoman (Pendahuluan maks 150 kata, Isi per Sub maks 300 kata).
            </span>
          </div>
          <button
            onClick={handleSaveEdit}
            className="text-xs font-bold underline hover:text-amber-800 ml-4 flex-shrink-0"
          >
            Simpan Sekarang
          </button>
        </div>
      )}

      {/* THE OFFICIAL SPREADSHEET DOCUMENT CONTAINER */}
      <div 
        id="official-document-sheet"
        className="bg-white shadow-lg rounded-2xl border border-slate-300 print:border-none print:shadow-none p-6 sm:p-10 lg:p-12 text-slate-800 font-sans print:p-0 print:m-0"
      >
        {/* KOP / OFFICIAL DOCUMENT HEADER */}
        <div className="text-center pb-5 mb-6 border-b-2 border-slate-800">
          <div className="text-xs sm:text-sm font-semibold tracking-widest text-slate-700 uppercase">
            Kementerian Agama Republik Indonesia
          </div>
          <div className="text-sm sm:text-base md:text-lg font-extrabold text-emerald-950 uppercase tracking-wide mt-0.5 font-serif">
            Kelompok Kerja Pengawas Pendidikan Agama Islam (POKJAWAS PAI)
          </div>
          <div className="text-xs sm:text-sm text-slate-600 font-medium">
            {idt.satuanPendidikan || 'Wilayah Binaan Pengawas PAI'} • {idt.kotaKabupaten}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-300">
            <h1 className="text-base sm:text-xl md:text-2xl font-black text-emerald-900 uppercase tracking-tight font-serif">
              Ringkasan Materi Pembinaan Pengawas PAI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 italic mt-0.5">
              Lampiran Resmi Laporan Pelaksanaan Pengawasan Akademik Guru PAI dan Budi Pekerti
            </p>
          </div>
        </div>

        {/* SPREADSHEET TABLE: 6 MAIN SECTIONS */}
        <div className="overflow-x-auto border-2 border-slate-800 rounded-lg shadow-2xs">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            
            {/* =========================================
                BAGIAN A. IDENTITAS KEGIATAN
               ========================================= */}
            <thead>
              <tr className="bg-emerald-900 text-white">
                <th colSpan={3} className="px-4 py-2.5 font-bold uppercase tracking-wider text-xs sm:text-sm border-b border-emerald-950">
                  A. IDENTITAS KEGIATAN
                </th>
              </tr>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                <th className="w-12 text-center py-2 px-2 border-r border-slate-400">No</th>
                <th className="w-1/4 sm:w-1/5 py-2 px-3 border-r border-slate-400">Komponen</th>
                <th className="py-2 px-4">Keterangan / Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              
              {/* Row 1: Aspek/Masalah */}
              <tr className="hover:bg-slate-50/80">
                <td className="text-center font-semibold text-slate-600 py-2.5 px-2 border-r border-slate-300 align-top">
                  1
                </td>
                <td className="font-semibold text-slate-800 py-2.5 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Aspek / Masalah
                </td>
                <td className="py-2.5 px-4 text-justify leading-relaxed">
                  {isEditing ? (
                    <textarea
                      value={editedDoc.identitas.aspekMasalahCustom || editedDoc.identitas.aspekMasalah}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          identitas: { ...editedDoc.identitas, aspekMasalahCustom: e.target.value }
                        })
                      }
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 text-xs sm:text-sm"
                    />
                  ) : (
                    <span className="font-medium text-emerald-950">{masalahText}</span>
                  )}
                </td>
              </tr>

              {/* Row 2: Nama Kegiatan */}
              <tr className="hover:bg-slate-50/80 bg-slate-50/30">
                <td className="text-center font-semibold text-slate-600 py-2.5 px-2 border-r border-slate-300 align-top">
                  2
                </td>
                <td className="font-semibold text-slate-800 py-2.5 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Nama Kegiatan
                </td>
                <td className="py-2.5 px-4 text-justify leading-relaxed">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.identitas.namaKegiatan}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          identitas: { ...editedDoc.identitas, namaKegiatan: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-600 text-xs sm:text-sm"
                    />
                  ) : (
                    <span className="font-medium text-slate-900">{idt.namaKegiatan}</span>
                  )}
                </td>
              </tr>

              {/* Row 3: Hari / Tanggal */}
              <tr className="hover:bg-slate-50/80">
                <td className="text-center font-semibold text-slate-600 py-2.5 px-2 border-r border-slate-300 align-top">
                  3
                </td>
                <td className="font-semibold text-slate-800 py-2.5 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Hari / Tanggal
                </td>
                <td className="py-2.5 px-4 text-justify leading-relaxed">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.identitas.hariTanggal}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          identitas: { ...editedDoc.identitas, hariTanggal: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm"
                    />
                  ) : (
                    <span>{idt.hariTanggal}</span>
                  )}
                </td>
              </tr>

              {/* Row 4: Waktu */}
              <tr className="hover:bg-slate-50/80 bg-slate-50/30">
                <td className="text-center font-semibold text-slate-600 py-2.5 px-2 border-r border-slate-300 align-top">
                  4
                </td>
                <td className="font-semibold text-slate-800 py-2.5 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Waktu
                </td>
                <td className="py-2.5 px-4 text-justify leading-relaxed">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.identitas.waktu}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          identitas: { ...editedDoc.identitas, waktu: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm"
                    />
                  ) : (
                    <span>{idt.waktu}</span>
                  )}
                </td>
              </tr>

              {/* Row 5: Narasumber */}
              <tr className="hover:bg-slate-50/80">
                <td className="text-center font-semibold text-slate-600 py-2.5 px-2 border-r border-slate-300 align-top">
                  5
                </td>
                <td className="font-semibold text-slate-800 py-2.5 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Narasumber
                </td>
                <td className="py-2.5 px-4 text-justify leading-relaxed">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.identitas.narasumber}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          identitas: { ...editedDoc.identitas, narasumber: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm"
                    />
                  ) : (
                    <span className="font-medium text-slate-900">{idt.narasumber}</span>
                  )}
                </td>
              </tr>

              {/* Row 6: Jumlah Peserta */}
              <tr className="hover:bg-slate-50/80 bg-slate-50/30">
                <td className="text-center font-semibold text-slate-600 py-2.5 px-2 border-r border-slate-300 align-top">
                  6
                </td>
                <td className="font-semibold text-slate-800 py-2.5 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                  Jumlah Peserta
                </td>
                <td className="py-2.5 px-4 text-justify leading-relaxed">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.identitas.jumlahPeserta}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          identitas: { ...editedDoc.identitas, jumlahPeserta: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm"
                    />
                  ) : (
                    <span>{idt.jumlahPeserta}</span>
                  )}
                </td>
              </tr>

              {/* Row 7: Sasaran / Satuan Pendidikan */}
              {idt.satuanPendidikan && (
                <tr className="hover:bg-slate-50/80">
                  <td className="text-center font-semibold text-slate-600 py-2.5 px-2 border-r border-slate-300 align-top">
                    7
                  </td>
                  <td className="font-semibold text-slate-800 py-2.5 px-3 border-r border-slate-300 align-top bg-slate-50/50">
                    Sasaran / Wilayah
                  </td>
                  <td className="py-2.5 px-4 text-justify leading-relaxed text-slate-700">
                    {idt.satuanPendidikan}
                  </td>
                </tr>
              )}

              {/* =========================================
                  BAGIAN B. PENDAHULUAN
                 ========================================= */}
              <tr className="bg-emerald-900 text-white">
                <th colSpan={3} className="px-4 py-2.5 font-bold uppercase tracking-wider text-xs sm:text-sm border-t-2 border-b border-emerald-950 flex-row justify-between">
                  <div className="flex items-center justify-between">
                    <span>B. PENDAHULUAN</span>
                    <span className="text-[11px] font-normal text-emerald-200">
                      (Maksimal 150 Kata • {countWords(active.pendahuluan)} kata)
                    </span>
                  </div>
                </th>
              </tr>
              <tr>
                <td colSpan={3} className="p-4 sm:p-5 bg-white">
                  {isEditing ? (
                    <div className="space-y-1">
                      <textarea
                        value={editedDoc.pendahuluan}
                        onChange={(e) =>
                          setEditedDoc({ ...editedDoc, pendahuluan: e.target.value })
                        }
                        rows={5}
                        className="w-full p-3 border border-slate-300 rounded-lg text-justify focus:ring-1 focus:ring-emerald-600 text-xs sm:text-sm leading-relaxed"
                      />
                      <div className="text-right text-xs text-slate-500">
                        Kata: {countWords(editedDoc.pendahuluan)} / maks 150 kata
                      </div>
                    </div>
                  ) : (
                    <p className="text-justify leading-relaxed text-slate-800 indent-8">
                      {active.pendahuluan}
                    </p>
                  )}
                </td>
              </tr>

              {/* =========================================
                  BAGIAN C. OUTLINE MATERI
                 ========================================= */}
              <tr className="bg-emerald-900 text-white">
                <th colSpan={3} className="px-4 py-2.5 font-bold uppercase tracking-wider text-xs sm:text-sm border-t-2 border-b border-emerald-950">
                  C. OUTLINE MATERI
                </th>
              </tr>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-400">
                <th className="w-12 text-center py-2 px-2 border-r border-slate-400">No</th>
                <th className="w-1/4 sm:w-1/5 py-2 px-3 border-r border-slate-400">Sub-Materi</th>
                <th className="py-2 px-4">Kerangka Topik / Pokok Bahasan</th>
              </tr>
              
              {/* Outline Sub 1 */}
              <tr className="hover:bg-slate-50/80">
                <td className="text-center font-bold text-slate-700 py-3 px-2 border-r border-slate-300 align-top">
                  1
                </td>
                <td className="font-bold text-emerald-900 py-3 px-3 border-r border-slate-300 align-top bg-emerald-50/30">
                  Sub-materi 1
                </td>
                <td className="py-3 px-4 text-justify leading-relaxed font-semibold text-slate-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.outlineMateri.subMateri1}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          outlineMateri: { ...editedDoc.outlineMateri, subMateri1: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm"
                    />
                  ) : (
                    active.outlineMateri.subMateri1
                  )}
                </td>
              </tr>

              {/* Outline Sub 2 */}
              <tr className="hover:bg-slate-50/80 bg-slate-50/30">
                <td className="text-center font-bold text-slate-700 py-3 px-2 border-r border-slate-300 align-top">
                  2
                </td>
                <td className="font-bold text-emerald-900 py-3 px-3 border-r border-slate-300 align-top bg-emerald-50/30">
                  Sub-materi 2
                </td>
                <td className="py-3 px-4 text-justify leading-relaxed font-semibold text-slate-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.outlineMateri.subMateri2}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          outlineMateri: { ...editedDoc.outlineMateri, subMateri2: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm"
                    />
                  ) : (
                    active.outlineMateri.subMateri2
                  )}
                </td>
              </tr>

              {/* Outline Sub 3 */}
              <tr className="hover:bg-slate-50/80">
                <td className="text-center font-bold text-slate-700 py-3 px-2 border-r border-slate-300 align-top">
                  3
                </td>
                <td className="font-bold text-emerald-900 py-3 px-3 border-r border-slate-300 align-top bg-emerald-50/30">
                  Sub-materi 3
                </td>
                <td className="py-3 px-4 text-justify leading-relaxed font-semibold text-slate-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedDoc.outlineMateri.subMateri3}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          outlineMateri: { ...editedDoc.outlineMateri, subMateri3: e.target.value }
                        })
                      }
                      className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm"
                    />
                  ) : (
                    active.outlineMateri.subMateri3
                  )}
                </td>
              </tr>

              {/* =========================================
                  BAGIAN D. ISI MATERI
                 ========================================= */}
              <tr className="bg-emerald-900 text-white">
                <th colSpan={3} className="px-4 py-2.5 font-bold uppercase tracking-wider text-xs sm:text-sm border-t-2 border-b border-emerald-950">
                  <div className="flex items-center justify-between">
                    <span>D. ISI MATERI</span>
                    <span className="text-[11px] font-normal text-emerald-200">
                      (Masing-Masing Sub-Materi Maksimal 300 Kata)
                    </span>
                  </div>
                </th>
              </tr>

              {/* Isi Sub-materi 1 */}
              <tr className="hover:bg-slate-50/80">
                <td className="text-center font-bold text-slate-800 py-4 px-2 border-r border-slate-300 align-top bg-slate-50/40">
                  1
                </td>
                <td colSpan={2} className="p-4 sm:p-5">
                  <div className="mb-2 font-bold text-emerald-900 text-xs sm:text-sm border-b border-emerald-100 pb-1 flex justify-between items-center">
                    <span>{active.outlineMateri.subMateri1}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {countWords(active.isiMateri.subMateri1)}/300 kata
                    </span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedDoc.isiMateri.subMateri1}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          isiMateri: { ...editedDoc.isiMateri, subMateri1: e.target.value }
                        })
                      }
                      rows={6}
                      className="w-full p-3 border border-slate-300 rounded text-justify text-xs sm:text-sm leading-relaxed"
                    />
                  ) : (
                    <p className="text-justify leading-relaxed text-slate-800 indent-8">
                      {active.isiMateri.subMateri1}
                    </p>
                  )}
                </td>
              </tr>

              {/* Isi Sub-materi 2 */}
              <tr className="hover:bg-slate-50/80 bg-slate-50/20">
                <td className="text-center font-bold text-slate-800 py-4 px-2 border-r border-slate-300 align-top bg-slate-50/40">
                  2
                </td>
                <td colSpan={2} className="p-4 sm:p-5">
                  <div className="mb-2 font-bold text-emerald-900 text-xs sm:text-sm border-b border-emerald-100 pb-1 flex justify-between items-center">
                    <span>{active.outlineMateri.subMateri2}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {countWords(active.isiMateri.subMateri2)}/300 kata
                    </span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedDoc.isiMateri.subMateri2}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          isiMateri: { ...editedDoc.isiMateri, subMateri2: e.target.value }
                        })
                      }
                      rows={6}
                      className="w-full p-3 border border-slate-300 rounded text-justify text-xs sm:text-sm leading-relaxed"
                    />
                  ) : (
                    <p className="text-justify leading-relaxed text-slate-800 indent-8">
                      {active.isiMateri.subMateri2}
                    </p>
                  )}
                </td>
              </tr>

              {/* Isi Sub-materi 3 */}
              <tr className="hover:bg-slate-50/80">
                <td className="text-center font-bold text-slate-800 py-4 px-2 border-r border-slate-300 align-top bg-slate-50/40">
                  3
                </td>
                <td colSpan={2} className="p-4 sm:p-5">
                  <div className="mb-2 font-bold text-emerald-900 text-xs sm:text-sm border-b border-emerald-100 pb-1 flex justify-between items-center">
                    <span>{active.outlineMateri.subMateri3}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {countWords(active.isiMateri.subMateri3)}/300 kata
                    </span>
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedDoc.isiMateri.subMateri3}
                      onChange={(e) =>
                        setEditedDoc({
                          ...editedDoc,
                          isiMateri: { ...editedDoc.isiMateri, subMateri3: e.target.value }
                        })
                      }
                      rows={6}
                      className="w-full p-3 border border-slate-300 rounded text-justify text-xs sm:text-sm leading-relaxed"
                    />
                  ) : (
                    <p className="text-justify leading-relaxed text-slate-800 indent-8">
                      {active.isiMateri.subMateri3}
                    </p>
                  )}
                </td>
              </tr>

              {/* =========================================
                  BAGIAN E. SESI DISKUSI
                 ========================================= */}
              <tr className="bg-emerald-900 text-white">
                <th colSpan={3} className="px-4 py-2.5 font-bold uppercase tracking-wider text-xs sm:text-sm border-t-2 border-b border-emerald-950">
                  E. SESI DISKUSI (TANYA JAWAB BERDASARKAN SUB-MATERI)
                </th>
              </tr>
              {active.sesiDiskusi.map((diskusi, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="text-center font-bold text-slate-700 py-4 px-2 border-r border-slate-300 align-top bg-slate-50/40">
                    {idx + 1}
                  </td>
                  <td colSpan={2} className="p-4 sm:p-5 space-y-3">
                    <div className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded inline-block border border-emerald-200/80">
                      Topik Terkait: {diskusi.subMateriJudul}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-amber-800 uppercase">
                            Pertanyaan Peserta ({diskusi.penanya || 'Peserta'}):
                          </label>
                          <textarea
                            value={editedDoc.sesiDiskusi[idx]?.pertanyaan || ''}
                            onChange={(e) => {
                              const newDiskusi = [...editedDoc.sesiDiskusi];
                              newDiskusi[idx] = { ...newDiskusi[idx], pertanyaan: e.target.value };
                              setEditedDoc({ ...editedDoc, sesiDiskusi: newDiskusi });
                            }}
                            rows={2}
                            className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm text-justify"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-emerald-800 uppercase">
                            Jawaban Narasumber / Pengawas:
                          </label>
                          <textarea
                            value={editedDoc.sesiDiskusi[idx]?.jawaban || ''}
                            onChange={(e) => {
                              const newDiskusi = [...editedDoc.sesiDiskusi];
                              newDiskusi[idx] = { ...newDiskusi[idx], jawaban: e.target.value };
                              setEditedDoc({ ...editedDoc, sesiDiskusi: newDiskusi });
                            }}
                            rows={3}
                            className="w-full p-2 border border-slate-300 rounded text-xs sm:text-sm text-justify"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/60 text-justify">
                          <span className="font-bold text-amber-900 text-xs sm:text-sm block mb-1">
                            Pertanyaan ({diskusi.penanya || 'Peserta Pembinaan'}):
                          </span>
                          <p className="italic text-slate-800 text-xs sm:text-sm leading-relaxed">
                            "{diskusi.pertanyaan}"
                          </p>
                        </div>

                        <div className="bg-emerald-50/40 p-3 rounded-lg border border-emerald-200/60 text-justify">
                          <span className="font-bold text-emerald-950 text-xs sm:text-sm block mb-1">
                            Jawaban Narasumber:
                          </span>
                          <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                            {diskusi.jawaban}
                          </p>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}

              {/* =========================================
                  BAGIAN F. KESIMPULAN DAN TINDAK LANJUT
                 ========================================= */}
              <tr className="bg-emerald-900 text-white">
                <th colSpan={3} className="px-4 py-2.5 font-bold uppercase tracking-wider text-xs sm:text-sm border-t-2 border-b border-emerald-950">
                  <div className="flex items-center justify-between">
                    <span>F. KESIMPULAN DAN TINDAK LANJUT</span>
                    <span className="text-[11px] font-normal text-emerald-200">
                      (Maksimal 150 Kata • {countWords(active.kesimpulanTindakLanjut)} kata)
                    </span>
                  </div>
                </th>
              </tr>
              <tr>
                <td colSpan={3} className="p-4 sm:p-5 bg-white">
                  {isEditing ? (
                    <div className="space-y-1">
                      <textarea
                        value={editedDoc.kesimpulanTindakLanjut}
                        onChange={(e) =>
                          setEditedDoc({ ...editedDoc, kesimpulanTindakLanjut: e.target.value })
                        }
                        rows={5}
                        className="w-full p-3 border border-slate-300 rounded-lg text-justify text-xs sm:text-sm leading-relaxed"
                      />
                      <div className="text-right text-xs text-slate-500">
                        Kata: {countWords(editedDoc.kesimpulanTindakLanjut)} / maks 150 kata
                      </div>
                    </div>
                  ) : (
                    <p className="text-justify leading-relaxed text-slate-800 indent-8">
                      {active.kesimpulanTindakLanjut}
                    </p>
                  )}
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* TANDA TANGAN / SIGNATURE BLOCK (2 COLUMNS: KIRI BAWAH & KANAN BAWAH) */}
        <div className="mt-10 pt-6 grid grid-cols-2 gap-8 text-xs sm:text-sm break-inside-avoid">
          
          {/* Pojok Kiri Bawah: Nama Ketua Pokjawas & NIP */}
          <div className="text-left flex flex-col justify-between space-y-16">
            <div>
              <p className="text-slate-700">Mengetahui,</p>
              <p className="font-bold text-slate-900 uppercase">
                Ketua Pokjawas PAI,
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900 underline text-sm sm:text-base">
                {idt.namaKetuaPokjawas || '(..................................................)'}
              </p>
              <p className="text-slate-700 text-xs mt-0.5">
                NIP. {idt.nipKetuaPokjawas || '...........................................'}
              </p>
            </div>
          </div>

          {/* Pojok Kanan Bawah: Nama Pengawas PAI & NIP */}
          <div className="text-left flex flex-col justify-between space-y-16">
            <div>
              <p className="text-slate-700">
                {idt.kotaKabupaten || 'Ditetapkan'}, {idt.hariTanggal || '........................'}
              </p>
              <p className="font-bold text-slate-900 uppercase">
                Pengawas PAI Pembina,
              </p>
            </div>
            <div>
              <p className="font-bold text-slate-900 underline text-sm sm:text-base">
                {idt.namaPengawasPAI || '(..................................................)'}
              </p>
              <p className="text-slate-700 text-xs mt-0.5">
                NIP. {idt.nipPengawasPAI || '...........................................'}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Quick guidance below the sheet */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3 print:hidden">
        <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-emerald-950">
            Kiat Pengawas PAI:
          </p>
          <p className="leading-relaxed">
            Format spreadsheet di atas telah disesuaikan dengan regulasi pembinaan pengawas Kementerian Agama. Saat mencetak (PDF/Printer), tabel akan otomatis menyesuaikan batas halaman kertas A4 dengan kerapian rata kanan-kiri yang presisi. Anda juga dapat mengunduh format <strong>Word (.docx)</strong> untuk penggabungan langsung ke bundel Laporan Pengawasan semesteran.
          </p>
        </div>
      </div>

    </div>
  );
};
