# RC34 — Card Played newest-first (2026-11-08)

Status: **Terintegrasi dalam RC34 — playable Release Candidate**. Baseline perubahan Card Played: RC34 sebelum hotfix UI.

## Laporan dan akar masalah

User menginginkan dua urutan berbeda:

- **Battle Log:** urutan kronologis terlama -> terbaru, sehingga entri terbaru ada di bawah. Ini sudah benar pada RC34 dan sengaja dipertahankan.
- **Card Played:** daftar 6 kartu recent harus **terbaru dulu**, dari slot **kiri-atas** ke kanan lalu baris bawah. Sebelumnya renderer `shared-app/app-runtime.js::renderHistory()` menyortir `resolvedHistory` lama -> baru lalu menaruh `resolvedHistory.slice(-6)` langsung ke grid, sehingga kartu terbaru berada di akhir/bawah grid. Full Card History juga lama -> baru, membuat pemain harus membuka riwayat panjang untuk melihat kartu terbaru.

Di sisi legacy engine host, fungsi `v96CombinedPlayedEvents()` sudah mengembalikan newest-first, tetapi `v96CardPlayedPanel()` dan `v96ShowCardPlayedHistory()` memanggil `.reverse()`, mengembalikan tampilan ke oldest-first. Renderer legacy/hidden ini juga disamakan agar konsisten saat dipakai kembali.

## Perubahan kode

1. `shared-app/app-runtime.js`: `renderHistory()` menggunakan salinan `resolvedHistory.slice().reverse()`; grid sidebar menampilkan 6 event pertama dari newest-first, dan Full Card History juga newest-first. Data history aslinya tetap disimpan kronologis dan tidak dimutasi oleh reverse.
2. `shared-app/app-runtime.js`: `latestResolvedActionThisPhase()` mengambil event terbaru di phase aktif, bukan yang pertama/terlama.
3. `engine/shared-app/app.bundle.js`: hapus dua `.reverse()` yang tidak sesuai dari renderer dan history Card Played tersembunyi. Tidak menyentuh game logic.
4. `renderLog()` tidak diubah. Battle Log tetap newest-at-bottom dan log scroll policy RC34 tetap utuh.

## Verifikasi

Pengujian Chromium menggunakan DOM fixture inlined dari **source RC34** asli. Testing dilakukan dengan event lintas PLAYER dan AI yang memiliki `played_event_order` dan timestamp.

- **8 kartu**: sidebar memperlihatkan event #8, #7, #6, #5, #4, #3; posisi #8 top-left/terlihat.
- **Full Card History**: #8 -> #1 (terbaru di atas). Klik kartu pertama tetap membuka detail event yang benar.
- **Penambahan event #9**: sidebar langsung berubah menjadi #9, #8, #7, #6, #5, #4; Full History #9 -> #1.
- **Battle Log tidak berubah**: `OLDEST`, `MIDDLE`, `MOST RECENT` tampil dari atas ke bawah.
- **Viewport**: top-left slot terbaru terverifikasi terlihat pada 1440x900, 1024x700, dan 900x650.
- **Exception browser**: 0 pada fixture.
- **Engine regression dari RC34**: **20/20 PASS** termasuk ruling Stun tidak menutup Protection Item, End Poison/Stoneblood, Casting, Primal, dan kelompok perbaikan lain yang memiliki test terarah.
- **Syntax**: `node --check` PASS pada kedua JS yang berubah.

Mesin diuji lewat skenario terkontrol; **belum ada full natural Human-vs-AI browser match, Firefox, atau live deployment QA**. Source zip RC34 asli tidak diubah.

Hasil mentah browser: `RC34_CARD_PLAYED_BROWSER_QA.json`. Skrip internal browser membangkitkan skenario 8 -> 9 event di Chromium menggunakan `Page.setDocumentContent` dari CSS/JS yang di-inline; asset gambar tidak dimuat pada fixture, sehingga pengujian visual ditentukan dari urutan node DOM dan bounding box. Tidak ada bukti screenshot produk yang mengklaim art telah dimuat.
