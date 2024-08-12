import { useState, useEffect } from "react";
import axios from "axios";

export interface Teacher {
    id: number;
    name: string;
    email: string;
    password: string;
}

export function fetchTeachers({ setLogin }: { setLogin: (login: boolean) => void }) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }
        axios.get('http://localhost:8000/principal/fetch-teachers', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setTeachers(response.data.data.teachers);
        })
        .catch(error => {
            console.error('Error fetching classroom students:', error);
        });
    }, []);

    return {
        teachers,
        setTeachers
    }
}