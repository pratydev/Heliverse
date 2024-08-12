import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { MenuItem, FormControl, Select } from '@mui/material';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface SignInProps {
  role: string;
  setRole: (role: string) => void;
  setLogin: (login: boolean) => void;
}

export default function SignIn({role, setRole, setLogin} : SignInProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleRoleChange = (value: string) => {
        setRole(value as string);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (email.trim() === '' || password.trim() === '') {
            alert('Email or Password cannot be empty');
            return;
        }

        const userRole: string = role.toLowerCase();

        try {
            const response = await axios.post(`http://localhost:8000/${userRole}/signin`, {
                email,
                password
            });

            if (response.status === 200) {
                const token = response.data.data.token;
                localStorage.setItem('token', token);
                alert('Login successful');
                setLogin(true);
            }
        } catch (error: unknown) { 
            if (error instanceof AxiosError) {
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            alert('Invalid email or password');
                            break;
                        case 404:
                            alert('User not found');
                            break;
                        case 400:
                            alert('Invalid request body');
                            break;
                        default:
                            alert('Something went wrong');
                    }
                } else if (error.request) {
                    alert('No response from server');
                } else {
                    alert('An error occurred while setting up the request');
                }
            } else {
                alert('An unexpected error occurred');
            }
        }

    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FormControl fullWidth margin="normal">
                        <Select
                            id="role"
                            value={role}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            displayEmpty
                            required
                            renderValue={(selected) => (selected ? selected : 'Login As')}
                        >
                            <MenuItem value="Principal">Principal</MenuItem>
                            <MenuItem value="Teacher">Teacher</MenuItem>
                            <MenuItem value="Student">Student</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
