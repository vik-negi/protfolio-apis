import mongoose from "mongoose";
import { Schema, SchemaTypes, model } from "mongoose";

const dashboardSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dashboard = model("dashboard", dashboardSchema);
export default Dashboard;
