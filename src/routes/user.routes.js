import {Router} from "express";
import { loginUser,registerUser,logOutUser } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

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

router.route("/login").post(loginUser)

//secured routes
router.route("/logOut").post(verifyJWT,logOutUser)

export default router;
