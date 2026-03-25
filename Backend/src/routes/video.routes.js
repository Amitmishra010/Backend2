import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getvideosbyid, updateVideo, uploadVideo } from "../controllers/video.controller.js";
const router=Router();
//kyuki ham files bhi upload karwa rahe hai to multer ka use karna padega and route alag tarike se banega
//router.route("/upload").post(uploadVideo);
router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {name:"videofile",maxCount:1},
        {name:"thumbnail",maxCount:1}
    ]),
    uploadVideo
);
router.route("/").get(getAllVideos)
router.route("/:videoId").get(getvideosbyid)
router.route("/:videoId").patch(verifyJWT,updateVideo)
router.route("/:videoId").delete(verifyJWT,deleteVideo)



export default router;