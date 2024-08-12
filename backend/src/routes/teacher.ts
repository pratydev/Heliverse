import { Router } from "express";
import { signinTeacher } from "../controllers/teacherController";
import { teacherAuth } from "../middlewares/teacherAuth";

const router = Router();

router.post('/signin', teacherAuth, signinTeacher);



export default router;