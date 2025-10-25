import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import SummaryCards from "../components/SummaryCards";
import Filters from "../components/Filters";
import "../App.css";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [state, setState] = useState("BIHAR");
  const [year, setYear] = useState("2024-2025");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/mgnrega/data?state=${state}&year=${year}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [state, year]);

  return (
    <>
    {console.log("Dashboard data:", data)}
    <div className="container">
      <div className="header">
        <h1>MGNREGA Dashboard</h1>
      </div>

      <Filters setState={setState} setYear={setYear} />
      <SummaryCards data={data} />

      <div className="chart-container">
        <h2>Employment Trend by District</h2>
        <LineChart width={1000} height={350} data={data}>
          <Line type="monotone" dataKey="Total_Households_Worked" stroke="#2a4d8f" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="district_name" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    </div>
    </>
  );
}
