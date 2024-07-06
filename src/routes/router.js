import {Router} from "express";
import userRouter from "./user.route.js";
import adminRouter from "./admin.route.js";
import {downloadFile, recordDownload} from "../controllers/fileDownload.controller.js";

/**
 * Main Router
 * @type {Router}
 */
const router = Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);

router.get("/file/download/request/:fileId", recordDownload);
router.get("/file/download/:filename", downloadFile);

// home route just to show the site is working
router.get("/", (request, response) => {
    response.send(
        "<h1>File Server is Live</h1> <br>" +
        "<h2>Version: 1.0.0</h2><br>" +
        "<a href='https://papilio-technologies.betteruptime.com/'>View API Status</a>");
});

export default router;