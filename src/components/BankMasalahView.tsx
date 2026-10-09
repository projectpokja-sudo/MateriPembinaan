import React from 'react';
import { HelpCircle, Sparkles, ArrowRight, BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import { ASPEK_MASALAH_OPTIONS } from '../types';

interface BankMasalahViewProps {
  onSelectMasalahAndGenerate: (aspek: string) => void;
}

export const BankMasalahView: React.FC<BankMasalahViewProps> = ({
  onSelectMasalahAndGenerate,
}) => {
  const problemDetails = [
    {
      index: 1,
      title: "Desain Modul Ajar Mendalam",
      aspek: ASPEK_MASALAH_OPTIONS[0],
      urgency: "Tinggi",
      kemenagContext: "Kurikulum Merdeka menuntut pemahaman bermakna (meaningful learning) dan backward design, bukan semata-mata menuntaskan materi secara administratif.",
      fokusMateri: "Prinsip pemilahan materi esensial, perumusan alur tujuan pembelajaran yang membumi, dan reduksi beban materi hafalan berlebih."
    },
    {
      index: 2,
      title: "Kontekstualisasi CP dengan Realitas Kehidupan",
      aspek: ASPEK_MASALAH_OPTIONS[1],
      urgency: "Sangat Tinggi",
      kemenagContext: "Pendidikan Agama Islam bukan sekadar pengetahuan kognitif, melainkan internalisasi akidah dan akhlak yang termanifestasi dalam tindakan nyata sehari-hari murid.",
      fokusMateri: "Penerapan pendekatan kontekstual (CTL), proyek penguatan profil pelajar, studi kasus akhlak pergaulan remaja, dan refleksi diri religius."
    },
    {
      index: 3,
      title: "Diferensiasi Proses dan Produk",
      aspek: ASPEK_MASALAH_OPTIONS[2],
      urgency: "Sedang",
      kemenagContext: "Murid memiliki keragaman latar belakang kemampuan membaca Al-Qur'an dan religiositas keluarga, sehingga butuh pemetaan diferensiasi tanpa diskriminasi.",
      fokusMateri: "Tutor sebaya dalam tahsin Al-Qur'an, variasi produk karya unjuk kerja PAI (poster, infografis, video tadabbur), serta scaffolding fleksibel."
    },
    {
      index: 4,
      title: "Pembelajaran Aktif Berorientasi HOTS",
      aspek: ASPEK_MASALAH_OPTIONS[3],
      urgency: "Tinggi",
      kemenagContext: "Dominasi ceramah monoton membuat siswa pasif dan mudah jenuh. Dibutuhkan model pembelajaran interaktif seperti Problem Based Learning dan Inquiry.",
      fokusMateri: "Simulasi model PBL fikih muamalah kontemporer, diskusi dilema moral syariah, dan perumusan pertanyaan pemantik tingkat tinggi."
    },
    {
      index: 5,
      title: "Asesmen Sikap Spiritual & Sosial yang Sahih",
      aspek: ASPEK_MASALAH_OPTIONS[4],
      urgency: "Tinggi",
      kemenagContext: "Banyak guru PAI terjebak memberi nilai sikap subjektif tanpa instrumen sahih karena rumitnya lembar observasi puluhan butir.",
      fokusMateri: "Pengembangan catatan anekdot ringkas, jurnal pembiasaan ibadah kolaboratif bersama orang tua, dan rubrik unjuk kerja akhlak autentik."
    },
    {
      index: 6,
      title: "Tindak Lanjut Hasil Asesmen",
      aspek: ASPEK_MASALAH_OPTIONS[5],
      urgency: "Sedang",
      kemenagContext: "Asesmen sering hanya berhenti sebagai nilai rapor tanpa ada intervensi tindak lanjut remedial maupun pengayaan yang terstruktur.",
      fokusMateri: "Klinik bimbingan belajar PAI, program akselerasi hafalan surat pendek, dan integrasi refleksi pembelajaran berkala."
    },
    {
      index: 7,
      title: "Pemanfaatan Platform Digital (Smart PAI & Canva)",
      aspek: ASPEK_MASALAH_OPTIONS[6],
      urgency: "Modern",
      kemenagContext: "Era digital menuntut guru PAI melek teknologi untuk mengakses ekosistem digital Kemenag (aplikasi Siaga, Smart PAI) dan media visual modern.",
      fokusMateri: "Optimalisasi akun Smart PAI Kemenag, pembuatan media ajar visual interaktif dengan Canva for Education, dan kuis gamifikasi materi PAI."
    },
    {
      index: 8,
      title: "Karya Ilmiah (PTK) & Publikasi Pengembangan Diri",
      aspek: ASPEK_MASALAH_OPTIONS[7],
      urgency: "Pengembangan Karier",
      kemenagContext: "Guru PAI membutuhkan karya inovasi dan Penelitian Tindakan Kelas (PTK) untuk kenaikan pangkat dan Pengembangan Keprofesian Berkelanjutan (PKB).",
      fokusMateri: "Sistematika proposal PTK praktis di kelas PAI, teknik penulisan artikel ilmiah populer di jurnal pendidikan, dan portofolio PKB."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5 text-emerald-800">
          <BookOpen className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-800 font-serif">
            Bank 8 Aspek Masalah Pengawasan Akademik Guru PAI
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Kumpulan 8 aspek masalah akademik pokok yang telah diinventarisir sesuai regulasi supervisi klinis Kementerian Agama RI dan Direktorat PAI. Klik tombol <strong>"Gunakan Masalah Ini"</strong> untuk langsung menyusun ringkasan materi pembinaannya.
        </p>
      </div>

      {/* Grid of Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problemDetails.map((item) => (
          <div
            key={item.index}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">
                  #{item.index}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  Prioritas: {item.urgency}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                "{item.aspek}"
              </p>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <p>
                  <strong className="text-emerald-950">Latar Masalah:</strong> {item.kemenagContext}
                </p>
                <p>
                  <strong className="text-emerald-950">Fokus Pembinaan:</strong> {item.fokusMateri}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectMasalahAndGenerate(item.aspek)}
              className="w-full mt-2 py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gunakan Masalah Ini di Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
