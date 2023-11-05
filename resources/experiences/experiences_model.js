import mongoose from "mongoose";
import { Schema, SchemaType, model } from "mongoose";

const experienceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    experiences: {
      type: [
        {
          title: {
            type: String,
            required: true,
          },
          company: {
            type: String,
            required: true,
          },
          location: {
            type: String,
          },
          from: {
            type: Date,
            required: true,
          },
          to: {
            type: Date,
          },
          current: {
            type: Boolean,
            default: false,
          },
          description: {
            type: String,
          },
          skills: {
            type: [String],
          },
          highlights: {
            type: [String],
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Experience = model("Experience", experienceSchema);
export default Experience;
