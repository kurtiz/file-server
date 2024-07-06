import {Router} from "express";
import {
    generateOTP,
    login,
    otpVerification,
    register,
    resetPassword
} from "../controllers/user/authentication.controller.js";
import {passwordResetOtp, verificationOtp} from "../middlewares/otp.middleware.js";
import {getUserEmails, sendFileEmail} from "../controllers/user/email.controller.js";
import {isAuthenticatedAsUser} from "../middlewares/authentication.middleware.js";
import {filesFeed, getAllFiles, searchFile} from "../controllers/file.controller.js";

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
userRouter.post("/otp/new", verificationOtp, generateOTP);
userRouter.post("/password/reset-initialize", passwordResetOtp, generateOTP);
userRouter.post("/password/reset", isAuthenticatedAsUser, resetPassword);
userRouter.post("/login", login);
userRouter.post("/send-email", isAuthenticatedAsUser, sendFileEmail);
userRouter.get("/files", isAuthenticatedAsUser, getAllFiles);
userRouter.get("/emails", isAuthenticatedAsUser, getUserEmails);
userRouter.get("/feed/:page/:limit", isAuthenticatedAsUser, filesFeed);
userRouter.get("/file/search/:query", isAuthenticatedAsUser, searchFile);

export default userRouter;