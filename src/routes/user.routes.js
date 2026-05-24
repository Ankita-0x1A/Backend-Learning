import {Router} from "express";
import { registerUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";

const router= Router();

router.route("/register").post(
    upload.fields([
        // 1. img 2. avatar
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser);
// router.route("/login").post(loginUser);

export default router;
