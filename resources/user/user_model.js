import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import md5 from "md5";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: Number,
    },
    address: [{ type: SchemaTypes.ObjectId, ref: "Address" }],
    password: {
      type: String,
      trim: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      required: true,
      type: String,
      trim: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: function () {
        return `https://www.gravatar.com/avatar/${md5(this.email)}?d=identicon`;
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

// UserSchema.pre("save", async function (next) {
//   // if (
//   //   !this.isModified("password") &&
//   //   !this.isModified("username") &&
//   //   !this.isModified("picture")
//   // ) {
//   //   return next();
//   // }
//   this.username = await generateUniqueUserName(
//     `${this.firstName.toLowerCase()}.${this.lastName.toLowerCase()}`,
//     this.firstName,
//     this.lastName
//   );

//   try {
//     const hash = await bcrypt.hash(this.password, 8);
//     this.password = hash;
//     // await this.save();
//     // console.log("GENERATED USERNAME", this.username);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

UserSchema.pre(
  "findOneAndDelete",
  { document: true, query: true },
  async function (next) {
    const userID = this.getFilter()["_id"];
    console.log("DELETING USER", userID);

    next();
  }
);

UserSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};

UserSchema.methods.addUserType = function (userType) {
  if (!this.userType.includes(userType)) {
    this.userType.push(userType);
  }
};

const User = model("user", UserSchema);
export default User;
