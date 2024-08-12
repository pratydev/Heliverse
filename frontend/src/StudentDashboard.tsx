import React from 'react';
import { Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { fetchStudents } from './hooks/fetchStudents';
import { Student } from './hooks/fetchStudents';

interface StudentDashboardProps {
    setLogin: (login: boolean) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({setLogin}) => {
    const {classroomStudents }= fetchStudents({setLogin});

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom align="center">
                Student Dashboard
            </Typography>

            <Card sx={{ p: 2, mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Students in Your Classroom</Typography>
                    <Divider sx={{ my: 2 }} />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classroomStudents.map((student: Student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.email}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    );
};

export default StudentDashboard;
