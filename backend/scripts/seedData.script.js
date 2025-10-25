//seedData.script.js
import dotenv from 'dotenv';
import connectDB from '../config/db.config.js';
import { fetchBiharData } from '../services/dataIngestion.service.js';

dotenv.config();

const start = async () => {
    await connectDB();

    const years = ["2021-2022","2022-2023", "2023-2024", "2024-2025"];
    for(const year of years){
        console.log(`\n🔄 Seeding data for FY ${year}`);
        await fetchBiharData(year);
    }

    console.log("\n✅ Data seeding completed");
    process.exit(0); // Exit the process after completion
}

start();
