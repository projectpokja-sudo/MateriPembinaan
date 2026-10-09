import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-quality curated generator for PAI Supervision
function generateFallbackContent(identitas: any) {
  const masalah = identitas.aspekMasalahCustom || identitas.aspekMasalah;
  const kegiatan = identitas.namaKegiatan || 'Pembinaan Pengawasan Akademik Guru PAI';
  
  return {
    pendahuluan: `Kegiatan pembinaan ini diselenggarakan sebagai respon terhadap temuan pengawasan akademik terkait tantangan: "${masalah}". Pengawas PAI bertugas melakukan supervisi klinis dan pendampingan berkelanjutan guna memastikan perencanaan serta pelaksanaan pembelajaran Pendidikan Agama Islam dan Budi Pekerti berorientasi pada pemahaman mendalam dan pembiasaan akhlak mulia. Melalui kegiatan "${kegiatan}", diharapkan para pendidik PAI memperoleh wawasan teoritis dan keterampilan praktis dalam mengatasi kesenjangan kompetensi pedagogik serta profesional, sehingga proses pembelajaran di satuan pendidikan binaan mampu menghasilkan peserta didik yang beriman, bertakwa, dan berakhlak karimah secara autentik.`,
    outlineMateri: {
      subMateri1: `Analisis Akar Masalah dan Reorientasi Paradigma Pembelajaran PAI Kontekstual`,
      subMateri2: `Strategi Operasional dan Pengembangan Desain Pembelajaran serta Instrumen Aksi Nyata`,
      subMateri3: `Praktik Baik, Asesmen Autentik, dan Rencana Tindak Lanjut Berkelanjutan Berbasis KKG/MGMP`
    },
    isiMateri: {
      subMateri1: `Pemateri memaparkan dekonstruksi tantangan utama yang dihadapi guru PAI di lapangan terkait kendala pembelajaran. Fokus diarahkan pada transformasi paradigma dari pendekatan administratif yang semata-mata mengejar penuntasan kurikulum menjadi pembelajaran yang bermakna (meaningful learning). Guru diajak menelaah capaian pembelajaran secara holistik, mengidentifikasi materi esensial, serta melepaskan beban materi berlebih agar ruang refleksi dan penghayatan nilai-nilai Islam dapat tumbuh subur dalam sanubari peserta didik sesuai dengan fase perkembangannya.`,
      subMateri2: `Pada bagian inti, narasumber membimbing langkah demi langkah formulasi solusi teknis yang dapat segera diimplementasikan di kelas binaan. Paparan mencakup integrasi diferensiasi pembelajaran, pemanfaatan media kontekstual yang relevan dengan kehidupan anak, serta penyusunan alur tujuan pembelajaran yang membumi. Guru dibekali format lembar kerja aplikatif dan rubrik observasi yang praktis guna menerjemahkan konsep teoritis ke dalam tindakan pembelajaran aktif berorientasi keterampilan berpikir tingkat tinggi (HOTS) tanpa mengabaikan keteladanan budi pekerti.`,
      subMateri3: `Narasumber menegaskan pentingnya kolaborasi sejawat dan refleksi berkala melalui forum KKG/MGMP PAI sebagai wadah penguatan keprofesian berkelanjutan. Diuraikan mekanisme pemantauan mandiri (self-assessment) serta teknik perumusan instrumen evaluasi yang sahih untuk mengukur transformasi sikap spiritual dan sosial murid. Sesi ini ditutup dengan komitmen bersama untuk melakukan peer-coaching antarguru PAI serta penyusunan portofolio pembelajaran sebagai bukti nyata peningkatan mutu pembelajaran PAI pascapembinaan.`
    },
    sesiDiskusi: [
      {
        subMateriId: 1,
        subMateriJudul: `Analisis Akar Masalah dan Reorientasi Paradigma Pembelajaran PAI Kontekstual`,
        pertanyaan: `Bagaimana strategi efektif bagi guru PAI dalam menyelaraskan tuntutan penuntasan materi kurikulum dengan kebutuhan menghadirkan pembelajaran mendalam bagi siswa dengan karakteristik heterogen?`,
        penanya: `Ustadz Ahmad Fauzi, S.Pd.I (Peserta Pembinaan)`,
        jawaban: `Guru perlu melakukan pemetaan materi esensial dan menerapkan prinsip "less is more", yakni memprioritaskan pemahaman konsep kunci dan internalisasi nilai daripada mengejar kuantitas hafalan teks. Gunakan pembelajaran berbasis masalah kehidupan sehari-hari anak.`
      },
      {
        subMateriId: 2,
        subMateriJudul: `Strategi Operasional dan Pengembangan Desain Pembelajaran serta Instrumen Aksi Nyata`,
        pertanyaan: `Apakah instrumen atau rubrik penilaian sikap yang dibuat guru harus rumit dengan puluhan indikator, mengingat beban mengajar guru PAI yang mencakup banyak rombongan belajar?`,
        penanya: `Ibu Siti Rohmah, M.Pd.I (Peserta Pembinaan)`,
        jawaban: `Tidak perlu rumit. Instrumen asesmen sikap justru harus sahih dan realistis. Fokuskan pada 2-3 indikator utama akhlak mulia dan profil pelajar beriman melalui teknik catatan anekdot (anecdotal record) dan observasi kontekstual yang terintegrasi saat proses belajar.`
      },
      {
        subMateriId: 3,
        subMateriJudul: `Praktik Baik, Asesmen Autentik, dan Rencana Tindak Lanjut Berkelanjutan Berbasis KKG/MGMP`,
        pertanyaan: `Bagaimana cara menjaga konsistensi tindak lanjut hasil pembinaan ini agar tidak berhenti sebagai wacana teoritis di forum pelatihan saja?`,
        penanya: `Bapak Muhammad Ridwan, S.Ag (Peserta Pembinaan)`,
        jawaban: `Pengawas bersama Pengurus KKG/MGMP mengagendakan "Klinik Pembelajaran Berkala" dan peer-supervision sebulan sekali. Setiap guru mendokumentasikan satu bukti karya modul atau video mikro-praktik untuk direviu bersama sebagai wujud akuntabilitas profesional.`
      }
    ],
    kesimpulanTindakLanjut: `Pembinaan pengawasan akademik ini berhasil membuka kesadaran bersama akan pentingnya transformasi pembelajaran PAI yang substantif dan berorientasi pada pembentukan karakter peserta didik. Guru PAI diharapkan segera merevisi dokumen perencanaan dan menerapkan instrumen asesmen yang telah disimulasikan. Sebagai tindak lanjut konkret, Pengawas PAI bersama KKG/MGMP akan melakukan supervisi klinis tindak lanjut dalam tempo 30 hari ke depan serta mengadakan pameran karya modul ajar dan praktik baik di tingkat gugus binaan.`
  };
}

// API to generate full structured Ringkasan Materi
app.post('/api/generate-ringkasan', async (req, res) => {
  try {
    const { identitas, customNotes } = req.body;
    if (!identitas) {
      return res.status(400).json({ error: 'Data identitas kegiatan wajib disertakan.' });
    }

    const masalah = identitas.aspekMasalahCustom || identitas.aspekMasalah || 'Pembelajaran PAI Berorientasi Pemahaman Mendalam';
    const kegiatan = identitas.namaKegiatan || 'Pembinaan Pengawasan Akademik Guru PAI';
    const narasumber = identitas.narasumber || 'Pengawas PAI';
    const sasaran = identitas.satuanPendidikan || 'Guru PAI Satuan Pendidikan Binaan';
    const jumlahPeserta = identitas.jumlahPeserta || '20 Orang Guru PAI';

    if (!aiClient) {
      // Use refined fallback if no Gemini client initialized
      const fallback = generateFallbackContent(identitas);
      return res.json({ success: true, data: fallback, source: 'fallback' });
    }

    const systemPrompt = `Anda adalah Pengawas PAI (Pendidikan Agama Islam) Ahli Madya/Utama di lingkungan Kementerian Agama Republik Indonesia, bertindak sebagai AI Dokumen Spesialis Pengawasan Akademik.
Tugas Anda adalah menyusun dokumen resmi: "RINGKASAN MATERI PEMBINAAN PENGAWAS PAI" yang menjadi bagian integral dari Laporan Pembinaan Pengawas PAI.

KETENTUAN KHUSUS DAN FORMAT WAJIB:
1. Bahasa: Bahasa Indonesia baku, formal, akademis, santun, sesuai kaidah EYD/PUEBI, gaya penulisan laporan dinas kementerian agama.
2. Penulisan: Rapi, lugas, siap untuk format tabel spreadsheet rata kanan kiri (justified).
3. Bagian B. PENDAHULUAN:
   - Berisi penjelasan singkat mengapa pembinaan ini dilakukan berdasarkan Aspek Masalah yang dihadapi guru PAI.
   - Dibuat tepat 1 paragraf singkat dengan jumlah MAKSIMAL 150 KATA.
4. Bagian C. OUTLINE MATERI:
   - Kerangka atau garis besar topik yang disampaikan pemateri sebelum masuk ke penjelasan detail berdasarkan Aspek Masalah.
   - Wajib terdiri dari tepat 3 Sub-materi: [Sub-materi 1], [Sub-materi 2], [Sub-materi 3].
5. Bagian D. ISI MATERI:
   - Uraian inti atau konsep penting yang disampaikan pemateri dengan mengembangkan Outline Materi di atas.
   - Masing-masing Sub Materi dibuat tepat 1 paragraf singkat dengan jumlah MAKSIMAL 300 KATA per paragraf.
6. Bagian E. SESI DISKUSI:
   - Berisi Pertanyaan Peserta dan Jawaban dari Pemateri.
   - Masing-masing Sub Materi dibuat tepat 1 Pertanyaan (kontekstual dari realitas guru di kelas) dan 1 Jawaban (solutif, taktis, bijak dari narasumber/pengawas).
   - Total tepat 3 pasang Pertanyaan dan Jawaban.
7. Bagian F. KESIMPULAN DAN TINDAK LANJUT:
   - Berisi intisari pembinaan dan rencana tindak lanjut operasional berdasarkan Aspek Masalah.
   - Dibuat tepat 1 paragraf singkat dengan jumlah MAKSIMAL 150 KATA.`;

    const userPrompt = `Susun Ringkasan Materi Pembinaan Pengawas PAI berdasarkan data berikut:
- Aspek / Masalah: ${masalah}
- Nama Kegiatan: ${kegiatan}
- Narasumber: ${narasumber}
- Sasaran / Satuan: ${sasaran}
- Jumlah Peserta: ${jumlahPeserta}
${customNotes ? `- Catatan Tambahan: ${customNotes}` : ''}

Keluarkan HANYA JSON valid sesuai struktur yang diminta.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pendahuluan: {
              type: Type.STRING,
              description: 'Penjelasan singkat latar belakang pembinaan, 1 paragraf maksimal 150 kata.'
            },
            outlineMateri: {
              type: Type.OBJECT,
              properties: {
                subMateri1: { type: Type.STRING, description: 'Judul topik Sub-materi 1' },
                subMateri2: { type: Type.STRING, description: 'Judul topik Sub-materi 2' },
                subMateri3: { type: Type.STRING, description: 'Judul topik Sub-materi 3' },
              },
              required: ['subMateri1', 'subMateri2', 'subMateri3']
            },
            isiMateri: {
              type: Type.OBJECT,
              properties: {
                subMateri1: { type: Type.STRING, description: 'Uraian isi Sub-materi 1, 1 paragraf maksimal 300 kata.' },
                subMateri2: { type: Type.STRING, description: 'Uraian isi Sub-materi 2, 1 paragraf maksimal 300 kata.' },
                subMateri3: { type: Type.STRING, description: 'Uraian isi Sub-materi 3, 1 paragraf maksimal 300 kata.' },
              },
              required: ['subMateri1', 'subMateri2', 'subMateri3']
            },
            sesiDiskusi: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subMateriId: { type: Type.INTEGER },
                  subMateriJudul: { type: Type.STRING },
                  pertanyaan: { type: Type.STRING },
                  penanya: { type: Type.STRING },
                  jawaban: { type: Type.STRING }
                },
                required: ['subMateriId', 'subMateriJudul', 'pertanyaan', 'jawaban']
              }
            },
            kesimpulanTindakLanjut: {
              type: Type.STRING,
              description: 'Kesimpulan dan tindak lanjut, 1 paragraf maksimal 150 kata.'
            }
          },
          required: ['pendahuluan', 'outlineMateri', 'isiMateri', 'sesiDiskusi', 'kesimpulanTindakLanjut']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsedData, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating ringkasan materi:', error);
    // On error, fallback gracefully so user work is uninterrupted
    const fallback = generateFallbackContent(req.body?.identitas || {});
    return res.json({
      success: true,
      data: fallback,
      source: 'fallback',
      warning: error?.message || 'Menggunakan template pembinaan standar karena koneksi AI sementara dialihkan.'
    });
  }
});

// API to regenerate a specific single section
app.post('/api/regenerate-section', async (req, res) => {
  try {
    const { sectionKey, identitas, currentOutline, currentSubMateriTitle } = req.body;
    if (!identitas || !sectionKey) {
      return res.status(400).json({ error: 'Section dan identitas wajib disertakan.' });
    }

    if (!aiClient) {
      const fallback = generateFallbackContent(identitas);
      return res.json({ success: true, content: (fallback as any)[sectionKey] || fallback });
    }

    const masalah = identitas.aspekMasalahCustom || identitas.aspekMasalah;
    const prompt = `Sebagai Pengawas PAI Kemenag RI, buat ulang HANYA bagian "${sectionKey}" untuk dokumen Laporan Pembinaan Pengawas PAI.
Aspek Masalah: "${masalah}"
Nama Kegiatan: "${identitas.namaKegiatan}"
Konteks tambahan: ${currentSubMateriTitle ? `Sub Materi: ${currentSubMateriTitle}` : ''}

Ketentuan:
- Jika pendahuluan: tepat 1 paragraf maksimal 150 kata.
- Jika isiMateri: tepat 1 paragraf maksimal 300 kata.
- Jika kesimpulan: tepat 1 paragraf maksimal 150 kata.
Bahasa Indonesia baku, formal, bernas, EYD/PUEBI. Keluarkan teks murni tanpa pengantar atau markdown tambahan.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ success: true, content: response.text?.trim() });
  } catch (error: any) {
    console.error('Error regenerating section:', error);
    return res.status(500).json({ error: error?.message || 'Gagal meregenerasi bagian dokumen.' });
  }
});

// Serve frontend in dev or prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
