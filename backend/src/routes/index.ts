import { Router } from "express";
import principalRouter from './principal';
import teacherRouter from './teacher';
import studentRouter from './student';

const router = Router();

router.use('/principal', principalRouter);
router.use('/teacher', teacherRouter);
router.use('/student', studentRouter);

export default router;