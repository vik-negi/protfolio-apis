import jwt from "jsonwebtoken";
import { SECRETS } from "./config.js";
import User from "../resources/user/user_model.js";

export const newToken = (user) => {
  return jwt.sign({ id: user._id }, SECRETS.jwt, {
    expiresIn: SECRETS.jwtExp,
  });
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, SECRETS.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
