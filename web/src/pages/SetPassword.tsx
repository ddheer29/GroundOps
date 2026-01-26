import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const { login } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const { data } = await client.post('/auth/set-password', { token, password });
            login(data.token, data.user); // Auto login
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to set password');
        }
    };

    if (!token) return <Typography>Invalid Link</Typography>;

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h4" color="primary" gutterBottom>
                    FieldSync
                </Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <Typography component="h2" variant="h5" align="center">
                        Set Your Password
                    </Typography>
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Set Password & Login
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default SetPassword;
