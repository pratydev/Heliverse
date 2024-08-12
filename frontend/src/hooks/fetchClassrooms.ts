import { useState, useEffect } from "react";
import axios from "axios";

interface Classroom {
    id: number;
    name: string;
}

export function fetchClassrooms({ setLogin }: { setLogin: (login: boolean) => void }) {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLogin(false);
            return;
        }
        axios.get('http://localhost:8000/principal/fetch-classrooms', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setClassrooms(response.data.data.classrooms);
        })
        .catch(error => {
            console.error('Error fetching classroom students:', error);
        });
    }, []);

    return {
        classrooms,
        setClassrooms
    }
}