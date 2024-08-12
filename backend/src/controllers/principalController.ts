import { Request, Response } from 'express';
import { prisma } from '..';
import jwt from 'jsonwebtoken';
// import { PrincipalAuth } from '../middlewares/principalAuth';



interface updateDetails {
    name?: string;
    email?: string;
    password?: string;
}

export async function signInPrincipal(req: Request, res: Response) {
    try {
        const { email, password } = req.body as { email: string, password: string };

        if (!email || !password) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const principal = await prisma.principal.findFirst({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                password: true,
            }
        });

        if (!principal) {
            return res.status(404).json({
                message: 'principal not found'
            });
        }

        if (principal.password !== password) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ email: principal.email }, process.env.CODEIAL_JWT_SECRET as string, { expiresIn: '5h' });

        return res.status(200).json({
            message: 'principal signed in successfully',
            data: {
                id: principal.id,
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while signing in principal',
        });

    }
}

export async function createPrincipal(req: Request, res: Response) {
    try {
        // const response = creationSchema.safeParse(req.body);

        // if (!response.success) {
        //     return res.status(400).json({
        //         message: 'Invalid request body',
        //     });
        // }

        const { email, password } = req.body as { email: string, password: string };

        const principal = await prisma.principal.create({
            data: {
                email,
                password
            }
        });

        return res.status(201).json({
            message: 'Principal created successfully',
            data: {
                id: principal.id
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while creating principal',
        });
    }
}

export async function createTeacher(req: Request, res: Response) {
    try {
        // const response = creationSchema.safeParse(req.body);

        // if (!response.success) {
        //     return res.status(400).json({
        //         message: 'Invalid request body',
        //     });
        // }

        const { name, emailId, password } = req.body as { name: string, emailId: string, password: string };

        const teacher = await prisma.teacher.create({
            data: {
                name,
                email: emailId,
                password
            }
        });

        return res.status(201).json({
            message: 'Teacher created successfully',
            data: {
                id: teacher.id
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while creating teacher',
        });
    }
}


export async function createStudent(req: Request, res: Response) {
    try {
        // const response = creationSchema.safeParse(req.body);

        // if (!response.success) {
        //     return res.status(400).json({
        //         message: 'Invalid request body',
        //     });
        // }

        const { name, emailId, password } = req.body as { name: string, emailId: string, password: string };

        const student = await prisma.student.create({
            data: {
                name,
                email: emailId,
                password
            }
        });

        return res.status(201).json({
            message: 'Student created successfully',
            data: {
                id: student.id
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while creating student',
        });
    }
}

export async function createClassroom(req: Request, res: Response) {
    try {
        const { name } = req.body as { name: string };

        if (!name) {
            return res.status(400).json({
                message: 'Invalid request body',
            });
        }

        const classroom = await prisma.classroom.create({
            data: {
                name
            },
            select: {
                id: true,
                name: true,
            }
        });

        return res.status(201).json({
            message: 'Classroom created successfully',
            data: {
                classroom
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while creating classroom',
        });
    }
}


export async function fetchTeachers(req: Request, res: Response) {
    try {
        const teachers = await prisma.teacher.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });

        return res.status(200).json({
            message: 'Teachers fetched successfully',
            data: {
                teachers
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while fetching teachers',
        });

    }
}

export async function fetchClassrooms(req: Request, res: Response) {
    try {
        const classrooms = await prisma.classroom.findMany({
            select: {
                id: true,
                name: true,
            }
        });

        return res.status(200).json({
            message: 'Classrooms fetched successfully',
            data: {
                classrooms
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while fetching classrooms',
        });
    }
};

export async function assignTeacher(req: Request, res: Response) {
    try {
        const { teacherId, classroomId } = req.body as { teacherId: number, classroomId: number };

        if (!teacherId || !classroomId) {
            return res.status(400).json({
                message: 'Invalid request body',
            });
        }

        const teacher = await prisma.teacher.findUnique({
            where: {
                id: teacherId
            }
        });

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found',
            });
        }

        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classroomId
            }
        });

        if (!classroom) {
            return res.status(404).json({
                message: 'Classroom not found',
            });
        }

        const existing = await prisma.classroom.findUnique({
            where: {
                id: classroomId,
                teacherId
            }
        });

        if (existing) {
            return res.status(400).json({
                message: 'Teacher already assigned to this classroom',
            });
        }

        const updateClassroom = await prisma.classroom.update({
            where: {
                id: classroomId
            },
            data: {
                teacherId
            },
            select: {
                name: true,
            }
        });

        const updateTeacher = await prisma.teacher.update({
            where: {
                id: teacherId
            },
            data: {
                classroomId
            },
            select: {
                name: true,
            }
        });

        return res.status(201).json({
            message: 'Teacher assigned successfully',
            data: {
                teacher: updateTeacher,
                classroom: updateClassroom
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while assigning teacher',
        });
    }
}

export async function assignStudent(req: Request, res: Response) {
    try {
        const { studentId, classroomId } = req.body as { studentId: number, classroomId: number };

        if (!studentId || !classroomId) {
            return res.status(400).json({
                message: 'Invalid request body',
            });
        }

        const student = await prisma.student.findUnique({
            where: {
                id: studentId
            }
        });

        if (!student) {
            return res.status(404).json({
                message: 'Student not found',
            });
        }

        const classroom = await prisma.classroom.findUnique({
            where: {
                id: classroomId
            }
        });

        if (!classroom) {
            return res.status(404).json({
                message: 'Classroom not found',
            });
        }

        const existing = await prisma.classroom.findUnique({
            where: {
                id: classroomId,
                students: {
                    some: {
                        id: studentId
                    }
                }
            },
            select: {
                students: {
                    where: {
                        id: studentId
                    }
                }
            }
        });

        if (existing) {
            return res.status(400).json({
                message: 'Student already assigned to classroom',
            });
        }

        const updateStudent = await prisma.student.update({
            where: {
                id: studentId
            },
            data: {
                classroomId
            },
            select: {
                name: true,
            }
        });

        const updateClassroom = await prisma.classroom.update({
            where: {
                id: classroomId
            },
            data: {
                students: {
                    connect: {
                        id: studentId
                    }
                }
            },
            select: {
                name: true,
            }
        });

        return res.status(201).json({
            message: 'Student assigned successfully',
            data: {
                student: updateStudent,
                classroom: updateClassroom
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while assigning student',
        });
    }
}

export async function updateTeacher(req: Request, res: Response) {
    try {
        const { name, email, password }: updateDetails = req.body;
        const teacherId: string = req.params.id;

        if (!teacherId || (!name && !email && !password)) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const existTeacher = await prisma.teacher.findFirst({
            where: {
                id: Number(teacherId)
            }
        });

        if (!existTeacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }

        const teacher = await prisma.teacher.update({
            where: {
                id: Number(teacherId)
            },
            data: {
                name,
                email,
                password
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });

        return res.status(201).json({
            message: 'Teacher updated successfully',
            data: {
                teacher
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while updating teacher',
        });

    }
}

export async function deleteTeacher(req: Request, res: Response) {
    try {
        const teacherId: string = req.params.id;
        if (!teacherId) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const teacher = await prisma.teacher.findFirst({
            where: {
                id: Number(teacherId)
            }
        });

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found'
            });
        }

        const deleteTeacher = await prisma.teacher.delete({
            where: {
                id: Number(teacherId)
            },
            select: {
                id: true,
            }
        });

        return res.status(201).json({
            message: 'Teacher deleted successfully',
            data: {
                deleteTeacher
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while deleting teacher',
        });
    }
}

export async function updateStudent(req: Request, res: Response) {
    try {
        const { name, email, password }: updateDetails = req.body;
        const studentId: string = req.params.id;

        if (!studentId || (!name && !email && !password)) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const existStudent = await prisma.student.findFirst({
            where: {
                id: Number(studentId)
            }
        });

        if (!existStudent) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        const student = await prisma.student.update({
            where: {
                id: Number(studentId)
            },
            data: {
                name,
                email,
                password
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            }
        });

        return res.status(201).json({
            message: 'Student updated successfully',
            data: {
                student
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while updating student',
        });
    }
}

export async function deleteStudent(req: Request, res: Response) {
    try {
        const studentId: string = req.params.id;
        if (!studentId) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const student = await prisma.student.findFirst({
            where: {
                id: Number(studentId)
            }
        });

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        const deleteStudent = await prisma.student.delete({
            where: {
                id: Number(studentId)
            },
            select: {
                id: true,
            }
        });

        return res.status(201).json({
            message: 'Student deleted successfully',
            data: {
                deleteStudent
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while deleting student',
        });
    }
}
