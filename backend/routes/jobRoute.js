import express from "express";
const router = express.Router();
import {getAdminJobs, getAllJobs, getJobById, postjob} from "../controllers/jobController.js"
import {isAuthenticated} from "../middlewares/isAuthenticated.js";



router.route("/post").post(isAuthenticated,postjob);
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/get/:id").get(isAuthenticated,getJobById);

export default router;