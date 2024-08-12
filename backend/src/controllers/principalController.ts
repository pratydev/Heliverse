import { Request, Response } from 'express';
import { prisma } from '..';
import zod from 'zod';

const creationSchema = zod.object({
    name: zod.string().min(3, 'Name must be at least 3 characters long').max(30, 'Name must be at most 30 characters long'),
    emailId: zod.string().email(),
    password: zod.string().min(6, 'Password must be at least 6 characters long').max(30, 'Password must be at most 30 characters long'),
});

interface updateDetails {
    name?: string;
    emailId?: string;
    password?: string;
}

async function createPrincipal(req: Request, res: Response) {
    try {
        const response = creationSchema.safeParse(req.body);

        if (!response.success) {
            return res.status(400).json({
                message: 'Invalid request body',
            });
        }

        const { emailId, password } = req.body as { emailId: string, password: string };

        const principal = await prisma.principal.create({
            data: {
                email: emailId,
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

async function createTeacher(req: Request, res: Response) {
    try {
        const response = creationSchema.safeParse(req.body);

        if (!response.success) {
            return res.status(400).json({
                message: 'Invalid request body',
            });
        }

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


async function createStudent(req: Request, res: Response) {
    try {
        const response = creationSchema.safeParse(req.body);

        if (!response.success) {
            return res.status(400).json({
                message: 'Invalid request body',
            });
        }

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

async function createClassroom(req: Request, res: Response) {
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
            }
        });

        return res.status(201).json({
            message: 'Classroom created successfully',
            data: {
                id: classroom.id
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error while creating classroom',
        });
    }
}


async function assignTeacher(req: Request, res: Response) {
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


async function assignStudent(req: Request, res: Response) {
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

async function updateTeacher(req: Request, res: Response) {
    try {
        const { name, emailId, password }: updateDetails = req.body;
        const teacherId: string = req.params.id;

        if (!teacherId || (!name && !emailId && !password)) {
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
                email: emailId,
                password
            },
            select: {
                name: true,
                email: true,
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

async function deleteTeacher(req: Request, res: Response) {
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

async function updateStudent(req: Request, res: Response) {
    try {
        const { name, emailId, password }: updateDetails = req.body;
        const studentId: string = req.params.id;

        if (!studentId || (!name && !emailId && !password)) {
            return res.status(400).json({
                message: 'Invalid request body'
            });
        }

        const existStudent = await prisma.student.findFirst({
            where: {
                id: Number(studentId)
            }
        });

        if(!existStudent) {
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
                email: emailId,
                password
            },
            select: {
                name: true,
                email: true,
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

async function deleteStudent(req: Request, res: Response) {
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

export {
    createPrincipal,
    createTeacher,
    createStudent,
    assignTeacher,
    assignStudent,
    updateTeacher,
    deleteTeacher,
    updateStudent,
    deleteStudent,
    createClassroom
}