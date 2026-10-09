import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  History, 
  UserCheck, 
  Sparkles, 
  Menu,
  BookOpen
} from 'lucide-react';
import { RingkasanMateriDoc } from '../types';
import { exportRingkasanToDocx } from '../utils/docxExport';

interface NavbarProps {
  currentDoc: RingkasanMateriDoc;
  onOpenNewModal: () => void;
  onToggleSidebar: () => void;
  onPrint: () => void;
  activeView: string;
  setActiveView: (view: 'form' | 'document' | 'history' | 'profile' | 'guidelines') => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDoc,
  onOpenNewModal,
  onToggleSidebar,
  onPrint,
  activeView,
  setActiveView,
  isGenerating
}) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadDocx = async () => {
    try {
      setDownloading(true);
      await exportRingkasanToDocx(currentDoc);
    } catch (error) {
      console.error('Failed to export DOCX:', error);
      alert('Gagal membuat dokumen Word. Silakan coba kembali.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-emerald-900 border-b border-emerald-800 text-white shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 md:hidden"
              aria-label="Buka Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-300/40">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    Kemenag RI • Pokjawas PAI
                  </span>
                </div>
                <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white leading-tight font-serif">
                  GENERATOR RINGKASAN MATERI PEMBINAAN
                </h1>
                <p className="hidden sm:block text-xs text-emerald-200/90 font-medium truncate max-w-xl">
                  Asisten Cerdas Pengawasan Akademik Guru PAI dan Budi Pekerti
                </p>
              </div>
            </div>
          </div>

          {/* Right: Primary Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Download Word Button */}
            <button
              onClick={handleDownloadDocx}
              disabled={downloading || isGenerating}
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-emerald-900 bg-amber-400 hover:bg-amber-300 transition-all shadow hover:shadow-md active:scale-95 disabled:opacity-50"
              title="Unduh dalam Format Microsoft Word (.docx)"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{downloading ? 'Memproses...' : 'Download Word'}</span>
              <span className="sm:hidden font-medium">Word</span>
            </button>

            {/* Cetak / PDF Button */}
            <button
              onClick={onPrint}
              disabled={isGenerating}
              className="inline-flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-700 transition-all border border-emerald-600/50 shadow-sm active:scale-95"
              title="Cetak langsung ke Printer atau Simpan sebagai PDF"
            >
              <Printer className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">Cetak / PDF</span>
              <span className="sm:hidden font-medium">Cetak</span>
            </button>

            {/* Quick Generator New */}
            <button
              onClick={() => setActiveView('form')}
              className={`inline-flex items-center space-x-1 px-2.5 py-2 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                activeView === 'form'
                  ? 'bg-emerald-700 text-white'
                  : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
              }`}
              title="Buka Formulir Pembuatan Dokumen"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="hidden md:inline">Form Input</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
