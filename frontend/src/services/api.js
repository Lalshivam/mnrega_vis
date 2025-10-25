import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "", // empty => use vite dev server proxy for /api
  headers: { "Content-Type": "application/json" },
});


export const fetchMeta = () => api.get("/api/meta").then(r => r.data);

export const fetchDistrictData = (district_code, fin_year) =>
  api.get("/api/data", { params: { district_code, fin_year } }).then(r => r.data);

export default api;

export const getBiharDistricts = async (fin_year = "2024-2025") => {
    try {
        const { data } = await axios.get(`${API}/bihar`,{params: {fin_year}});
        return data.data;
    } catch (error) {
        console.error("Error fetching Bihar districts:", error);
        throw error;
    }
}