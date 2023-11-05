import mongoose from "mongoose";
import { Schema, SchemaTypes, model } from "mongoose";

const PublicInfoSchema = new Schema(
  {
    user: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    username: {
      type: String,
      trim: true,
      require: true,
      unique: true,
    },
    profilePic: {
      type: String,
    },
    profileTitle: {
      type: String,
    },
    profileDescription: {
      type: String,
    },
    profileUrl: {
      type: String,
    },
    link: {
      type: [
        {
          name: {
            type: String,
          },
          url: {
            type: String,
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

const PublicInfo = model("publicInfo", PublicInfoSchema);
export default PublicInfo;
