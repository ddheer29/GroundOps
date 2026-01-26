import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import DashboardHome from './pages/DashboardHome';
import Tasks from './pages/Tasks';
import Employees from './pages/Employees';
import SetPassword from './pages/SetPassword';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007AFF',
    },
    background: {
      default: '#F2F2F7',
    },
  },
});

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route index element={<DashboardHome />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="employees" element={<Employees />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
