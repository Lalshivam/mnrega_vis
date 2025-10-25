import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { FaRupeeSign, FaUsers, FaTools, FaClock } from "react-icons/fa";
import Filters from "../components/FIlters.jsx";
import { fetchMeta, fetchDistrictData } from "../services/api.js";
import { useLanguage } from "../context/Language.context.jsx";
import "chart.js/auto";

export default function Dashboard() {
  const [meta, setMeta] = useState(null);
  const [selected, setSelected] = useState({ fin_year: null, district_code: null });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    fetchMeta()
      .then(setMeta)
      .catch((err) => setError(err.message || "Failed to load meta"));
  }, []);

  useEffect(() => {
    const { fin_year, district_code } = selected;
    if (!fin_year || !district_code) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetchDistrictData(district_code, fin_year)
      .then((res) => setData(res))
      .catch((err) => setError(err.message || "Failed to load district data"))
      .finally(() => setLoading(false));
  }, [selected]);

  const records = data?.records ?? [];
  const summary = data?.summary ?? {};

  // === Derived stats ===
  const totalExp = records.reduce((s, r) => s + Number(r.metrics?.Total_Exp || 0), 0);
  const totalHH = records.reduce((s, r) => s + Number(r.metrics?.Total_Households_Worked || 0), 0);
  const totalWorkers = records.reduce((s, r) => s + Number(r.metrics?.Total_Individuals_Worked || 0), 0);
  const avgWage = records.length
    ? records.reduce((s, r) => s + Number(r.metrics?.Average_Wage_rate_per_day_per_person || 0), 0) / records.length
    : 0;

  // === Chart Data ===
  const months = records.map((r) => r.metrics.month);
  const expenditure = records.map((r) => Number(r.metrics.Total_Exp || 0));
  const households = records.map((r) => Number(r.metrics.Total_Households_Worked || 0));
  const womenDays = records.map((r) => Number(r.metrics.Women_Persondays || 0));
  const menDays = records.map((r) => Number(r.metrics.Persondays_of_Central_Liability_so_far || 0));

  const barData = {
    labels: months,
    datasets: [
      {
        label: t("totalExpenditure"),
        data: expenditure,
        backgroundColor: "#36a2eb",
      },
    ],
  };

  const lineData = {
    labels: months,
    datasets: [
      {
        label: t("householdsWorked"),
        data: households,
        borderColor: "#4bc0c0",
        backgroundColor: "#4bc0c020",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const doughnutData = {
    labels: [t("womenParticipation"), t("individualsWorked")],
    datasets: [
      {
        data: [womenDays.reduce((a, b) => a + b, 0), menDays.reduce((a, b) => a + b, 0)],
        backgroundColor: ["#ff6384", "#ffcd56"],
      },
    ],
  };

  // === UI ===
  return (
    <div
      style={{
        padding: "1.5rem",
        fontFamily: "Inter, sans-serif",
        background: "#fafafa",
        minHeight: "100vh",
        minWidth: "95vw",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#2a4365", marginBottom: 12 }}>🏗️ {t("title")}</h1>
        <button
          onClick={() => setLang(lang === "en" ? "hi" : "en")}
          style={{
            background: "#2a4365",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {lang === "en" ? "हिन्दी" : "English"}
        </button>
      </div>

      <Filters
        meta={meta}
        selectedYear={selected.fin_year}
        selectedDistrictCode={selected.district_code}
        onChange={(vals) => setSelected((s) => ({ ...s, ...vals }))}
        lang={lang}
        onLangChange={setLang}
      />

      {loading && <p>⏳ {lang === "en" ? "Loading district data..." : "जिला डेटा लोड हो रहा है..."}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!data && !loading && (
        <p style={{ marginTop: 24, color: "#555" }}>{t("selectPrompt")}</p>
      )}

      {data && (
        <>
          {/* === Summary Section === */}
          <section
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 16,
            }}
          >
            <SummaryCard
              icon={<FaRupeeSign />}
              label={t("totalExpenditure")}
              value={`₹${totalExp.toFixed(2)} L`}
              color="#36a2eb"
            />
            <SummaryCard
              icon={<FaUsers />}
              label={t("householdsWorked")}
              value={totalHH.toLocaleString()}
              color="#4bc0c0"
            />
            <SummaryCard
              icon={<FaTools />}
              label={t("individualsWorked")}
              value={totalWorkers.toLocaleString()}
              color="#ff9f40"
            />
            <SummaryCard
              icon={<FaClock />}
              label={t("avgWage")}
              value={`₹${avgWage.toFixed(2)}`}
              color="#9966ff"
            />
          </section>

          {/* === Charts Section === */}
          <section style={{ marginTop: 40, display: "grid", gap: 24 }}>
            <ChartBox title={t("monthlyExpenditure")}>
              <Bar
                data={barData}
                options={{
                  plugins: {
                    legend: { labels: { font: { family: "Inter" } } },
                },
                scales: {
                  x: { title: { display: true, text: lang === "hi" ? "महीने" : "Months" } },
                  y: { title: { display: true, text: lang === "hi" ? "व्यय (₹ लाख में)" : "Expenditure (₹ in Lakhs)" } },
                },
              }}
              />
            </ChartBox>

            <ChartBox title={t("householdsTrend")}>
              <Line
                data={lineData}
                options={{
                  scales: {
                    x: { title: { display: true, text: lang === "hi" ? "महीने" : "Months" } },
                    y: { title: { display: true, text: lang === "hi" ? "परिवारों की संख्या" : "Households Worked" } },
                  },
                }}
              />
            </ChartBox>

            <ChartBox title={t("womenParticipation")}>
              <Doughnut
                data={doughnutData}
                options={{
                  plugins: {
                    legend: {
                      labels: { font: { family: "Inter" } },
                    },
                  },
                }}
              />
            </ChartBox>
          </section>

          {/* === Footer === */}
          <footer style={{ marginTop: 40, fontSize: 13, color: "#555" }}>
            <b>{summary.district_name}</b> — {t("lastUpdated")}:{" "}
            {new Date(summary.last_updated).toLocaleString(
              lang === "hi" ? "hi-IN" : "en-IN"
            )}
            <br />
            ({summary.fin_year})
          </footer>
        </>
      )}
    </div>
  );
}

// === Helper Components ===
const SummaryCard = ({ icon, label, value, color }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 8,
      padding: 16,
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}
  >
    <div
      style={{
        background: color,
        color: "white",
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13, color: "#777" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color }}>{value}</div>
    </div>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div
    style={{
      background: "#fff",
      padding: 16,
      borderRadius: 8,
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      maxWidth: "45vw",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <h3 style={{ color: "#2a4365", fontSize: 16, marginBottom: 12 }}>{title}</h3>
    {children}
  </div>
);




// import React, { useEffect, useState } from "react";
// import { Bar, Line, Doughnut } from "react-chartjs-2";
// import { FaRupeeSign, FaUsers, FaTools, FaClock } from "react-icons/fa";
// import Filters from "../components/FIlters.jsx";
// import { fetchMeta, fetchDistrictData } from "../services/api.js";
// import { useLanguage } from "../context/Language.context.jsx";
// import "chart.js/auto";

// export default function Dashboard() {
//   const [meta, setMeta] = useState(null);
//   const [selected, setSelected] = useState({ fin_year: null, district_code: null });
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { t, lang, setLang } = useLanguage();

//   useEffect(() => {
//     fetchMeta()
//       .then(setMeta)
//       .catch((err) => setError(err.message || "Failed to load meta"));
//   }, []);

//   useEffect(() => {
//     const { fin_year, district_code } = selected;
//     if (!fin_year || !district_code) {
//       setData(null);
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     fetchDistrictData(district_code, fin_year)
//       .then((res) => setData(res))
//       .catch((err) => setError(err.message || "Failed to load district data"))
//       .finally(() => setLoading(false));
//   }, [selected]);

//   const records = data?.records ?? [];

//   // === Derived stats ===
//   const summary = data?.summary ?? {};
//   const totalExp = records.reduce((s, r) => s + Number(r.metrics?.Total_Exp || 0), 0);
//   const totalHH = records.reduce((s, r) => s + Number(r.metrics?.Total_Households_Worked || 0), 0);
//   const totalWorkers = records.reduce((s, r) => s + Number(r.metrics?.Total_Individuals_Worked || 0), 0);
//   const avgWage = records.length
//     ? records.reduce((s, r) => s + Number(r.metrics?.Average_Wage_rate_per_day_per_person || 0), 0) / records.length
//     : 0;

//   // === Chart Data ===
//   const months = records.map((r) => r.metrics.month);
//   const expenditure = records.map((r) => Number(r.metrics.Total_Exp || 0));
//   const households = records.map((r) => Number(r.metrics.Total_Households_Worked || 0));
//   const womenDays = records.map((r) => Number(r.metrics.Women_Persondays || 0));
//   const menDays = records.map((r) => Number(r.metrics.Persondays_of_Central_Liability_so_far || 0));

//   const barData = {
//     labels: months,
//     datasets: [
//       {
//         label: "Total Expenditure (₹ in Lakhs)",
//         data: expenditure,
//         backgroundColor: "#36a2eb",
//       },
//     ],
//   };

//   const lineData = {
//     labels: months,
//     datasets: [
//       {
//         label: "Households Worked",
//         data: households,
//         borderColor: "#4bc0c0",
//         backgroundColor: "#4bc0c020",
//         fill: true,
//         tension: 0.3,
//       },
//     ],
//   };

//   const doughnutData = {
//     labels: ["Women Persondays", "Other Persondays"],
//     datasets: [
//       {
//         data: [womenDays.reduce((a, b) => a + b, 0), menDays.reduce((a, b) => a + b, 0)],
//         backgroundColor: ["#ff6384", "#ffcd56"],
//       },
//     ],
//   };

//   // === UI ===
//   return (
//     <div style={{ padding: "1.5rem", fontFamily: "Inter, sans-serif", background: "#fafafa", minHeight: "100vh", minWidth: "95vw" }}>
//       <h1 style={{ color: "#2a4365", marginBottom: 12 }}>🏗️ MGNREGA Bihar — Dashboard</h1>

//       <Filters
//     meta={meta}
//     selectedYear={selected.fin_year}
//     selectedDistrictCode={selected.district_code}
//     onChange={(vals) => setSelected((s) => ({ ...s, ...vals }))}
//     lang={lang}
//     onLangChange={setLang}
//   />

//       {loading && <p>⏳ Loading district data...</p>}

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!data && !loading && (
//         <p style={{ marginTop: 24, color: "#555" }}>
//           Select a financial year and a district to show visualizations and detailed info.
//         </p>
//       )}

//       {data && (
//         <>
//           <section
//             style={{
//               marginTop: 24,
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//               gap: 16,
//             }}
//           >
//             <SummaryCard icon={<FaRupeeSign />} label="Total Expenditure" value={`₹${totalExp.toFixed(2)} L`} color="#36a2eb" />
//             <SummaryCard icon={<FaUsers />} label="Households Worked" value={totalHH.toLocaleString()} color="#4bc0c0" />
//             <SummaryCard icon={<FaTools />} label="Individuals Worked" value={totalWorkers.toLocaleString()} color="#ff9f40" />
//             <SummaryCard icon={<FaClock />} label="Avg Wage/day" value={`₹${avgWage.toFixed(2)}`} color="#9966ff" />
//           </section>



//           <section style={{ marginTop: 40, display: "grid", gap: 24 }}>
//             <ChartBox title="Monthly Expenditure Trend">
//               <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
//             </ChartBox>

//             <ChartBox title="Households Worked Over Months">
//               <Line data={lineData} />
//             </ChartBox>

//             <ChartBox title="Women Participation in Persondays">
//               <Doughnut data={doughnutData} />
//             </ChartBox>
//           </section>



//           {/* <section style={{ marginTop: 40, display: "grid", gap: 24 }}>
//             <ChartBox title="Monthly Expenditure Trend">
//               <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
//             </ChartBox>

//             <ChartBox title="Households Worked Over Months">
//               <Line data={lineData} />
//             </ChartBox>

//             <ChartBox title="Women Participation in Persondays">
//               <Doughnut data={doughnutData} />
//             </ChartBox>
//           </section> */}

//           <footer style={{ marginTop: 40, fontSize: 13, color: "#555" }}>
//             <b>{summary.district_name}</b> — Data from {summary.first_month} to {summary.last_month} ({summary.fin_year})  
//             <br /> Last updated: {new Date(summary.last_updated).toLocaleString()}
//           </footer>
//         </>
//       )}
//     </div>
//   );
// }

// // === Helper Components ===

// const SummaryCard = ({ icon, label, value, color }) => (
//   <div
//     style={{
//       background: "#fff",
//       borderRadius: 8,
//       padding: 16,
//       boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
//       display: "flex",
//       alignItems: "center",
//       gap: 12,
//     }}
//   >
//     <div
//       style={{
//         background: color,
//         color: "white",
//         borderRadius: "50%",
//         width: 36,
//         height: 36,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: 16,
//       }}
//     >
//       {icon}
//     </div>
//     <div>
//       <div style={{ fontSize: 13, color: "#777" }}>{label}</div>
//       <div style={{ fontSize: 18, fontWeight: 600, color }}>{value}</div>
//     </div>
//   </div>
// );

// // const ChartBox = ({ title, children }) => (
// //   <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.05)", maxWidth: "45vw", display: "flex", flexDirection: "row" }}>
// //     <h3 style={{ color: "#2a4365", fontSize: 16, marginBottom: 12 }}>{title}</h3>
// //     {children}
// //   </div>
// // );
// const ChartBox = ({ title, children }) => (
//   <div style={{ background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.05)", maxWidth: "45vw", display: "flex", flexDirection: "row" }}>
//     <h3 style={{ color: "#2a4365", fontSize: 16, marginBottom: 12 }}>{title}</h3>
//     {children}
//   </div>
// );