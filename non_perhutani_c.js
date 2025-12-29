const fs = require("fs");
const csv = require("csv-parser");

// Helper: parse angka (ubah koma → titik)
function toNum(val) {
  if (!val) return NaN;
  const s = String(val).trim().replace(/\./g, "").replace(",", ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}

const results = [];
fs.createReadStream("./template/Salinan dari Non perhutani - Lampiran C.csv")
  .pipe(
    csv({
      separator: ",",
      mapHeaders: ({ header }) => (header ? header.trim() : header),
    })
  )
  .on("data", (row) => results.push(row))
  .on("end", () => {
    const finalData = [];
    let currentP_awal = NaN;
    let currentP_akhir = NaN;
    let currentGroup = null;

    for (const row of results) {
      const rawAwal = row["Panjang_Awal(m)"];
      const rawAkhir = row["Panjang_Akhir(m)"];
      const p_awal = toNum(rawAwal);
      const p_akhir = toNum(rawAkhir);

      if (Number.isFinite(p_awal) && Number.isFinite(p_akhir)) {
        currentP_awal = p_awal;
        currentP_akhir = p_akhir;

        currentGroup = {
          p_awal: currentP_awal,
          p_akhir: currentP_akhir,
          size: [],
        };
        finalData.push(currentGroup);
      }

      if (!currentGroup) continue;

      const k = toNum(row["Keliling (cm)"]);
      const d = toNum(row["Diameter (cm)"]);
      const kubikasi = toNum(row["KUBIKASI"]);

      if (
        Number.isFinite(k) &&
        Number.isFinite(d) &&
        Number.isFinite(kubikasi)
      ) {
        currentGroup.size.push({ k, d, kubikasi });
      }
    }

    fs.writeFileSync(
      "converted_nonperhutani2.json",
      JSON.stringify(finalData, null, 2)
    );

    console.log("✅ Data berhasil dikonversi ke converted_nonperhutani2.json");
  })
  .on("error", (err) => {
    console.error("❌ Gagal membaca CSV:", err);
  });
