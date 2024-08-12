import { Request, Response } from "express";
import { prisma } from "..";
import jwt from 'jsonwebtoken';

export async function signinTeacher(req: Request, res: Response){
    try {
        const { emailId, password } = req.body as { emailId: string, password: string };

        if (!emailId || !password) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const teacher = await prisma.teacher.findFirst({
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

        if (!teacher) {
            return res.status(404).json({
                message: 'teacher not found'
            });
        }

        if (teacher.password !== password) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({
            id: teacher.id,
            email: teacher.email,
            name: teacher.name,
        }, process.env.CODEIAL_JWT_SECRET as string, {
            expiresIn: '5h'
        });

        return res.status(200).json({
            message: 'teacher signed in successfully',
            data: {
                id: teacher.id,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while signing in teacher',
        });
    }
}