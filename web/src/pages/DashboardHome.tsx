import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import client from '../api/client';

const DashboardHome = () => {
    const [stats, setStats] = useState({ tasks: 0, pending: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await client.get('/tasks');
            // Basic client-side calculation for demo
            const total = data?.tasks?.length;
            const pending = data?.tasks?.filter((t: any) => t.status === 'Pending').length;
            const completed = data?.tasks?.filter((t: any) => t.status === 'Completed').length;
            setStats({ tasks: total, pending, completed });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Overview</Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Total Tasks</Typography>
                        <Typography variant="h3" color="primary">{stats.tasks}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Pending</Typography>
                        <Typography variant="h3" color="warning.main">{stats.pending}</Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6">Completed</Typography>
                        <Typography variant="h3" color="success.main">{stats.completed}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardHome;
