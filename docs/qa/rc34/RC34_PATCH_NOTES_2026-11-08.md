# Grandis Legacy VS AI — Season 0 v1.0 RC34

**Tanggal:** 8 November 2026 (Asia/Jakarta)  
**Basis:** VS AI Season 0 v1.0 RC33, 8 November 2026  
**Status:** **RELEASE CANDIDATE — SIAP DICOBA seperti RC33** (full natural match belum diverifikasi)  
**Dasar aturan:** Player Rulebook v3.0, artwork kartu R3.5/Mana R2, dan ruling desainer terkini.

## Keputusan aturan desainer yang wajib dipertahankan

- **F04 bukan bug:** Hero yang Stun masih boleh menggunakan **Item**, termasuk Protection Item, bila syarat Item tersebut terpenuhi. Jangan menambahkan larangan memakai Item akibat Stun.
- **F05 bukan bug:** Damage +10 Burn berlaku hanya apabila Hero **sudah memiliki Burn ketika damage masuk**. Status Burn yang baru di-inflict oleh Attack yang sama diterapkan setelah damage Attack tersebut.
- Semua damage positif dalam permainan adalah **kelipatan 10, minimum 10**. Fixture lethal Poison menggunakan 10 HP dan Poison 10, bukan 5 HP.
- Dragon Scale tetap self-only sesuai perilaku RC33 yang telah diterima.

## Daftar patch di RC34

| ID | Area | Perbaikan diterapkan |
|---|---|---|
| F01 | End Phase Poison / Stoneblood / Legacy | Penyelesaian Poison menggunakan cursor antarlane dan berhenti saat pilihan wajib terbuka. Setelah memilih Stoneblood/Legacy, kelanjutan End otomatis meneruskan tick yang belum selesai, bukan menimpa pilihan atau mengulang tick yang sudah dijalankan. |
| F02 | Casting simultan | Hanya satu Casting dilepas sampai Response Window-nya selesai. Casting berikutnya tetap dalam antrean dan director AI melanjutkannya saat kembali ke Battle. |
| F03 | Primal Strike Defense | Penggunaan Defense dari Hero sekutu mengambil BLOCK berdasarkan Hero source; respons kartu harus melalui pembayaran/CONDITION dan counter; Swift Movement menerapkan Draw setelah DODGE, Shadow Switch mengubah posisi, Binding Light memperoleh kesempatan REACTION. |
| F06 | Legacy once-per-turn | Identitas pemakaian Legacy menggunakan identitas Hero/Legacy, bukan lane. Reposition tidak membuka jatah pemakaian baru. |
| F07 | Bard/Maestro + Stun | Stun menutup pilihan exchange aktif Bard/Maestro tetapi tidak menghapus mandatory Draw dan Mana Regen. |
| F08 | Validasi custom deck | Impor menolak Hero/Legacy di Main Deck, starter bukan Rank I Hero, dan Legacy Deck bukan tiga progresi lengkap (termasuk Rank I/II/III + Legacy). Starter resmi tetap diterima. |
| F09 | PIERCING dan REFLECT | Defense row dengan REFLECT independen tetap boleh digunakan untuk REFLECT meskipun bagian BLOCK tidak efektif. Guard memeriksa row source yang benar. |
| F10 | Enrage | Buff tidak dibuang pada Physical Attack pertama; umur Attachment berakhir pada End sesuai frasa `this turn`. |
| F11 | Sixth Sense | Filter membedakan subtype **Defense** dari kartu **Tactical REACTION**. |
| F12 | Legacy kembali dari Discard | Daftar kandidat return dihitung **sesudah** Skill biaya dipindahkan ke Discard, termasuk kemungkinan memilih Skill yang baru dibayar. Pemeriksaan kelayakan sebelum bayar diselaraskan. |
| F13 | UI End Phase Hand >8 | Preview hover pada Hand Limit tidak lagi ditutup oleh renderer generic modal tiap 120 ms. Renderer Hand Limit menghindari rebuild DOM selama daftar kartu tidak berubah; `#choiceOverlay` diakui oleh delegated preview, dan listener yang berganda dihindari. |
| F14 | UI Card Played | Enam kartu dimainkan terbaru ditampilkan terbaru dulu, mulai dari slot kiri atas; Full Card History juga newest-first. Battle Log tetap kronologis terbaru di bawah; Active Card memakai resolved action terbaru pada fase aktif. |

**Tidak ada patch F04 atau F05** karena keduanya telah dinyatakan bukan bug oleh desainer.

## Verifikasi aktual

1. **Engine terkontrol:** `20/20 PASS`, diulang **6 kali berturut-turut** dengan hasil sama. Tes meliputi kasus Poison otomatis sampai Legacy, dua Casting AI, cabang penting Primal Strike, 5 starter resmi, struktur impor ilegal, dan regresi bahwa Item masih boleh dipakai saat Stun. Skrip dan keluaran JSON ada di folder ini.
2. **Regresi Stoneblood lama:** `10/10 PASS` pada skrip bawaan RC33. Recheck F01 menggunakan 10 HP dan Poison 10.
3. **Browser Chromium, fixture DOM terkendali:** Hand Limit 9 kartu, pointer tetap pada preview sekitar 2,12 detik. RC33 asli menutup preview **21 kali** pada ukuran 1440x900; RC34 menutupnya **0 kali** pada ukuran **1440x900, 1024x700, dan 900x650**. Pemilihan kartu discard tetap bekerja dan tidak muncul browser exception. Data: `RC34_HAND_LIMIT_BROWSER_QA.json`.
4. Kedua JavaScript produksi dan skrip QA lolos `node --check`.
5. Seluruh berkas original RC33 lainnya tetap byte-identik kecuali dua JavaScript produksi dan `README.md`. Integritas setelah penggabungan dicatat pada `RC34_SOURCE_INTEGRITY.json`.
6. **Card Played Chromium:** urutan 8 kartu lalu tambahan kartu ke-9, Full History, klik detail, Battle Log, dan viewport 1440x900, 1024x700, 900x650 lulus; `RC34_CARD_PLAYED_BROWSER_QA.json`.

**Batas verifikasi:** Regresi engine bersifat skenario terkontrol dan browser QA F13 menggunakan `Page.setDocumentContent` dengan HTML/JS produksi yang di-inline. Ini **bukan** verifikasi pertandingan lengkap yang dimainkan alami melalui browser/hosting, bukan tes lengkap semua kombinasi kartu, dan bukan verifikasi Firefox atau audio pada perangkat.

## Hal yang belum terkonfirmasi

Laporan gejala spesifik **"Stoneblood mengembalikan Hero ke 30 HP tanpa mengurangi Racial Token"** belum berhasil direproduksi dengan skenario valid. F01 memperbaiki masalah yang berhasil dibuktikan (pilihan tertimpa/tick Poison berlanjut secara salah), tetapi jangan menganggap laporan gratis-token itu pasti selesai tanpa reproduksi yang sesuai kondisi pertandingan pengguna.

Perbedaan urutan End Phase AI yang sebelumnya hanya teramati secara statis belum memiliki bukti dampak gameplay dan tidak termasuk dalam 12 kelompok perbaikan ini.

## Cara menjalankan tes engine RC34

Dari direktori game yang telah diekstrak, jalankan:

```bash
node docs/qa/rc34/RC34_ENGINE_REGRESSION.cjs
```

Tes menggunakan VM dan DOM stub untuk memanggil fungsi engine nyata, tanpa mengubah JavaScript produksi. Tes menulis `docs/qa/rc34/REGRESSION_RC34_PATCHED.json`. Untuk memainkan game, sajikan folder ini dengan static HTTP server dan buka `index.html` seperti pada README asal.

## Berkas produksi yang diubah

- `engine/shared-app/app.bundle.js` — F01, F02, F03, F06–F12, serta preview modal F13 dan fallback Card Played F14.
- `shared-app/app-runtime.js` — F13, renderer modal UI aktif setiap 120 ms, dan Card Played/Full History/Active Card F14.
- `README.md` — header rilis patch dan tautan ke catatan ini.

Data game/kartu dari OSA, card-art, audio, dan semua asset tidak dimodifikasi.
