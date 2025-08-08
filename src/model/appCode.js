import mongoose, { Schema } from "mongoose";

const appCodeSchema = new mongoose.Schema({
  app_code: {
    type: String,
  },
});

const appCode = mongoose.model("appcode", appCodeSchema);

export default appCode;
