// src/components/TeacherDashboard.tsx
import React, { useState } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Divider, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Student } from './PrincipalDashboard';
import axios from 'axios';
import { fetchStudents } from './hooks/fetchStudents';

interface TeacherDashboardProps {
    setLogin: (login: boolean) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setLogin }) => {
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPassword, setStudentPassword] = useState('');

    const { classroomStudents, setClassroomStudents } = fetchStudents({ setLogin });

    const handleOpenUpdateDialog = (student: Student) => {
        setSelectedStudent(student);
        setStudentName(student.name);
        setStudentEmail(student.email);
        setStudentPassword(student.password);
        setOpenUpdateDialog(true);
    };

    const handleCloseUpdateDialog = () => {
        setOpenUpdateDialog(false);
        setSelectedStudent(null);
        setStudentName('');
        setStudentEmail('');
        setStudentPassword('');
    };

    const handleUpdateStudent = async () => {
        if (!selectedStudent) {
            handleCloseUpdateDialog();
            return;
        }
        if (selectedStudent.name === studentName && selectedStudent.email === studentEmail && selectedStudent.password === studentPassword) {
            alert('No changes made');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }
        try {
            const response = await axios.put('http://localhost:8000/teacher/update-student', {
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
        handleCloseUpdateDialog();
    };

    const handleDeleteStudent = async (id: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }
        try {
            const response = await axios.delete('http://localhost:8000/teacher/delete-student', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const filteredStudents = classroomStudents.filter((s: Student) => s.id !== id);
                setClassroomStudents(filteredStudents);
                alert('Student updated successfully');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            alert('Failed to delete student');
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom align="center">
                Teacher Dashboard
            </Typography>

            <Card sx={{ p: 2, mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Students in Classroom</Typography>
                    <Divider sx={{ my: 2 }} />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classroomStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell align="right">
                                            <IconButton color="primary" onClick={() => handleOpenUpdateDialog(student)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDeleteStudent(student.id)}>
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

            {/* Update Student Dialog */}
            <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
                <DialogTitle>Update Student</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseUpdateDialog}>Cancel</Button>
                    <Button onClick={handleUpdateStudent}>Submit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TeacherDashboard;
