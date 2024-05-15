import {Router} from "express";
import {
    generateOTP,
    login,
    otpVerification,
    register,
    resetPassword
} from "../controllers/admin/authentication.controller.js";
import {multerAWSUpload, multerLocalUpload} from "../middlewares/multer.middleware.js";
import {awsFileUpload, fileDelete, localFileUpload} from "../controllers/admin/fileUpload.controller.js";
import {isAuthenticatedAsAdmin} from "../middlewares/authentication.middleware.js";
import {passwordResetOtp, verificationOtp} from "../middlewares/otp.middleware.js";

/**
 * Router for Admin
 * @type {Router}
 */
const adminRouter = Router();


/**
 * Routes for admin
 */
adminRouter.post("/register", register);
adminRouter.post("/otp/verify", otpVerification);
adminRouter.post("/otp/new", verificationOtp, generateOTP);
adminRouter.post("/password/reset-initialize", passwordResetOtp, generateOTP);
adminRouter.post("/password/reset", resetPassword);
adminRouter.post("/login", login);
adminRouter.post("/file/upload/aws", isAuthenticatedAsAdmin, multerAWSUpload.single("file"), awsFileUpload);
adminRouter.post("/file/upload/local", isAuthenticatedAsAdmin, multerLocalUpload.single('file'), localFileUpload);
adminRouter.post("/file/delete/:fileId", isAuthenticatedAsAdmin, fileDelete);


export default adminRouter;