import {Router} from "express";
import userRouter from "./user.route.js";
import adminRouter from "./admin.route.js";

const router = Router();

router.use("/user", userRouter);
router.use("/admin", adminRouter);

router.get("/", (req, res) => {
    res.send("<h1>File Server</h1>");
})
export default router;