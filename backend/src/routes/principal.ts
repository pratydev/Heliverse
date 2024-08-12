import { Router } from "express";
import { assignStudent, assignTeacher, createClassroom, createPrincipal, createStudent, createTeacher, deleteStudent, deleteTeacher, fetchClassrooms, fetchTeachers, signInPrincipal, updateStudent, updateTeacher } from "../controllers/principalController";
import { principalAuth } from "../middlewares/principalAuth";

const router = Router();

router.post('/create-principal', createPrincipal);

router.post('/signin', signInPrincipal);

router.post('/create-teacher', principalAuth, createTeacher);

router.post('/create-student', principalAuth, createStudent);

router.post('/create-classroom', principalAuth, createClassroom);

router.get('/fetch-teachers', principalAuth, fetchTeachers);

router.get('/fetch-classrooms', principalAuth, fetchClassrooms);

router.post('/assign-teacher', principalAuth, assignTeacher);

router.post('/assign-student', principalAuth, assignStudent);

router.put('/update-teacher', principalAuth, updateTeacher);

router.put('/update-student', principalAuth, updateStudent);

router.delete('/delete-teacher/:id', principalAuth, deleteTeacher);

router.delete('/delete-student/:id', principalAuth, deleteStudent);



export default router;