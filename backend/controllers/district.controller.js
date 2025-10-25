import { DistrictMetric } from "../models/DistrictMetric.model.js";
import { fetchBiharData } from "../services/dataIngestion.service.js";

export const getBiharDistricts = async (req, res) => {
  try {
    const fin_year = req.query.fin_year || "2024-2025";

    // Check DB cache
    let districts = await DistrictMetric.find({ fin_year }).lean();

    if (!districts.length) {
      console.log("⏳ No cache, fetching fresh Bihar data...");
      await fetchBiharData(fin_year);
      districts = await DistrictMetric.find({ fin_year }).lean();
    }

    res.json({
      status: "ok",
      count: districts.length,
      data: districts.map((d) => ({
        district_name: d.district_name,
        district_code: d.district_code,
        month: d.month,
        fin_year: d.fin_year,
        metrics: d.metrics,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * GET /api/meta
 * Returns available fin_years and unique districts (code + name) for selectors.
 */
export const getMeta = async (req, res) => {
  try {
    const fin_years = await DistrictMetric.distinct("fin_year");
    const districts = await DistrictMetric.aggregate([
      {
        $group: {
          _id: { district_code: "$district_code", district_name: "$district_name" },
        },
      },
      {
        $project: {
          _id: 0,
          district_code: "$_id.district_code",
          district_name: "$_id.district_name",
        },
      },
      { $sort: { district_name: 1 } },
    ]);
    res.json({ fin_years, districts });
  } catch (err) {
    console.error("getMeta error:", err);
    res.status(500).json({ error: "Failed to load meta" });
  }
};

/**
 * GET /api/data?district_code=0515&fin_year=2023-2024
 * Returns all month documents for that district + summary.
 */
export const getDistrictData = async (req, res) => {
  try {
    const { district_code, fin_year } = req.query;
    if (!district_code || !fin_year) {
      return res.status(400).json({ error: "district_code and fin_year are required" });
    }

    // Find all month documents for the district + fin_year
    const records = await DistrictMetric.find({ district_code, fin_year }).sort({ month: 1 }).lean();

    if (!records.length) {
      // Try to populate cache if empty
      console.log("No records found, triggering fetch and retry...");
      await fetchBiharData(fin_year);
      const recheck = await DistrictMetric.find({ district_code, fin_year }).sort({ month: 1 }).lean();
      if (!recheck.length) {
        return res.status(404).json({ error: "No data found for the requested district/fin_year" });
      }
    }

    const recs = records.length ? records : (await DistrictMetric.find({ district_code, fin_year }).sort({ month: 1 }).lean());

    const summary = {
      district_code,
      district_name: recs[0]?.district_name || null,
      fin_year,
      records_count: recs.length,
      first_month: recs[0]?.month || null,
      last_month: recs[recs.length - 1]?.month || null,
      last_updated: recs[0]?.last_updated || null,
    };

    // Return both the stored document array and easily-consumable metrics array (metrics nested)
    res.json({
      summary,
      records: recs,
      metrics: recs.map(r => r.metrics || r), // frontend can use .metrics or top-level fields
    });
  } catch (err) {
    console.error("getDistrictData error:", err);
    res.status(500).json({ error: "Failed to load district data" });
  }
};































// export const getBiharDistricts = async (req, res) => {
//   try {
//     const fin_year = req.query.fin_year || "2024-2025";

//     // Check DB cache
//     let districts = await DistrictMetric.find({ fin_year }).lean();

//     if (!districts.length) {
//       console.log("⏳ No cache, fetching fresh Bihar data...");
//       await fetchBiharData(fin_year);
//       districts = await DistrictMetric.find({ fin_year }).lean();
//     }

//     res.json({
//       status: "ok",
//       count: districts.length,
//       data: districts.map((d) => ({
//         district_name: d.district_name,
//         metrics: d.metrics,
//       })),
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };
