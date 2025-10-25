import React from "react";
import { FaGlobe, FaFilter } from "react-icons/fa";

export default function Filters({ meta, selectedYear, selectedDistrictCode, onChange, lang = "en", onLangChange }) {
  const fallbackDistricts = [
    "Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar",
    "Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur",
    "Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger",
    "Muzaffarpur","Nalanda","Nawada","Purnia","Rohtas","Saharsa","Samastipur","Saran",
    "Sheikhpura","Sheohar","Sitamarhi","Siwan","Vaishali","West Champaran","Patna"
  ];

  const years = meta?.fin_years?.length ? meta.fin_years : ["2023-2024", "2024-2025"];
  const districts = meta?.districts?.length
    ? meta.districts
    : fallbackDistricts.map(name => ({ district_name: name, district_code: name }));

  const t = (en, hi) => (lang === "hi" ? hi : en); // simple bilingual text helper

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: 20,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <FaFilter color="#2a4365" />
        <h2 style={{ margin: 0, color: "#2a4365", fontSize: 18 }}>{t("Filters", "फ़िल्टर")}</h2>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        {/* Year dropdown */}
        <div>
          <label style={labelStyle}>{t("Financial Year", "वित्तीय वर्ष")}</label>
          <select
            value={selectedYear || ""}
            onChange={(e) => onChange({ fin_year: e.target.value || null })}
            style={selectStyle}
          >
            <option value="">{t("-- Select Year --", "-- वर्ष चुनें --")}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* District dropdown */}
        <div>
          <label style={labelStyle}>{t("District", "ज़िला")}</label>
          <select
            value={selectedDistrictCode || ""}
            onChange={(e) => onChange({ district_code: e.target.value || null })}
            style={selectStyle}
          >
            <option value="">{t("-- Select District --", "-- ज़िला चुनें --")}</option>
            {districts.map((d) => {
              const code = d.district_code ?? d.code ?? d;
              const name = d.district_name ?? d.name ?? d;
              return (
                <option key={code} value={code}>
                  {name} {code && code !== name ? `(${code})` : ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* Language toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <FaGlobe color="#2a4365" />
          <select
            style={selectStyle}
            value={lang}
            onChange={(e) => onLangChange?.(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 4,
  fontSize: 13,
  fontWeight: 600,
  color: "#2a4365",
};

const selectStyle = {
  padding: "8px 12px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  outline: "none",
  minWidth: 160,
};
