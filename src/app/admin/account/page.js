"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AccountSetting() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [passwordLama, setPasswordLama] = useState("");
  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  const [displayFirstName, setDisplayFirstName] = useState("");
  const [displayLastName, setDisplayLastName] = useState("");
  const [displayPhone, setDisplayPhone] = useState("");
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) return router.push("/login");
      const user = data.user;
      setEmail(user.email);

      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, avatar_url")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFormFirstName(profile.first_name || "");
        setFormLastName(profile.last_name || "");
        setFormPhone(profile.phone || "");
        setAvatarUrl(profile.avatar_url || "");

        setDisplayFirstName(profile.first_name || "");
        setDisplayLastName(profile.last_name || "");
        setDisplayPhone(profile.phone || "");
      }

      const saved = localStorage.getItem("profile_saved");
      if (saved === "true") {
        setShowProfilePreview(true);
        setAvatarUrl(localStorage.getItem("avatar_url") || "");
        setDisplayFirstName(localStorage.getItem("first_name") || "");
        setDisplayLastName(localStorage.getItem("last_name") || "");
        setDisplayPhone(localStorage.getItem("phone") || "");
      }
    };

    fetchUser();
  }, [router]);

  const handleSave = async () => {
    if (!formFirstName || !formLastName) return alert("Nama tidak boleh kosong");

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) return alert("User tidak ditemukan");

    if (passwordBaru || passwordLama || konfirmasiPassword) {
      if (!passwordLama) return alert("Isi password sebelumnya");
      if (passwordBaru !== konfirmasiPassword) return alert("Password tidak cocok");
      if (passwordBaru.length < 6) return alert("Min. 6 karakter");

      const { error } = await supabase.auth.updateUser({ password: passwordBaru });
      if (error) return alert("Gagal ubah password: " + error.message);
    }

    const { error: updateError } = await supabase.from("profiles").upsert({
      id: userId,
      first_name: formFirstName,
      last_name: formLastName,
      phone: formPhone,
    });

    if (updateError) return alert("Gagal simpan profil: " + updateError.message);

    setDisplayFirstName(formFirstName);
    setDisplayLastName(formLastName);
    setDisplayPhone(formPhone);
    setPasswordLama("");
    setPasswordBaru("");
    setKonfirmasiPassword("");
    setShowSuccess(true);
    setShowProfilePreview(true);

    localStorage.setItem("profile_saved", "true");
    localStorage.setItem("first_name", formFirstName);
    localStorage.setItem("last_name", formLastName);
    localStorage.setItem("phone", formPhone);
    localStorage.setItem("avatar_url", avatarUrl || "");

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return alert("User tidak ditemukan");

    const fileName = `${userId}/avatar-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (error) return alert("Gagal upload avatar: " + error.message);

    const publicUrl = supabase.storage.from("avatars").getPublicUrl(fileName).data.publicUrl;

    await supabase.from("profiles").upsert({ id: userId, avatar_url: publicUrl });
    setAvatarUrl(publicUrl);
    setShowProfilePreview(true);
    localStorage.setItem("profile_saved", "true");
    localStorage.setItem("avatar_url", publicUrl);
  };

  return (
    <div className="relative">
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 animate-slide-in">
          ✅ Pengaturan berhasil disimpan!
        </div>
      )}

      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Pengaturan Akun</h1>

          <section>
            <label className="block font-semibold text-lg mb-1">Email</label>
            <input type="email" value={email} readOnly className="border p-2 rounded w-full bg-gray-100 text-gray-600" />
          </section>

          <section>
            <label className="block font-semibold text-lg">Nama Lengkap</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input type="text" value={formFirstName} onChange={(e) => setFormFirstName(e.target.value)} placeholder="Nama Depan" className="border p-2 rounded w-full" />
              <input type="text" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} placeholder="Nama Belakang" className="border p-2 rounded w-full" />
            </div>
          </section>

          <section>
            <label className="block font-semibold text-lg">No. Handphone</label>
            <input type="tel" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="081234567890" className="border p-2 rounded w-full mt-2" />
          </section>

          <section>
            <label className="block font-semibold text-lg">Ubah Password (Opsional)</label>
            <input type="password" value={passwordLama} onChange={(e) => setPasswordLama(e.target.value)} placeholder="Password Sebelumnya" className="border p-2 rounded w-full mt-2" />
            <input type="password" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} placeholder="Password Baru (min. 6 karakter)" className="border p-2 rounded w-full mt-2" />
            <input type="password" value={konfirmasiPassword} onChange={(e) => setKonfirmasiPassword(e.target.value)} placeholder="Konfirmasi Password" className="border p-2 rounded w-full mt-2" />
          </section>

          <section>
            <label className="block font-semibold text-lg mb-2">Upload Foto Profil</label>
            <label className="inline-block bg-white border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-50">
              Pilih Gambar
              <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" />
            </label>
          </section>

          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4">
            Simpan Semua
          </button>
        </div>

        {showProfilePreview && (
          <div className="bg-gray-100 p-6 rounded shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-blue-400 overflow-hidden flex items-center justify-center mb-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {displayFirstName?.[0]?.toUpperCase() || "?"}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-4">Data Profil</h2>
            <div className="space-y-6 w-full">
              <div>
                <p className="text-gray-500 text-base font-semibold">Email</p>
                <p className="font-semibold text-lg">{email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-base font-semibold">Nama Lengkap</p>
                <p className="font-semibold text-lg">
                  {displayFirstName} {displayLastName}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-base font-semibold">No. Handphone</p>
                <p className="font-semibold text-lg">{displayPhone || "-"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
