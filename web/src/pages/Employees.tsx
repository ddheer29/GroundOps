import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import client from '../api/client';

const Employees = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'FieldAgent' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await client.get('/users'); 
            setUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleInvite = async () => {
        try {
            await client.post('/auth/invite', inviteData);
            alert('Invitation sent! Check backend console for link.');
            setOpen(false);
            setInviteData({ email: '', name: '', role: 'FieldAgent' });
            fetchUsers();
        } catch (e: any) {
            console.error(e);
            alert('Failed to invite: ' + (e.response?.data?.message || e.message || 'Unknown error'));
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Employees</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Invite Employee</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username/Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user: any) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.status || 'Active'} 
                                        color={user.status === 'Active' ? 'success' : 'warning'} 
                                        size="small" 
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Invite Employee</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={inviteData.email}
                        onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Name"
                        fullWidth
                        value={inviteData.name}
                        onChange={(e) => setInviteData({...inviteData, name: e.target.value})}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={inviteData.role}
                            label="Role"
                            onChange={(e) => setInviteData({...inviteData, role: e.target.value})}
                        >
                            <MenuItem value="FieldAgent">Field Agent</MenuItem>
                            <MenuItem value="Manager">Manager</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleInvite} variant="contained">Send Invite</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Employees;
