import { useState, useEffect } from "react";
import axios from "axios";

export interface Student {
    id: number;
    name: string;
    email: string;
    password: string;
}

export function fetchStudents({ setLogin }: { setLogin: (login: boolean) => void }) {
    const [classroomStudents, setClassroomStudents] = useState<Student[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }
        axios.get('http://localhost:8000/student/fetch-classmates', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setClassroomStudents(response.data.data.students);
        })
        .catch(error => {
            console.error('Error fetching classroom students:', error);
        });
    }, []);

    return {
        classroomStudents,
        setClassroomStudents
    }
}