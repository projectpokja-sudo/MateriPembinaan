export interface IdentitasKegiatan {
  aspekMasalah: string;
  aspekMasalahCustom?: string;
  namaKegiatan: string;
  hariTanggal: string;
  waktu: string;
  narasumber: string;
  jumlahPeserta: string;
  satuanPendidikan?: string; // Wilayah Binaan / Gugus / Sekolah
  namaKetuaPokjawas: string;
  nipKetuaPokjawas: string;
  namaPengawasPAI: string;
  nipPengawasPAI: string;
  kotaKabupaten: string;
  jenjang?: string; // SD, SMP, SMA, SMK, atau Gabungan
}

export interface OutlineMateri {
  subMateri1: string;
  subMateri2: string;
  subMateri3: string;
}

export interface IsiMateri {
  subMateri1: string;
  subMateri2: string;
  subMateri3: string;
}

export interface SesiDiskusiItem {
  subMateriId: number;
  subMateriJudul: string;
  pertanyaan: string;
  penanya?: string;
  jawaban: string;
}

export interface RingkasanMateriDoc {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  identitas: IdentitasKegiatan;
  pendahuluan: string;
  outlineMateri: OutlineMateri;
  isiMateri: IsiMateri;
  sesiDiskusi: SesiDiskusiItem[];
  kesimpulanTindakLanjut: string;
  notes?: string;
}

export interface PengawasProfile {
  namaPengawasPAI: string;
  nipPengawasPAI: string;
  namaKetuaPokjawas: string;
  nipKetuaPokjawas: string;
  kotaKabupaten: string;
  satuanPendidikanDefault: string;
}

export const ASPEK_MASALAH_OPTIONS = [
  "Guru kesulitan merancang Modul Ajar PAI yang memfasilitasi pemahaman mendalam, Rencana Pembelajaran cenderung padat materi (tuntutan administratif) daripada kualitas pemahaman murid",
  "Guru belum mampu menghubungkan kompetensi PAI dalam CP dengan realitas kehidupan nyata anak, sehingga tujuan pembelajaran masih terkonsentrasi pada pengetahuan dan belum berdampak nyata dalam penghayatan dan pengamalan dalam kehidupan sehari-hari",
  "Desain aktivitas belajar dalam dokumen perencanaan masih monoton (didominasi ceramah/hafalan hafalan jangka pendek), belum memetakan diferensiasi proses/produk",
  "Proses pembelajaran di kelas masih dominan menggunakan metode ceramah (monoton) dan belum menerapkan model pembelajaran aktif berorientasi Higher Order Thinking Skills (HOTS)",
  "Guru kesulitan merumuskan instrumen asesmen formatif dan sumatif yang sahih, terutama dalam mengukur aspek sikap (afektif) spiritual dan sosial peserta didik secara objektif",
  "Guru kesulitan membuat tindak lanjut hasil asesmen formatif dan sumatif yang sahih, untuk meningkatkan kualitas pembelajaran",
  "Guru belum memanfaatkan platform digital (seperti Smart PAI, Canva, atau LMS) untuk mendukung ekosistem pembelajaran rumpun PAI",
  "Guru belum mampu menghasilkan karya ilmiah (PTK) atau publikasi ilmiah sebagai bukti Pengembangan Kompetensi Berkelanjutan",
  "Lainnya (Isi Sendiri)"
] as const;

export const DEFAULT_PROFILE: PengawasProfile = {
  namaPengawasPAI: "Drs. H. Ahmad Marzuki, M.Pd.I",
  nipPengawasPAI: "19720512 199803 1 002",
  namaKetuaPokjawas: "H. Syamsul Huda, M.Ag",
  nipKetuaPokjawas: "19690817 199403 1 004",
  kotaKabupaten: "Kabupaten Sleman",
  satuanPendidikanDefault: "Wilayah Binaan KKG PAI Kecamatan Depok"
};
