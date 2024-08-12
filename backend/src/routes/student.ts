import { Router } from "express";
import { fetchStudents, signInStudent } from "../controllers/studentController";
import { studentAuth } from "../middlewares/studentAuth";
const router = Router();


router.get('/fetch-classmates', studentAuth, fetchStudents);

router.post('/signin', studentAuth, signInStudent);



export default router;