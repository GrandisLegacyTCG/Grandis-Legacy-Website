# Upload manual RC33 + Deck Builder v1.62

Paket ini memperbarui `GrandisLegacyTCG/Grandis-Legacy-Website` dari commit `f6f1d8971e6458b96b46f2083f0481e02d2230db` (RC32 + DB v1.62) menjadi RC33 + DB v1.62. Tidak ada perubahan yang dikirim ke GitHub dari sesi penyusunan paket ini.

## Jika repo masih memakai baseline tersebut

1. Ekstrak ZIP `UPDATE_ONLY`.
2. Buka repo di branch `main`, lalu pilih **Add file → Upload files**.
3. Upload seluruh isi hasil ekstrak ke root repo. Pertahankan susunan folder; `index.html` harus berada di root, bukan di dalam folder pembungkus. Jangan upload file ZIP-nya.
4. Periksa daftar file, lalu lakukan commit sendiri, misalnya `Update VS AI RC32 to RC33; keep Deck Builder v1.62`.
5. Sesudah deployment Pages selesai, periksa `/`, `/deck-builder/`, dan `/deck-builder/style-2/`. Buka VS AI, pastikan tombol Deck Builder tersedia, lalu coba Start Match dan panel Sound.

Tidak ada file yang perlu dihapus. Seluruh 347 file Deck Builder tetap identik, sehingga tidak dimasukkan ke ZIP update-only. `CNAME` dan `.nojekyll` juga tetap seperti repo lama.

## Jika perlu seluruh isi situs

Ekstrak ZIP `FULL_REPO`, lalu salin seluruh isinya ke root salinan repo. File `CNAME` berisi `grandislegacytcg.web.id`; `.nojekyll` disertakan. Pengaturan Pages tetap `main` / `/(root)`. Jangan menambahkan folder pembungkus.

## Batas hasil

Paket mengikuti source RC33 yang dilampirkan. Pekerjaan ini menggabungkan aplikasi; tidak menambahkan perbaikan rule/gameplay di luar RC33. Validasi integrasi lokal dijelaskan di `INTEGRATION_QA.md`; deployment domain dan permainan browser penuh belum diverifikasi pada sesi ini.
