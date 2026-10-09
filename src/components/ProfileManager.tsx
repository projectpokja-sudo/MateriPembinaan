import React, { useState } from 'react';
import { UserCheck2, Save, RotateCcw, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { PengawasProfile, DEFAULT_PROFILE } from '../types';

interface ProfileManagerProps {
  profile: PengawasProfile;
  onSaveProfile: (newProfile: PengawasProfile) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<PengawasProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan ke data profil contoh standar?')) {
      setFormData(DEFAULT_PROFILE);
      onSaveProfile(DEFAULT_PROFILE);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5 text-emerald-800">
          <UserCheck2 className="w-6 h-6" />
          <h2 className="text-lg font-bold text-slate-800 font-serif">
            Profil Pengawas PAI & Ketua Pokjawas
          </h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Atur nama dan NIP Anda serta pimpinan Pokjawas sekali saja di sini. Data ini akan otomatis digunakan pada setiap dokumen pembinaan baru, baik di tabel spreadsheet maupun di tanda tangan pojok kiri & kanan bawah.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">
            Profil berhasil disimpan! Dokumen baru selanjutnya akan menggunakan data ini secara otomatis.
          </span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Data Pengawas PAI Pembina (Pojok Kanan Bawah) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Data Pengawas PAI Pembina (Pojok Kanan Bawah)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar Akademik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.namaPengawasPAI}
                onChange={(e) =>
                  setFormData({ ...formData, namaPengawasPAI: e.target.value })
                }
                placeholder="Contoh: Drs. H. Ahmad Marzuki, M.Pd.I"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Induk Pegawai (NIP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nipPengawasPAI}
                onChange={(e) =>
                  setFormData({ ...formData, nipPengawasPAI: e.target.value })
                }
                placeholder="Contoh: 19720512 199803 1 002"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Data Ketua Pokjawas PAI (Pojok Kiri Bawah) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Data Ketua Pokjawas PAI (Pojok Kiri Bawah)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap & Gelar Ketua Pokjawas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.namaKetuaPokjawas}
                onChange={(e) =>
                  setFormData({ ...formData, namaKetuaPokjawas: e.target.value })
                }
                placeholder="Contoh: H. Syamsul Huda, M.Ag"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIP Ketua Pokjawas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nipKetuaPokjawas}
                onChange={(e) =>
                  setFormData({ ...formData, nipKetuaPokjawas: e.target.value })
                }
                placeholder="Contoh: 19690817 199403 1 004"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Wilayah & Tempat Penandatanganan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kota / Kabupaten Penetapan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.kotaKabupaten}
                onChange={(e) =>
                  setFormData({ ...formData, kotaKabupaten: e.target.value })
                }
                placeholder="Contoh: Kabupaten Sleman / Kota Bandung"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Satuan Pendidikan / Gugus Binaan Default
              </label>
              <input
                type="text"
                value={formData.satuanPendidikanDefault}
                onChange={(e) =>
                  setFormData({ ...formData, satuanPendidikanDefault: e.target.value })
                }
                placeholder="Contoh: Wilayah Binaan KKG PAI Kecamatan Depok"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetDefault}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Contoh</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil Pengawas</span>
          </button>
        </div>

      </form>

    </div>
  );
};
