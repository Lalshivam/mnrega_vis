import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  fin_year: String,
  month: String,
  district_name: String,
  district_code: String,
  metrics: mongoose.Schema.Types.Mixed,
  last_updated: { type: Date, default: Date.now }
});

districtSchema.index({ district_code: 1, fin_year: 1, month: 1 }, { unique: true });

export const DistrictMetric = mongoose.model("DistrictMetric", districtSchema);
