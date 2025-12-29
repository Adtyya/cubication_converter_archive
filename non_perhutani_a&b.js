const fs = require("fs");
const csv = require("csv-parser");

// Helper
function toNum(val) {
  if (val === null || val === undefined) return NaN;
  const s = String(val).trim();
  if (!s) return NaN;
  const cleaned = s.replace(/\s+/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

const results = [];
fs.createReadStream("./template/Salinan dari Non perhutani - Lampiran A & B")
  .pipe(
    csv({
      separator: ",",
      mapHeaders: ({ header }) => (header ? header.trim() : header),
    })
  )
  .on("data", (data) => results.push(data))
  .on("end", () => {
    const grouped = {};
    let currentName = "Default";
    let currentP = NaN;

    let totalRows = 0;
    let addedDetails = 0;
    let skippedRows = 0;

    for (const row of results) {
      totalRows++;

      const rawName = (row["Nama"] ?? "").toString().trim();
      if (rawName) currentName = rawName;

      const rawP = (row["Panjang (m)"] ?? "").toString().trim();
      const parsedP = toNum(rawP);

      if (Number.isFinite(parsedP)) {
        currentP = parsedP;
      }

      if (!Number.isFinite(currentP)) {
        skippedRows++;
        continue;
      }

      const k = toNum(row["Keliling (cm)"]);
      const d = toNum(row["Diameter (cm)"]);
      const i = toNum(row["Isi"]);

      if (!Number.isFinite(k) && !Number.isFinite(d) && !Number.isFinite(i)) {
        skippedRows++;
        continue;
      }

      if (!Number.isFinite(k) || !Number.isFinite(d) || !Number.isFinite(i)) {
        skippedRows++;
        continue;
      }

      if (!grouped[currentName]) grouped[currentName] = {};
      if (!grouped[currentName][currentP]) grouped[currentName][currentP] = [];

      grouped[currentName][currentP].push({ k, d, i });
      addedDetails++;
    }

    const result = Object.keys(grouped).map((name) => {
      const sizes = Object.keys(grouped[name])
        .map((pStr) => ({
          p: Number(pStr),
          detail: grouped[name][pStr],
        }))
        .sort((a, b) => a.p - b.p);

      return { name, size: sizes };
    });

    fs.writeFileSync(
      "converted_diameters.json",
      JSON.stringify(result, null, 2)
    );
    console.log("✅ Data berhasil dikonversi ke converted_diameters.json");
    console.log(
      `Total baris: ${totalRows}, Ditambahkan detail: ${addedDetails}, Dilewati: ${skippedRows}`
    );
  })
  .on("error", (err) => {
    console.error("❌ Gagal membaca CSV:", err);
  });
