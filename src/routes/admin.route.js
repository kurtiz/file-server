import {Router} from "express";
import {
    generateOTP,
    login,
    otpVerification,
    register,
    resetPassword
} from "../controllers/admin/authentication.controller.js";
import {multerAWSUpload, multerLocalUpload} from "../middlewares/multer.middleware.js";
import {
    awsFileUpload,
    fileDelete,
    getAllDownloads,
    getAllDownloadsCount, getDownload,
    localFileUpload
} from "../controllers/admin/file.controller.js";
import {isAuthenticatedAsAdmin} from "../middlewares/authentication.middleware.js";
import {passwordResetOtp, verificationOtp} from "../middlewares/otp.middleware.js";
import {filesFeed} from "../controllers/file.controller.js";

/**
 * Router for Admin
 * @type {Router}
 */
const adminRouter = Router();


/**
 * Routes for admin
 */
adminRouter.post("/register", register);
adminRouter.post("/otp/verify", verificationOtp, otpVerification);
adminRouter.post("/otp/new", generateOTP);
adminRouter.post("/password/reset-initialize", passwordResetOtp, generateOTP);
adminRouter.post("/password/reset", resetPassword);
adminRouter.post("/otp/password/verify", isAuthenticatedAsAdmin, otpVerification);
adminRouter.post("/login", login);
adminRouter.post("/file/upload/aws", isAuthenticatedAsAdmin, multerAWSUpload.single("file"), awsFileUpload);
adminRouter.post("/file/upload/local", isAuthenticatedAsAdmin, multerLocalUpload.single('file'), localFileUpload);
adminRouter.post("/file/delete/:fileId", isAuthenticatedAsAdmin, fileDelete);
adminRouter.get("/downloads/", isAuthenticatedAsAdmin, getAllDownloads);
adminRouter.get("/downloads/count", isAuthenticatedAsAdmin, getAllDownloadsCount);
adminRouter.get("/download/:downloadId", isAuthenticatedAsAdmin, getDownload);
adminRouter.get("/feed/:page/:limit", isAuthenticatedAsAdmin, filesFeed);


export default adminRouter;