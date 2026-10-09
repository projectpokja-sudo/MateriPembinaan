import { RingkasanMateriDoc, PengawasProfile, DEFAULT_PROFILE, ASPEK_MASALAH_OPTIONS } from '../types';

const PROFILE_KEY = 'pengawas_pai_profile_v1';
const HISTORY_KEY = 'pengawas_pai_history_v1';

export function getProfile(): PengawasProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading profile:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: PengawasProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile:', e);
  }
}

export function getHistory(): RingkasanMateriDoc[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading history:', e);
  }
  return [createSampleDoc()];
}

export function saveDocToHistory(doc: RingkasanMateriDoc): RingkasanMateriDoc[] {
  try {
    const current = getHistory();
    const existingIndex = current.findIndex((item) => item.id === doc.id);
    let updated: RingkasanMateriDoc[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...doc, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...doc, updatedAt: new Date().toISOString() }, ...current];
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving document:', e);
    return [];
  }
}

export function deleteDocFromHistory(id: string): RingkasanMateriDoc[] {
  try {
    const current = getHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting document:', e);
    return [];
  }
}

export function createSampleDoc(): RingkasanMateriDoc {
  const profile = DEFAULT_PROFILE;
  return {
    id: 'sample-doc-01',
    title: 'Pembinaan Desain Modul Ajar Mendalam dan Diferensiasi PAI',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    identitas: {
      aspekMasalah: ASPEK_MASALAH_OPTIONS[0],
      namaKegiatan: 'Workshop Pengawasan Akademik: Perancangan Modul Ajar PAI Berorientasi Pemahaman Mendalam',
      hariTanggal: 'Kamis, 15 Oktober 2026',
      waktu: '08.30 - 12.30 WIB',
      narasumber: `${profile.namaPengawasPAI} (Pengawas PAI Kemenag)`,
      jumlahPeserta: '28 Orang Guru PAI SD/SMP Binaan',
      satuanPendidikan: 'Wilayah Binaan Gugus III KKG PAI Kecamatan Depok',
      namaKetuaPokjawas: profile.namaKetuaPokjawas,
      nipKetuaPokjawas: profile.nipKetuaPokjawas,
      namaPengawasPAI: profile.namaPengawasPAI,
      nipPengawasPAI: profile.nipPengawasPAI,
      kotaKabupaten: profile.kotaKabupaten,
      jenjang: 'SD & SMP'
    },
    pendahuluan: 'Pembinaan pengawasan akademik ini dilaksanakan sebagai tindak lanjut atas temuan supervisi klinis di sekolah binaan, di mana sebagian besar guru PAI masih menghadapi hambatan konseptual dalam merancang modul ajar yang memfasilitasi pemahaman mendalam. Dokumen perencanaan pembelajaran yang disusun guru saat ini cenderung sarat dengan beban administratif dan penuntasan keluasan materi belaka, sehingga esensi pencapaian kompetensi esensial serta penghayatan nilai-nilai akidah, syariah, dan akhlak kurang tereksplorasi secara optimal. Melalui pembinaan terstruktur ini, Pengawas PAI memfasilitasi rekonstruksi paradigma perencanaan agar pendidik mampu merumuskan tujuan pembelajaran yang bermakna, kontekstual, dan berdampak nyata bagi pembentukan budi pekerti peserta didik di era transformasi pendidikan.',
    outlineMateri: {
      subMateri1: 'Prinsip Reorientasi Modul Ajar: Menyeimbangkan Substansi Esensial dan Pemahaman Bermakna',
      subMateri2: 'Teknik Perumusan Pertanyaan Pemantik, Alur Tujuan, dan Desain Aktivitas Diferensiasi',
      subMateri3: 'Strategi Asesmen Autentik Berkelanjutan dan Refleksi Kualitas Pemahaman Murid'
    },
    isiMateri: {
      subMateri1: 'Narasumber mengawali uraian dengan mendekonstruksi kekeliruan umum dalam penyusunan modul ajar PAI, di mana guru sering terjebak menyalin format tanpa menganalisis Capaian Pembelajaran (CP) secara mendalam. Pemateri menekankan pentingnya konsep backward design, dimulai dari menetapkan bukti pemahaman apa yang ingin dicapai sebelum merancang kegiatan. Guru diarahkan untuk memilah konsep kunci (essential core) dari materi pelengkap, sehingga beban materi yang terlalu padat dapat direduksi demi memberikan ruang dialogis, tadabbur, dan perenungan dalil naqli secara kontekstual dengan tahap usia perkembangan psikologis anak.',
      subMateri2: 'Pada sesi kedua, pemateri membimbing langkah operasional merumuskan pertanyaan pemantik (essential questions) yang mampu membangkitkan rasa ingin tahu spiritual dan nalar kritis siswa. Disajikan contoh konkret penyusunan modul ajar berdiferensiasi konten, proses, dan produk pada rumpun materi Fikih dan Al-Qur\'an Hadis. Narasumber menegaskan bahwa diferensiasi tidak berarti membuat rencana pembelajaran yang terpisah-pisah secara rumit, melainkan menyediakan pilihan jalur belajar dan scaffolding yang fleksibel agar setiap anak dengan keragaman latar belakang religiositas keluarga dapat mencapai kompetensi dasar secara adil dan menyenangkan.',
      subMateri3: 'Bagian akhir materi mengupas integrasi asesmen formatif sebagai instrumen refleksi langsung kualitas pemahaman murid. Narasumber memperagakan rubrik unjuk kerja, lembar observasi sikap religius, dan penilaian antarteman (peer-assessment) yang mudah dipraktikkan tanpa membebani administrasi guru. Ditekankan bahwa keberhasilan pembelajaran PAI tidak diukur semata dari skor kognitif ujian sumatif, melainkan dari konsistensi pengamalan adab sehari-hari. Guru diajak menyusun rencana tindak lanjut mandiri untuk merevisi modul ajar masing-masing sebelum jadwal supervisi tindak lanjut di kelas binaan.'
    },
    sesiDiskusi: [
      {
        subMateriId: 1,
        subMateriJudul: 'Prinsip Reorientasi Modul Ajar: Menyeimbangkan Substansi Esensial dan Pemahaman Bermakna',
        pertanyaan: 'Bagaimana cara meyakinkan pihak kepala sekolah atau kurikulum sekolah jika modul ajar kami lebih ringkas dan fokus pada materi esensial, padahal instrumen monev sering menuntut kelengkapan ratusan halaman?',
        penanya: 'Ustadzah Nurul Hidayah, S.Pd.I (Guru PAI SDN 1 Caturtunggal)',
        jawaban: 'Pengawas PAI telah berkoordinasi dengan MKKS dan KKKS bahwa standar Kurikulum Merdeka mengutamakan kemerdekaan esensi daripada ketebalan kertas. Guru berhak menyajikan modul ringkas namun sarat makna. Dokumen ringkasan materi dan pengesahan dari Pengawas PAI ini dapat menjadi rujukan legal legitimasi inovasi pembelajaran bapak/ibu di sekolah.'
      },
      {
        subMateriId: 2,
        subMateriJudul: 'Teknik Perumusan Pertanyaan Pemantik, Alur Tujuan, dan Desain Aktivitas Diferensiasi',
        pertanyaan: 'Di kelas kami kemampuan baca Al-Qur\'an sangat jomplang antara lulusan TPA dan yang belum mengenal huruf hijaiyah. Bagaimana mendesain diferensiasinya tanpa menimbulkan perasaan minder?',
        penanya: 'Bapak Ahmad Faisal, M.Pd.I (Guru PAI SMP Negeri 2 Depok)',
        jawaban: 'Gunakan diferensiasi proses melalui metode tutor sebaya (peer tutoring) dengan pembagian kelompok kooperatif berazas ukhuwah. Bagi anak yang mahir diberi tugas pendalaman makna dan tajwid lanjut, sedangkan yang baru mengenal huruf dibimbing dengan media kartu huruf taktil dan bimbingan terfokus. Hindari memberi label kepandaian secara terbuka.'
      },
      {
        subMateriId: 3,
        subMateriJudul: 'Strategi Asesmen Autentik Berkelanjutan dan Refleksi Kualitas Pemahaman Murid',
        pertanyaan: 'Bagaimana membuktikan perubahan sikap spiritual anak secara sahih di hadapan wali murid jika kami tidak menggunakan ujian angka hafalan konvensional?',
        penanya: 'Ibu Fatimah Zahra, S.Ag (Guru PAI SDN 2 Condongcatur)',
        jawaban: 'Gunakan portofolio jurnal pembiasaan adab harian berkolaborasi dengan orang tua melalui lembar refleksi mingguan dan catatan anekdot guru. Ketika orang tua melihat deskripsi kualitatif tentang kebiasaan shalat, kejujuran, dan kesantunan anak di rumah, mereka akan jauh lebih mengapresiasi dibanding angka rapor semata.'
      }
    ],
    kesimpulanTindakLanjut: 'Kegiatan pembinaan ini berhasil meningkatkan pemahaman dan keterampilan guru PAI dalam mereduksi beban administratif serta berfokus pada desain pembelajaran yang memfasilitasi pemahaman mendalam. Seluruh peserta telah menyepakati penyederhanaan modul ajar dengan memasukkan pertanyaan pemantik kontekstual dan diferensiasi praktis. Sebagai rencana tindak lanjut, dalam kurun waktu 14 hari ke depan setiap guru PAI wajib mengunggah satu draf Modul Ajar hasil perbaikan ke Google Drive KKG untuk mendapatkan reviu pendampingan klinis dari Pengawas PAI sebelum diverifikasi dan diterapkan pada semester berjalan.'
  };
}
