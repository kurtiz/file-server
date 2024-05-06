import {Router} from "express";
import {generateOTP, login, otpVerification, register} from "../controllers/user/authentication.controller.js";

/**
 * Router for User
 * @type {Router}
 */
const userRouter = Router();


/**
 * Routes for user
 */
userRouter.post("/register", register);
userRouter.post("/otp/verify", otpVerification);
userRouter.post("/otp/new", generateOTP);
userRouter.post("/login", login);

export default userRouter;