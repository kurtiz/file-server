import {Router} from "express";
import {generateOTP, login, otpVerification, register} from "../controllers/admin.authentication.controller.js";

/**
 * Router for User
 * @type {Router}
 */
const adminRouter = Router();


/**
 * Routes for admin
 */
adminRouter.post("/register", register);
adminRouter.post("/otp/verify", otpVerification);
adminRouter.post("/otp/new", generateOTP);
adminRouter.post("/login", login);

export default adminRouter;