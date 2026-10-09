import React from 'react';
import { 
  FolderClock, 
  Trash2, 
  ExternalLink, 
  Download, 
  Calendar, 
  Plus, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { RingkasanMateriDoc } from '../types';
import { exportRingkasanToDocx } from '../utils/docxExport';

interface HistoryManagerProps {
  history: RingkasanMateriDoc[];
  currentDocId: string;
  onSelectDoc: (doc: RingkasanMateriDoc) => void;
  onDeleteDoc: (id: string) => void;
  onCreateNew: () => void;
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({
  history,
  currentDocId,
  onSelectDoc,
  onDeleteDoc,
  onCreateNew,
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FolderClock className="w-5 h-5 text-emerald-700" />
            <span>Riwayat Dokumen Pembinaan</span>
          </h2>
          <p className="text-xs text-slate-500">
            Dokumen tersimpan otomatis di penyimpanan lokal peramban (Local Storage)
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Dokumen Baru</span>
        </button>
      </div>

      {/* Document List */}
      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Riwayat Dokumen</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Gunakan formulir generator untuk menyusun Ringkasan Materi Pembinaan Pengawas PAI pertama Anda.
          </p>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700"
          >
            Mulai Generator Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const isCurrent = item.id === currentDocId;
            const masalah = item.identitas.aspekMasalahCustom || item.identitas.aspekMasalah;
            const dateStr = item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : item.identitas.hariTanggal;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCurrent ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      Dokumen PAI
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-amber-600" />
                        Sedang Aktif
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                    {item.identitas.namaKegiatan}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-1 italic">
                    Aspek: {masalah}
                  </p>

                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                    <span>Narasumber: <strong>{item.identitas.narasumber}</strong></span>
                    <span>Peserta: <strong>{item.identitas.jumlahPeserta}</strong></span>
                    <span>Wilayah: <strong>{item.identitas.satuanPendidikan || item.identitas.kotaKabupaten}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={() => onSelectDoc(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-700 transition-all"
                    title="Buka Dokumen di Tabel Spreadsheet"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka</span>
                  </button>

                  <button
                    onClick={() => exportRingkasanToDocx(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-emerald-950 hover:bg-amber-300 transition-all"
                    title="Download Word (.docx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Word</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus dokumen "${item.identitas.namaKegiatan}" dari riwayat?`)) {
                        onDeleteDoc(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title="Hapus Dokumen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
