// import React from "react";

// export default function SummaryCards({ data }) {
//   if (!data.length) return null;

//   const totalExp = data.reduce((a, b) => a + Number(b.Total_Exp || 0), 0);
//   const totalHH = data.reduce((a, b) => a + Number(b.Total_Households_Worked || 0), 0);
//   const avgWage = data.reduce((a, b) => a + Number(b.Average_Wage_rate_per_day_per_person || 0), 0) / data.length;

//   return (
//     <div className="cards">
//       <div className="card">
//         <p className="card-title">Total Expenditure</p>
//         <p className="card-value">{totalExp.toFixed(2)} Cr</p>
//       </div>

//       <div className="card">
//         <p className="card-title">Total Households Worked</p>
//         <p className="card-value">{totalHH}</p>
//       </div>

//       <div className="card">
//         <p className="card-title">Average Wage Rate</p>
//         <p className="card-value">{avgWage.toFixed(2)}</p>
//       </div>
//     </div>
//   );
// }
