import { Router } from "express";
import { fetchStudents, signinTeacher } from "../controllers/teacherController";
import { teacherAuth } from "../middlewares/teacherAuth";
import { deleteStudent, updateStudent } from "../controllers/principalController";

const router = Router();

router.post('/signin',  signinTeacher);

router.get('/fetch-students', teacherAuth, fetchStudents);

router.put('/update-student', teacherAuth, updateStudent);

router.delete('/delete-student', teacherAuth, deleteStudent);




export default router;