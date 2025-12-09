// backend/seeder.js
import { connectDb } from "./config/db.js";
import Food from "./models/foodModel.js";
import { food_list } from "./data/foodData.js";

const seedData = async () => {
  try {
    await connectDb();
    await Food.deleteMany({});
    console.log("🗑️ Old data deleted");
    
    // strip _id if any and insert
    const cleaned = food_list.map(item => {
      const { _id, ...rest } = item;
      return rest;
    });

    await Food.insertMany(cleaned);
    console.log("✅ Seeder success: data inserted");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
};

seedData();
