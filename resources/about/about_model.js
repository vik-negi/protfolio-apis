import mongoose from "mongoose";
import { Schema, SchemaType, model } from "mongoose";

const aboutSchema = new Schema(
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
    passion: {
      type: [String],
    },
    career: {
      type: [String],
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    resume: {
      type: String,
    },
    description: {
      type: String,
    },
    social_links: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      github: {
        type: String,
      },
      others: {
        type: [
          {
            name: {
              type: String,
            },
            link: {
              type: String,
            },
          },
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

const About = model("About", aboutSchema);
export default About;
