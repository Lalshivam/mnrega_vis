// import React from 'react'
// import {
//   LineChart, Line,
//   BarChart, Bar,
//   PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts'

// const colors = ['#1e90ff', '#ff7f50', '#32cd32', '#ffb347']

// const ChartCard = ({ title, type, data }) => {
//   return (
//     <div className="chart-card">
//       <h3>{title}</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         {type === 'line' && (
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="year" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="workers" stroke="#1e90ff" />
//           </LineChart>
//         )}

//         {type === 'bar' && (
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="state" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="expenditure" fill="#ff7f50" />
//           </BarChart>
//         )}

//         {type === 'pie' && (
//           <PieChart>
//             <Pie data={data} dataKey="projects" nameKey="workType" cx="50%" cy="50%" outerRadius={100}>
//               {data.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         )}
//       </ResponsiveContainer>
//     </div>
//   )
// }

// export default ChartCard
