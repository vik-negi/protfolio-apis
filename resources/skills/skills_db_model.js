import mongoose from "mongoose";
import { Schema, SchemaType, model } from "mongoose";

const AllSkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AllSkill = model("allskills", AllSkillSchema);

export default AllSkill;
