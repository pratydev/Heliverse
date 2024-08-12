import { Router } from "express";
import { fetchClassmates, signInStudent } from "../controllers/studentController";
import { studentAuth } from "../middlewares/studentAuth";
const router = Router();


router.get('/fetch-classmates', studentAuth, fetchClassmates);

router.post('/signin', signInStudent);



export default router;