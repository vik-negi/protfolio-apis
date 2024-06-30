import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;

const SkillSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
    skillCategory: {
      trim: true,
      default: "Others",
      type: String,
    },
    skill: {
      type: SchemaTypes.ObjectId,
      ref: "allskill",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Beginner",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = model("skill", SkillSchema);
export default Skill;
