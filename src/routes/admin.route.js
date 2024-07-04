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
    getAllDownloadsCount,
    getDownload,
    localFileUpload
} from "../controllers/admin/file.controller.js";
import {isAuthenticatedAsAdmin} from "../middlewares/authentication.middleware.js";
import {passwordResetOtp, verificationOtp} from "../middlewares/otp.middleware.js";
import {filesCount, filesFeed, getAllFiles, recentFiles} from "../controllers/file.controller.js";
import {getAllEmails, getEmailCount, getRecentEmails, getUserCount} from "../controllers/admin/email.controller.js";

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
adminRouter.post("/password/reset", isAuthenticatedAsAdmin, resetPassword);
adminRouter.post("/login", login);
adminRouter.post("/file/upload/aws", isAuthenticatedAsAdmin, multerAWSUpload.single("file"), awsFileUpload);
adminRouter.post("/file/upload/local", isAuthenticatedAsAdmin, multerLocalUpload.single('file'), localFileUpload);
adminRouter.delete("/file/delete/:fileId", isAuthenticatedAsAdmin, fileDelete);
adminRouter.get("/files/count", isAuthenticatedAsAdmin, filesCount);
adminRouter.get("/emails/count", isAuthenticatedAsAdmin, getEmailCount);
adminRouter.get("/users/count", isAuthenticatedAsAdmin, getUserCount);
adminRouter.get("/downloads/", isAuthenticatedAsAdmin, getAllDownloads);
adminRouter.get("/downloads/count", isAuthenticatedAsAdmin, getAllDownloadsCount);
adminRouter.get("/download/:downloadId", isAuthenticatedAsAdmin, getDownload);
adminRouter.get("/feed/:page/:limit", isAuthenticatedAsAdmin, filesFeed);
adminRouter.get("/files", isAuthenticatedAsAdmin, getAllFiles);
adminRouter.get("/files/recent", isAuthenticatedAsAdmin, recentFiles);
adminRouter.get("/emails/recent", isAuthenticatedAsAdmin, getRecentEmails);
adminRouter.get("/emails", isAuthenticatedAsAdmin, getAllEmails);


export default adminRouter;