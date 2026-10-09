import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Settings2, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  BookmarkCheck,
  HelpCircle,
  FileCheck,
  Lightbulb,
  ListOrdered,
  MessageSquare,
  ClipboardList
} from 'lucide-react';
import { 
  IdentitasKegiatan, 
  RingkasanMateriDoc, 
  ASPEK_MASALAH_OPTIONS, 
  PengawasProfile 
} from '../types';

interface GeneratorFormProps {
  currentDoc: RingkasanMateriDoc;
  profile: PengawasProfile;
  onDocGenerated: (newDoc: RingkasanMateriDoc) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  onViewDocument: () => void;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  currentDoc,
  profile,
  onDocGenerated,
  isGenerating,
  setIsGenerating,
  onViewDocument,
}) => {
  const [identitas, setIdentitas] = useState<IdentitasKegiatan>({
    aspekMasalah: currentDoc.identitas.aspekMasalah || ASPEK_MASALAH_OPTIONS[0],
    aspekMasalahCustom: currentDoc.identitas.aspekMasalahCustom || '',
    namaKegiatan: currentDoc.identitas.namaKegiatan || 'Pembinaan Pengawasan Akademik Guru PAI',
    hariTanggal: currentDoc.identitas.hariTanggal || 'Kamis, 15 Oktober 2026',
    waktu: currentDoc.identitas.waktu || '08.30 - 12.00 WIB',
    narasumber: currentDoc.identitas.narasumber || `${profile.namaPengawasPAI} (Pengawas PAI)`,
    jumlahPeserta: currentDoc.identitas.jumlahPeserta || '24 Orang Guru PAI',
    satuanPendidikan: currentDoc.identitas.satuanPendidikan || profile.satuanPendidikanDefault,
    namaKetuaPokjawas: profile.namaKetuaPokjawas,
    nipKetuaPokjawas: profile.nipKetuaPokjawas,
    namaPengawasPAI: profile.namaPengawasPAI,
    nipPengawasPAI: profile.nipPengawasPAI,
    kotaKabupaten: profile.kotaKabupaten,
    jenjang: currentDoc.identitas.jenjang || 'SD & SMP',
  });

  const [customNotes, setCustomNotes] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'input' | 'previewSections'>('input');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<number>(0);

  const isCustomMasalah = identitas.aspekMasalah === 'Lainnya (Isi Sendiri)';

  // Quick Preset Titles based on Aspek Masalah
  const handleSelectAspek = (aspek: string) => {
    let suggestedTitle = 'Pembinaan Pengawasan Akademik Guru PAI';
    if (aspek.includes('Modul Ajar')) {
      suggestedTitle = 'Workshop Reorientasi Perancangan Modul Ajar PAI Berorientasi Pemahaman Mendalam';
    } else if (aspek.includes('realitas kehidupan nyata')) {
      suggestedTitle = 'Pendampingan Kontekstualisasi Capaian Pembelajaran PAI dalam Pengamalan Kehidupan Nyata Murid';
    } else if (aspek.includes('diferensiasi')) {
      suggestedTitle = 'Bimbingan Teknis Desain Pembelajaran PAI Berdiferensiasi Proses dan Produk';
    } else if (aspek.includes('HOTS')) {
      suggestedTitle = 'Peningkatan Kualitas Pembelajaran Aktif Berorientasi Keterampilan Berpikir Tingkat Tinggi (HOTS) Guru PAI';
    } else if (aspek.includes('instrumen asesmen')) {
      suggestedTitle = 'Pelatihan Perumusan Instrumen Asesmen Formatif & Sikap Spiritual-Sosial yang Sahih';
    } else if (aspek.includes('tindak lanjut hasil asesmen')) {
      suggestedTitle = 'Supervisi Klinis Perumusan Program Remedial, Pengayaan, dan Tindak Lanjut Asesmen PAI';
    } else if (aspek.includes('platform digital')) {
      suggestedTitle = 'Workshop Pemanfaatan Platform Digital (Smart PAI & Canva) dalam Ekosistem Pembelajaran PAI';
    } else if (aspek.includes('karya ilmiah')) {
      suggestedTitle = 'Klinik Penulisan Penelitian Tindakan Kelas (PTK) dan Publikasi Ilmiah bagi Guru PAI';
    }

    setIdentitas((prev) => ({
      ...prev,
      aspekMasalah: aspek,
      namaKegiatan: suggestedTitle,
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGenerating(true);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch('/api/generate-ringkasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identitas: {
            ...identitas,
            aspekMasalahCustom: isCustomMasalah ? identitas.aspekMasalahCustom : undefined,
          },
          customNotes,
        }),
      });

      const resData = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Gagal menghasilkan dokumen pembinaan.');
      }

      const generated = resData.data;

      const newDoc: RingkasanMateriDoc = {
        id: `doc-${Date.now()}`,
        title: identitas.namaKegiatan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        identitas: {
          ...identitas,
          aspekMasalahCustom: isCustomMasalah ? identitas.aspekMasalahCustom : undefined,
        },
        pendahuluan: generated.pendahuluan,
        outlineMateri: generated.outlineMateri,
        isiMateri: generated.isiMateri,
        sesiDiskusi: generated.sesiDiskusi,
        kesimpulanTindakLanjut: generated.kesimpulanTindakLanjut,
        notes: customNotes,
      };

      onDocGenerated(newDoc);
      setSuccessMessage('Dokumen Ringkasan Materi Pembinaan berhasil disusun dan siap diekspor!');
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error(err);
      setErrorMessage(err.message || 'Terjadi gangguan saat memproses dokumen.');
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  // Sync profile when profile prop changes
  const handleApplyProfileData = () => {
    setIdentitas((prev) => ({
      ...prev,
      narasumber: `${profile.namaPengawasPAI} (Pengawas PAI)`,
      namaKetuaPokjawas: profile.namaKetuaPokjawas,
      nipKetuaPokjawas: profile.nipKetuaPokjawas,
      namaPengawasPAI: profile.namaPengawasPAI,
      nipPengawasPAI: profile.nipPengawasPAI,
      kotaKabupaten: profile.kotaKabupaten,
      satuanPendidikan: profile.satuanPendidikanDefault,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden border border-emerald-700/60">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Supervised Assistant • Sesuai Standar POKJAWAS PAI</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight font-serif text-white">
            Formulir Ringkasan Materi Pembinaan
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Pilih Aspek Masalah dan masukkan Identitas Kegiatan. AI akan secara otomatis menyusun narasi dokumen lengkap: Pendahuluan (maks 150 kata), Outline Materi (3 Sub-materi), Isi Materi (maks 300 kata per Sub), Sesi Diskusi (3 Q&A), serta Kesimpulan & Tindak Lanjut dalam format tabel spreadsheet resmi.
          </p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('input')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'input'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1. Input Identitas Kegiatan</span>
        </button>
        <button
          onClick={() => setActiveTab('previewSections')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'previewSections'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>2. Tinjau Struktur 6 Bagian Wajib</span>
        </button>
      </div>

      {activeTab === 'input' ? (
        <form onSubmit={handleGenerate} className="space-y-6">
          
          {/* Section 1: Aspek / Masalah (Dropdown Wajib) */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">
                  A
                </span>
                <span>Aspek / Masalah Pembinaan Guru PAI (Wajib Dipilih)</span>
              </label>
              <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Pilih dari 8 Opsi Standar Kemenag
              </span>
            </div>

            <div className="space-y-3">
              <select
                value={identitas.aspekMasalah}
                onChange={(e) => handleSelectAspek(e.target.value)}
                className="w-full p-3 sm:p-3.5 border border-slate-300 rounded-xl bg-slate-50/50 text-slate-800 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all leading-relaxed"
              >
                {ASPEK_MASALAH_OPTIONS.map((aspek, idx) => (
                  <option key={idx} value={aspek}>
                    {idx + 1}. {aspek}
                  </option>
                ))}
              </select>

              {/* If Lainnya selected */}
              {isCustomMasalah && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tuliskan Aspek / Masalah Khusus:
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Contoh: Guru PAI mengalami kesulitan dalam mengintegrasikan moderasi beragama dan materi toleransi pada topik Sejarah Kebudayaan Islam..."
                    value={identitas.aspekMasalahCustom}
                    onChange={(e) =>
                      setIdentitas({ ...identitas, aspekMasalahCustom: e.target.value })
                    }
                    className="w-full p-3 border border-amber-300 rounded-xl bg-amber-50/30 text-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                </div>
              )}

              {/* Quick Preset Buttons for rapid selection */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Pilihan Cepat Masalah Populer:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectAspek(ASPEK_MASALAH_OPTIONS[0])}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      identitas.aspekMasalah === ASPEK_MASALAH_OPTIONS[0]
                        ? 'bg-emerald-800 text-white border-emerald-900 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    1. Modul Ajar Mendalam
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAspek(ASPEK_MASALAH_OPTIONS[1])}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      identitas.aspekMasalah === ASPEK_MASALAH_OPTIONS[1]
                        ? 'bg-emerald-800 text-white border-emerald-900 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    2. Kontekstual CP & Nyata
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAspek(ASPEK_MASALAH_OPTIONS[2])}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      identitas.aspekMasalah === ASPEK_MASALAH_OPTIONS[2]
                        ? 'bg-emerald-800 text-white border-emerald-900 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    3. Diferensiasi PAI
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAspek(ASPEK_MASALAH_OPTIONS[3])}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      identitas.aspekMasalah === ASPEK_MASALAH_OPTIONS[3]
                        ? 'bg-emerald-800 text-white border-emerald-900 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    4. HOTS & Pembelajaran Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAspek(ASPEK_MASALAH_OPTIONS[4])}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      identitas.aspekMasalah === ASPEK_MASALAH_OPTIONS[4]
                        ? 'bg-emerald-800 text-white border-emerald-900 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    5. Asesmen Sikap Sahih
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAspek(ASPEK_MASALAH_OPTIONS[6])}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      identitas.aspekMasalah === ASPEK_MASALAH_OPTIONS[6]
                        ? 'bg-emerald-800 text-white border-emerald-900 font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                  >
                    7. Platform Smart PAI / Digital
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Detail Identitas Kegiatan */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">
                  B
                </span>
                <span>Rincian Waktu, Tempat, & Partisipan Kegiatan</span>
              </h3>
              <button
                type="button"
                onClick={handleApplyProfileData}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 hover:underline"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Gunakan Data Profil Pengawas</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nama Kegiatan */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kegiatan Pembinaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={identitas.namaKegiatan}
                  onChange={(e) => setIdentitas({ ...identitas, namaKegiatan: e.target.value })}
                  placeholder="Contoh: Workshop Pengawasan Akademik Penguatan Modul Ajar PAI..."
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>

              {/* Hari / Tanggal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Hari / Tanggal <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={identitas.hariTanggal}
                  onChange={(e) => setIdentitas({ ...identitas, hariTanggal: e.target.value })}
                  placeholder="Contoh: Kamis, 15 Oktober 2026"
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Waktu */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Waktu Pelaksanaan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={identitas.waktu}
                  onChange={(e) => setIdentitas({ ...identitas, waktu: e.target.value })}
                  placeholder="Contoh: 08.30 - 12.00 WIB"
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Narasumber */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Narasumber / Pemateri <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={identitas.narasumber}
                  onChange={(e) => setIdentitas({ ...identitas, narasumber: e.target.value })}
                  placeholder="Contoh: Pengawas PAI Pembina / Drs. H. Ahmad Marzuki, M.Pd.I"
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Jumlah Peserta */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Jumlah Peserta <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={identitas.jumlahPeserta}
                  onChange={(e) => setIdentitas({ ...identitas, jumlahPeserta: e.target.value })}
                  placeholder="Contoh: 24 Orang Guru PAI SD/SMP"
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Sasaran Wilayah / Satuan Pendidikan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sasaran / Wilayah Binaan
                </label>
                <input
                  type="text"
                  value={identitas.satuanPendidikan}
                  onChange={(e) =>
                    setIdentitas({ ...identitas, satuanPendidikan: e.target.value })
                  }
                  placeholder="Contoh: KKG PAI Gugus II Kecamatan Depok"
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Kota / Kabupaten */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kota / Kabupaten (Titimangsa Tanda Tangan)
                </label>
                <input
                  type="text"
                  value={identitas.kotaKabupaten}
                  onChange={(e) =>
                    setIdentitas({ ...identitas, kotaKabupaten: e.target.value })
                  }
                  placeholder="Contoh: Kabupaten Sleman"
                  className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

            </div>
          </div>

          {/* Section 3: Data Pejabat Penandatangan */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">
                C
              </span>
              <span>Data Penandatangan Dokumen Resmi (Pojok Kiri & Kanan Bawah)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              
              {/* Kolom Kiri: Ketua Pokjawas */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-emerald-900">
                  Pojok Kiri Bawah: Ketua Pokjawas PAI
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Nama Lengkap & Gelar:
                  </label>
                  <input
                    type="text"
                    value={identitas.namaKetuaPokjawas}
                    onChange={(e) =>
                      setIdentitas({ ...identitas, namaKetuaPokjawas: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    NIP Ketua Pokjawas:
                  </label>
                  <input
                    type="text"
                    value={identitas.nipKetuaPokjawas}
                    onChange={(e) =>
                      setIdentitas({ ...identitas, nipKetuaPokjawas: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              {/* Kolom Kanan: Pengawas PAI Pembina */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="font-bold text-slate-800 text-xs uppercase tracking-wider text-emerald-900">
                  Pojok Kanan Bawah: Pengawas PAI Pembina
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Nama Lengkap & Gelar:
                  </label>
                  <input
                    type="text"
                    value={identitas.namaPengawasPAI}
                    onChange={(e) =>
                      setIdentitas({ ...identitas, namaPengawasPAI: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    NIP Pengawas PAI:
                  </label>
                  <input
                    type="text"
                    value={identitas.nipPengawasPAI}
                    onChange={(e) =>
                      setIdentitas({ ...identitas, nipPengawasPAI: e.target.value })
                    }
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 4: Catatan Khusus untuk AI (Opsional) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Catatan Khusus Pengawasan (Opsional untuk Penyesuaian AI)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                Bisa dikosongkan
              </span>
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Contoh: Fokuskan contoh pada jenjang SD Fase B (Kelas 4) materi Zakat dan Sedekah..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <span className="font-medium">{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={onViewDocument}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold text-xs hover:bg-emerald-700 transition-all flex items-center gap-1"
              >
                <span>Buka Dokumen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* GENERATE BUTTON & PROGRESS */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 hover:from-emerald-900 hover:to-teal-900 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 active:scale-[0.99] border border-emerald-600/40"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AI Sedang Menyusun Dokumen Pembinaan Pengawas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>SUSUN RINGKASAN MATERI PEMBINAAN DENGAN AI</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              Proses AI menghasilkan 6 bagian dokumen sesuai standar kata dan format spreadsheet resmi Kementerian Agama.
            </p>
          </div>

          {/* Interactive Loading Steps Indicator */}
          {isGenerating && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" />
                <span>Tahapan Penyusunan Dokumen AI:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className={`p-2 rounded-lg flex items-center gap-2 ${generationStep >= 1 ? 'bg-emerald-100 text-emerald-900 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${generationStep >= 1 ? 'text-emerald-700' : 'text-slate-300'}`} />
                  <span>1. Analisis Aspek Masalah & Pendahuluan (≤150 kata)</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center gap-2 ${generationStep >= 2 ? 'bg-emerald-100 text-emerald-900 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${generationStep >= 2 ? 'text-emerald-700' : 'text-slate-300'}`} />
                  <span>2. Perumusan 3 Kerangka Outline Materi</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center gap-2 ${generationStep >= 3 ? 'bg-emerald-100 text-emerald-900 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${generationStep >= 3 ? 'text-emerald-700' : 'text-slate-300'}`} />
                  <span>3. Uraian Isi 3 Sub-Materi (≤300 kata per Sub)</span>
                </div>
                <div className={`p-2 rounded-lg flex items-center gap-2 ${generationStep >= 4 ? 'bg-emerald-100 text-emerald-900 font-medium' : 'text-slate-400'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${generationStep >= 4 ? 'text-emerald-700' : 'text-slate-300'}`} />
                  <span>4. Simulasi Tanya Jawab & Kesimpulan Tindak Lanjut</span>
                </div>
              </div>
            </div>
          )}

        </form>
      ) : (
        /* Tab 2: Overview of the 6 mandatory sections */
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Format 6 Bagian Utama Ringkasan Materi Pembinaan
              </h3>
              <p className="text-xs text-slate-500">
                Sesuai ketentuan baku dokumen Laporan Pembinaan Pengawas PAI Kementerian Agama
              </p>
            </div>
            <button
              onClick={onViewDocument}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <span>Lihat di Tabel Spreadsheet</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            
            {/* 1. Identitas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">1</span>
                  A. Identitas Kegiatan
                </span>
                <span className="text-[11px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">Otomatis dari Input</span>
              </div>
              <p className="text-slate-600 text-xs">
                Memuat Aspek/Masalah, Nama Kegiatan, Hari/Tanggal, Waktu, Narasumber, Jumlah Peserta, dan Satuan Pendidikan.
              </p>
            </div>

            {/* 2. Pendahuluan */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">2</span>
                  B. Pendahuluan
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">Maksimal 150 Kata • Justified</span>
              </div>
              <p className="text-slate-600 text-xs">
                Penjelasan singkat mengapa pembinaan ini dilakukan berdasarkan Aspek Masalah yang dihadapi guru PAI di lapangan. Dibuat tepat 1 paragraf.
              </p>
            </div>

            {/* 3. Outline */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">3</span>
                  C. Outline Materi
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">Tepat 3 Sub-Materi</span>
              </div>
              <p className="text-slate-600 text-xs">
                Kerangka atau garis besar topik bahasan sebelum masuk ke penjelasan detail: [Sub-materi 1], [Sub-materi 2], dan [Sub-materi 3].
              </p>
            </div>

            {/* 4. Isi Materi */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">4</span>
                  D. Isi Materi
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">Maksimal 300 Kata / Paragraf</span>
              </div>
              <p className="text-slate-600 text-xs">
                Uraian inti atau konsep penting yang disampaikan pemateri dengan mengembangkan masing-masing Sub-materi dalam 1 paragraf ringkas dan berbobot.
              </p>
            </div>

            {/* 5. Sesi Diskusi */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">5</span>
                  E. Sesi Diskusi
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">3 Pasang Pertanyaan & Jawaban</span>
              </div>
              <p className="text-slate-600 text-xs">
                Pertanyaan realistis dari peserta pembinaan dan jawaban solutif serta taktis dari pemateri / Pengawas PAI untuk setiap Sub-materi.
              </p>
            </div>

            {/* 6. Kesimpulan & Tindak Lanjut */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-xs flex items-center justify-center">6</span>
                  F. Kesimpulan dan Tindak Lanjut
                </span>
                <span className="text-[11px] bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-semibold">Maksimal 150 Kata • Justified</span>
              </div>
              <p className="text-slate-600 text-xs">
                Intisari pembinaan serta komitmen rencana tindak lanjut (RTL) terukur yang akan dilaksanakan Pengawas bersama guru PAI.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
