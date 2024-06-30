import mongoose from "mongoose";

const { Schema, SchemaTypes, model } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      require: true,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    projectDoc: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
    description: {
      type: String,
    },
    image: {
      type: Array,
      default: [],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: [],
    },
    skillsUsed: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Project = model("Project", projectSchema);
export default Project;
