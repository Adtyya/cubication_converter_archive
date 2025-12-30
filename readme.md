# Data Processing Guide: Perhutani & Non-Perhutani

Dokumen ini menjelaskan tahapan konversi data dari format **CSV** menjadi **JSON** yang siap diimpor ke database, baik untuk data **Perhutani** maupun **Non-Perhutani**.

---

## Prasyarat

Sebelum memulai, pastikan hal berikut sudah tersedia:

- **Node.js** (versi LTS direkomendasikan)
- File data dalam format **CSV**
- Akses internet (khusus konversi CSV ke JSON untuk data Perhutani)

---

## Alur Proses Data Perhutani

Data Perhutani memerlukan proses konversi manual dari CSV ke JSON sebelum diproses oleh script.

### Langkah-langkah

1. **Export Data ke CSV**
   Pastikan data Perhutani sudah diekspor dalam format `.csv`.

2. **Konversi CSV ke JSON**

   - Kunjungi: [https://csvjson.com/](https://csvjson.com/)
   - Upload file CSV
   - Konversikan ke format **JSON**
   - Simpan hasil konversi (misalnya: `csvjson.json`)

3. **Sesuaikan Nama File pada Script**
   Buka file `perhutani.js`, lalu ubah bagian berikut sesuai nama file JSON hasil konversi:

   ```js
   const raw = fs.readFileSync("./template/csvjson.json");
   ```

4. **Jalankan Script**
   Eksekusi perintah berikut di terminal:

   ```bash
   node perhutani.js
   ```

5. **Hasil Akhir**
   Script akan menghasilkan file **JSON final** yang:

   - Sudah terstruktur
   - Siap langsung di-_import_ ke database

---

## Alur Proses Data Non-Perhutani

Untuk data Non-Perhutani, proses konversi dilakukan langsung melalui script tanpa konversi manual ke JSON.

### Langkah-langkah

1. **Export Data ke CSV**
   Pastikan data Non-Perhutani tersedia dalam format `.csv`.

2. **Jalankan Script**
   Jalankan perintah sesuai script yang disediakan:

   ```bash
   node non-perhutani.js
   ```

3. **Hasil Akhir**
   Script akan secara otomatis:

   - Membaca file CSV
   - Memproses dan memetakan data
   - Menghasilkan file **JSON siap impor database**

---

## Output

- Format: **JSON**
- Status: **Clean & structured**
- Tujuan: **Import langsung ke database tanpa transformasi tambahan**

---

## Catatan

- Pastikan struktur kolom CSV sesuai dengan format yang diharapkan oleh script.
- Gunakan encoding UTF-8 untuk menghindari error karakter.
- Disarankan menyimpan file hasil konversi di folder yang telah ditentukan (misalnya `/template` atau `/output`).
