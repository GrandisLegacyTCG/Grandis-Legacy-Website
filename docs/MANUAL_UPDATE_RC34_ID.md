# Manual Update GitHub — VS AI RC34 + Deck Builder v1.62

Baseline: `GrandisLegacyTCG/Grandis-Legacy-Website` branch `main`, commit `5fd2bc590147e287d81db6c5abb8e4eb09fe3bf2` (RC33 + DB v1.62).

1. Ekstrak `Grandis_Legacy_RC34_DB_v1.62_UPDATE_ONLY_2026-11-08.zip`.
2. Upload **isi** folder hasil ekstrak ke root repository. Jangan upload ZIP dan jangan menambah folder pembungkus.
3. Biarkan struktur path tetap sama. File existing akan di-replace oleh versi RC34; file baru RC34 akan ditambahkan.
4. Tidak ada file yang perlu dihapus untuk update ini.
5. Commit manual, misalnya: `GL S0 : VS AI RC34 + DB v1.62`.
6. Setelah GitHub Pages selesai deploy, hard refresh browser bila perlu. Semua JS/CSS yang berubah sudah memakai cache key baru.

Paket FULL_REPO tersedia sebagai alternatif bila ingin mengganti seluruh isi repo secara lokal sebelum upload.
