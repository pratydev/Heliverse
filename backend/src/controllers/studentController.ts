import { Request, Response } from 'express';
import { prisma } from '..';
import jwt from 'jsonwebtoken';
import { StudentAuth } from '../middlewares/studentAuth';

export async function fetchClassmates(req: StudentAuth, res: Response) {
    try {

        if(req.student?.id === undefined) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const studentId = req.student.id;

        const classroomId = await prisma.classroom.findFirst({
            where: {
                students: {
                    some: {
                        id: studentId
                    }
                }

            }
        })

        if (!classroomId) {
            return res.status(404).json({
                message: 'Classroom not found'
            });
        }

        const students = await prisma.classroom.findFirst({
            where: {
                id: Number(classroomId)
            },
            select: {
                name: true,
                students: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return res.status(200).json({
            message: 'Students fetched successfully',
            data: {
                classroom: students
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while fetching students',
        });
    }
}

export async function signInStudent(req: Request, res: Response) {
    try {
        const { emailId, password } = req.body as { emailId: string, password: string };

        if (!emailId || !password) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const student = await prisma.student.findFirst({
            where: {
                email: emailId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        if (student.password !== password) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }
        
        const token = jwt.sign({ id: student.id, name: student.name, email: student.email }, process.env.CODEIAL_JWT_SECRET as string, { expiresIn: '5h' });

        return res.status(200).json({
            message: 'Student signed in successfully',
            data: {
                id: student.id,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while signing in student',
        });

    }
}