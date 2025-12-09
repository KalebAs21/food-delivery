import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: false },  // ✅ required (since you said not optional)
  category: { type: String, required: true },
});

// ✅ prevent model overwrite issue in dev with hot reload
const foodModel = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default foodModel;
