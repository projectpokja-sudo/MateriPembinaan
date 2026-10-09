import React from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  FolderClock, 
  UserCheck2, 
  HelpCircle, 
  FileCheck2,
  BookmarkCheck,
  ChevronRight,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { RingkasanMateriDoc } from '../types';

interface SidebarProps {
  activeView: 'form' | 'document' | 'history' | 'profile' | 'guidelines';
  setActiveView: (view: 'form' | 'document' | 'history' | 'profile' | 'guidelines') => void;
  isOpen: boolean;
  onClose: () => void;
  currentDoc: RingkasanMateriDoc;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  onClose,
  currentDoc,
  historyCount,
}) => {
  const navItems = [
    {
      id: 'document',
      label: 'Tabel Spreadsheet',
      sublabel: 'Output Dokumen Resmi (A-F)',
      icon: FileSpreadsheet,
      badge: 'Utama',
    },
    {
      id: 'form',
      label: 'Formulir Generator',
      sublabel: 'Input Data & Perintah AI',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      id: 'history',
      label: 'Riwayat Dokumen',
      sublabel: 'Tersimpan di Browser',
      icon: FolderClock,
      count: historyCount,
    },
    {
      id: 'profile',
      label: 'Profil Pengawas & Pokjawas',
      sublabel: 'Atur NIP & Data Default',
      icon: UserCheck2,
    },
    {
      id: 'guidelines',
      label: 'Bank Masalah & Panduan',
      sublabel: '8 Aspek Masalah PAI Kemenag',
      icon: HelpCircle,
    },
  ];

  // Calculate brief stats for the current document
  const countWords = (text: string) => text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const pendahuluanWords = countWords(currentDoc.pendahuluan);
  const isiWords1 = countWords(currentDoc.isiMateri.subMateri1);
  const isiWords2 = countWords(currentDoc.isiMateri.subMateri2);
  const isiWords3 = countWords(currentDoc.isiMateri.subMateri3);
  const kesimpulanWords = countWords(currentDoc.kesimpulanTindakLanjut);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed md:sticky top-0 md:top-20 z-40 h-full md:h-[calc(100vh-5rem)] w-72 bg-emerald-950 text-white flex flex-col justify-between border-r border-emerald-800/80 transition-transform duration-200 ease-in-out print:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          
          {/* Header section in sidebar */}
          <div className="pb-4 border-b border-emerald-800/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                  Panel Pengawasan
                </h2>
                <p className="text-sm font-bold text-white font-serif">
                  Pengawas PAI Kemenag
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider px-2 mb-2">
              Menu Dokumen
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as any);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-emerald-700/90 text-white shadow-md font-medium border-l-4 border-amber-400'
                      : 'text-emerald-100/90 hover:bg-emerald-900/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-amber-300' : 'text-emerald-400 group-hover:text-emerald-200'}`} />
                    <div className="truncate">
                      <div className="text-xs sm:text-sm font-medium leading-tight">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-emerald-300/70 truncate">
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-800 text-amber-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-800 text-emerald-200">
                        {item.count}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 text-emerald-400/50 group-hover:text-emerald-300 ${isActive ? 'opacity-100' : 'opacity-40'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Document Status Widget */}
          <div className="p-3.5 rounded-xl bg-emerald-900/50 border border-emerald-800/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Status Dokumen Aktif
              </span>
              <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-medium">
                Siap Unduh
              </span>
            </div>

            <div className="text-xs font-semibold text-white line-clamp-2 leading-snug">
              {currentDoc.identitas.namaKegiatan || 'Ringkasan Materi Pembinaan PAI'}
            </div>

            <div className="space-y-1.5 text-[11px] text-emerald-200/90 pt-1 border-t border-emerald-800/60">
              <div className="flex justify-between items-center">
                <span>Pendahuluan:</span>
                <span className={`font-mono font-medium ${pendahuluanWords > 150 ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {pendahuluanWords}/150 kata
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Isi Materi (3 Sub):</span>
                <span className="font-mono font-medium text-emerald-300">
                  {isiWords1 + isiWords2 + isiWords3} kata
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Sesi Diskusi:</span>
                <span className="font-mono font-medium text-emerald-300">
                  {currentDoc.sesiDiskusi.length} Tanya Jawab
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Kesimpulan:</span>
                <span className={`font-mono font-medium ${kesimpulanWords > 150 ? 'text-rose-300' : 'text-emerald-300'}`}>
                  {kesimpulanWords}/150 kata
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-emerald-800/80 bg-emerald-950/90 text-[11px] text-emerald-300/80">
          <div className="flex items-center justify-between">
            <span>Standar Kemenag RI</span>
            <span className="font-mono">v2.4</span>
          </div>
          <p className="mt-1 text-[10px] text-emerald-400/60">
            Format Resmi Laporan Pengawas PAI
          </p>
        </div>
      </aside>
    </>
  );
};
