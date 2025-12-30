const fs = require("fs");

const raw = fs.readFileSync("./template/csvjson.json");
const rows = JSON.parse(raw);

const panjangKeys = Object.keys(rows[0]).filter(
  (k) => k !== "YDiameter, XPanjang"
);

const result = panjangKeys.map((pk) => {
  return {
    panjang: parseFloat(pk.replace(",", ".")),
    diameters: rows.map((row) => ({
      diameter: row["YDiameter, XPanjang"],
      value: parseFloat(row[pk].replace(",", ".")),
    })),
  };
});

fs.writeFileSync("converted.json", JSON.stringify(result, null, 2));

console.log("✅ Data berhasil dikonversi ke converted.json");
