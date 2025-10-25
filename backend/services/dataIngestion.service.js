//dataIngestion.service.js
// dataIngestion.service.js
import axios from "axios";
import { DistrictMetric } from "../models/DistrictMetric.model.js";

export const fetchBiharData = async (fin_year = "2024-2025") => {
  try {
    const apiBase = process.env.BASE_API;
    const apiKey = process.env.API_KEY;
    const state_name = "BIHAR";

    if (!apiBase || !apiKey) {
      throw new Error("Missing BASE_API or API_KEY in environment variables");
    }

    const limit = 10; // API always returns 10 records per call
    let offset = 0;
    let total = 0;

    console.log(`🚀 Fetching MGNREGA Bihar data for FY ${fin_year}`);

    do {
      const url = `${apiBase}?api-key=${apiKey}&format=json&offset=${offset}&filters[state_name]=${state_name}&filters[fin_year]=${fin_year}`;

      // Fetch batch
      const { data } = await axios.get(url);

      if (!data.records || data.records.length === 0) break;

      total = data.total || 0;
      console.log(`↳ Batch offset ${offset} | got ${data.records.length} records`);

      // Prepare bulk operations for MongoDB
      const bulkOps = data.records.map(rec => ({
        updateOne: {
          filter: { district_code: rec.district_code, fin_year: rec.fin_year, month: rec.month },
          update: {
            $set: {
              fin_year: rec.fin_year,
              month: rec.month,
              district_name: rec.district_name,
              district_code: rec.district_code,
              metrics: rec,
              last_updated: new Date(),
            },
          },
          upsert: true,
        },
      }));

      // Execute bulk write
      await DistrictMetric.bulkWrite(bulkOps);

      offset += limit; // Move to next batch
    } while (offset < total);

    console.log(`✅ Bihar data stored successfully for FY ${fin_year}`);
  } catch (err) {
    console.error("❌ Data ingestion failed:", err.message);
  }
};














// import axios from "axios";
// import { DistrictMetric } from "../models/DistrictMetric.model.js";

// export const fetchBiharData = async (fin_year = "2024-2025") => {
//   try {
//     const apiBase = process.env.BASE_API;
//     const apiKey = process.env.API_KEY;
//     const state_name = "BIHAR";

//     if (!apiBase || !apiKey) {
//       throw new Error("Missing BASE_API or API_KEY in environment variables");
//     }

//     const limit = 10000;
//     let offset = 0;
//     let total = 0;

//     console.log(`🚀 Fetching MGNREGA Bihar data for FY ${fin_year}`);

//     do {
//       const url = `${apiBase}?api-key=${apiKey}&format=json&offset=${offset}&limit=${limit}&filters[state_name]=${state_name}&filters[fin_year]=${fin_year}`;

//       // Debug check
//       if (!url.startsWith("http")) {
//         throw new Error(`Invalid URL constructed: ${url}`);
//       }

//       const { data } = await axios.get(url);

//       if (!data.records || data.records.length === 0) break;
//       total = data.total || 0;

//       console.log(`↳ Batch offset ${offset} | got ${data.records.length} records`);

//       for (const rec of data.records) {
//         const filter = {
//           district_code: rec.district_code,
//           fin_year: rec.fin_year,
//           month: rec.month,
//         };

//         const update = {
//           fin_year: rec.fin_year,
//           month: rec.month,
//           district_name: rec.district_name,
//           district_code: rec.district_code,
//           metrics: rec,
//           last_updated: new Date(),
//         };

//         await DistrictMetric.updateOne(filter, { $set: update }, { upsert: true });
//       }

//       offset += limit;
//     } while (offset < total);

//     console.log(`✅ Bihar data stored successfully for ${fin_year}`);
//   } catch (err) {
//     console.error("❌ Data ingestion failed:", err.message);
//   }
// };
