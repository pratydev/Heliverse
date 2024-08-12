// src/components/PrincipalDashboard.tsx
import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { fetchStudents } from './hooks/fetchStudents';
import { fetchTeachers } from './hooks/fetchTeachers';
import { fetchClassrooms } from './hooks/fetchClassrooms';
import { Teacher } from './hooks/fetchTeachers';
import axios from 'axios';

// Define types for your data
export interface Student {
    id: number;
    name: string;
    email: string;
    password: string;
}



interface PrincipalDashboardProps {
    setLogin: (login: boolean) => void;
}



const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({ setLogin }) => {
    const [openStudentDialog, setOpenStudentDialog] = useState(false);
    const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [openClassroomDialog, setOpenClassroomDialog] = useState(false);

    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPassword, setStudentPassword] = useState('');

    const [teacherName, setTeacherName] = useState('');
    const [teacherEmail, setTeacherEmail] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');

    const [classroomName, setClassroomName] = useState('');

    const [updateType, setUpdateType] = useState<'student' | 'teacher' | null>(null);
    const [updateId, setUpdateId] = useState<number | null>(null);

    const { classroomStudents, setClassroomStudents } = fetchStudents({ setLogin });

    const { teachers, setTeachers } = fetchTeachers({ setLogin });

    const { classrooms, setClassrooms } = fetchClassrooms({ setLogin });

    const handleCreate = (type: 'student' | 'teacher' | 'classroom') => {
        if (type === 'student') {
            setOpenStudentDialog(true);
        } else if (type === 'teacher') {
            setOpenTeacherDialog(true);
        } else if (type === 'classroom') {
            setOpenClassroomDialog(true);
        }
    };

    const handleUpdate = (type: 'student' | 'teacher', id: number) => {
        setUpdateType(type);
        setUpdateId(id);
        if (type === 'student') {
            const student = classroomStudents.find(s => s.id === id);
            if (student) {
                setStudentName(student.name);
                setStudentEmail(student.email);
                setStudentPassword(student.password);
            }
        } else if (type === 'teacher') {
            const teacher = teachers.find(t => t.id === id);
            if (teacher) {
                setTeacherName(teacher.name);
                setTeacherEmail(teacher.email);
                setTeacherPassword(teacher.password);
            }
        }
        setOpenUpdateDialog(true);
    };

    const handleCloseStudentDialog = () => {
        setOpenStudentDialog(false);
        setStudentName('');
        setStudentEmail('');
        setStudentPassword('');
    };

    const handleCloseTeacherDialog = () => {
        setOpenTeacherDialog(false);
        setTeacherName('');
        setTeacherEmail('');
        setTeacherPassword('');
    };

    const handleCloseClassroomDialog = () => {
        setOpenClassroomDialog(false);
        setClassroomName('');
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setUpdateType(null);
        setUpdateId(null);
        setStudentName('');
        setStudentEmail('');
        setStudentPassword('');
        setTeacherName('');
        setTeacherEmail('');
        setTeacherPassword('');
    };

    const handleSubmitStudent = async () => {
        if(studentName.trim() === '' || studentEmail.trim() === '' || studentPassword.trim() === ''){
            alert('Please fill in all fields');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/principal/create-student', {
                name: studentName,
                email: studentEmail,
                password: studentPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 201) {
                setClassroomStudents([...classroomStudents, response.data.data.student]);
                setStudentName('');
                setStudentEmail('');
                setStudentPassword('');
                alert('Student created successfully');
            }
        } catch (error) {
            console.error('Error creating student:', error);
            alert('Error creating Student');
        } 
        handleCloseStudentDialog();
    };

    const handleSubmitTeacher = async () => {
        if(teacherName.trim() === '' || teacherEmail.trim() === '' || teacherPassword.trim() === '') {
            alert('Please fill in all fields');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/principal/create-teacher', {
                name: teacherName,
                email: teacherEmail,
                password: teacherPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 201) {
                setTeachers([...teachers, response.data.data.teacher]);
                setTeacherName('');
                setTeacherEmail('');
                setTeacherPassword('');
                alert('Teacher created successfully');
            }
        } catch (error) {
            console.error('Error creating Teacher:', error);
            alert('Error creating Teacher');
            
        }

        handleCloseTeacherDialog();
    };

    const handleSubmitClassroom = async() => {
        if (classroomName.trim() === '') {
            alert('Classroom name cannot be empty');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }
        try {
            const response = await axios.post('http://localhost:8000/principal/create-classroom', {
                name: classroomName,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.status === 201) {
                setClassroomName('');
                setClassrooms([...classrooms, response.data.data.classroom]);
                alert('Classroom created successfully');
            }
        } catch (error) {
            console.error('Error creating classroom:', error);
            alert('Error creating classroom');
            
        }
        handleCloseClassroomDialog();
    };

    const handleSubmitUpdate = async () => {
        if (updateType === 'student') {
            const token = localStorage.getItem('token');
            if (!token) {
                setLogin(false);
                return;
            }
            try {
                const response = await axios.put('http://localhost:8000/principal/update-student', {
                    name: studentName,
                    email: studentEmail,
                    password: studentPassword,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    const student = response.data.data.student;
                    classroomStudents.map((s: Student) => {
                        if (s.id === student.id) {
                            s.name = student.name;
                            s.email = student.email;
                            s.password = student.password;
                        }
                    });
                    alert('Student updated successfully');
                }
            } catch (error) {
                console.error('Error updating student:', error);
                alert('Failed to update student');
            }
        } else if (updateType === 'teacher') {
            const token = localStorage.getItem('token');
            if (!token) {
                setLogin(false);
                return;
            }
            try {
                const response = await axios.put('http://localhost:8000/principal/update-teacher', {
                    name: teacherName,
                    email: teacherEmail,
                    password: teacherPassword,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    const teacher = response.data.data.teacher;
                    teachers.map((t: Teacher) => {
                        if (t.id === teacher.id) {
                            t.name = teacher.name;
                            t.email = teacher.email;
                            t.password = teacher.password;
                        }
                    });
                    alert('Teacher updated successfully');
                }
            } catch (error) {
                console.error('Error updating Teacher:', error);
                alert('Failed to update Teacher');
            }
        }
        handleCloseUpdateDialog();
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom align="center">
                Principal Dashboard
            </Typography>

            <Box display="flex" justifyContent="center" mb={4}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleCreate('student')} sx={{ mx: 1 }}>
                    Create Student
                </Button>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleCreate('teacher')} sx={{ mx: 1 }}>
                    Create Teacher
                </Button>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleCreate('classroom')} sx={{ mx: 1 }}>
                    Create Classroom
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ p: 2, mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Students</Typography>
                            <Divider sx={{ my: 2 }} />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classroomStudents.map((student) => (
                                            <TableRow key={student.id}>
                                                <TableCell>{student.name}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary" onClick={() => handleUpdate('student', student.id)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => console.log(`Delete student with id ${student.id}`)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ p: 2, mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Teachers</Typography>
                            <Divider sx={{ my: 2 }} />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {teachers.map((teacher) => (
                                            <TableRow key={teacher.id}>
                                                <TableCell>{teacher.name}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton color="primary" onClick={() => handleUpdate('teacher', teacher.id)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton color="error" onClick={() => console.log(`Delete teacher with id ${teacher.id}`)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6} lg={3}>
                    <Card sx={{ p: 2, mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Classrooms</Typography>
                            <Divider sx={{ my: 2 }} />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {classrooms.map((classroom) => (
                                            <TableRow key={classroom.id}>
                                                <TableCell>{classroom.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Create Student Dialog */}
            <Dialog open={openStudentDialog} onClose={handleCloseStudentDialog}>
                <DialogTitle>Create Student</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStudentDialog}>Cancel</Button>
                    <Button onClick={handleSubmitStudent}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Create Teacher Dialog */}
            <Dialog open={openTeacherDialog} onClose={handleCloseTeacherDialog}>
                <DialogTitle>Create Teacher</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseTeacherDialog}>Cancel</Button>
                    <Button onClick={handleSubmitTeacher}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Create Classroom Dialog */}
            <Dialog open={openClassroomDialog} onClose={handleCloseClassroomDialog}>
                <DialogTitle>Create Classroom</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={classroomName}
                        onChange={(e) => setClassroomName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseClassroomDialog}>Cancel</Button>
                    <Button onClick={handleSubmitClassroom}>Submit</Button>
                </DialogActions>
            </Dialog>

            {/* Update Dialog */}
            <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
                <DialogTitle>{updateType === 'student' ? 'Update Student' : 'Update Teacher'}</DialogTitle>
                <DialogContent>
                    {updateType === 'student' ? (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                fullWidth
                                variant="outlined"
                                value={studentName}
                                onChange={(e) => setStudentName(e.target.value)}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Email"
                                fullWidth
                                variant="outlined"
                                value={studentEmail}
                                onChange={(e) => setStudentEmail(e.target.value)}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={studentPassword}
                                onChange={(e) => setStudentPassword(e.target.value)}
                                required
                            />
                        </>
                    ) : (
                        <>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Name"
                                fullWidth
                                variant="outlined"
                                value={teacherName}
                                onChange={(e) => setTeacherName(e.target.value)}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Email"
                                fullWidth
                                variant="outlined"
                                value={teacherEmail}
                                onChange={(e) => setTeacherEmail(e.target.value)}
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Password"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={teacherPassword}
                                onChange={(e) => setTeacherPassword(e.target.value)}
                                required
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
                    <Button onClick={handleSubmitUpdate}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PrincipalDashboard;
