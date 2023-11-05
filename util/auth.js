import { newToken } from "./jwt.js";
import jwt from "jsonwebtoken";
import User from "../resources/user/user_model.js";
import { withErrorHandling } from "./with_error_handling_calls.js";

class AuthServices {
  static adminAuthentication = (req, res, next) => {
    try {
      if (!req.user.userType.includes("admin")) {
        return res
          .status(403)
          .json({ error: "Only admin can access this route" });
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: "failed",
        message: "Server Error",
        error: err.message,
      });
    }
  };
  static userAuthentication = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        token = authorization.split(" ")[1];

        const id = jwt.verify(token, process.env.JWT_SECRET).id;
        req.user = await User.findById(id);
        if (!req.user) {
          return res.status(404).send({
            status: "failed",
            message: "User not found or Invalid token",
          });
        }
        next();
      } catch (err) {
        return res.status(401).send({
          message: err.message,
        });
      }
    }
    if (!token) {
      res
        .status(401)
        .send({ status: "failed", message: "Unauthorized User No Token" });
    }
  };
}
export default AuthServices;
