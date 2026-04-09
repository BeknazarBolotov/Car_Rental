import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageUsers from './pages/admin/ManageUsers';
import ManagerDashboard from './pages/manager/ManagerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/my-bookings" element={
            <ProtectedRoute roles={['user']}><MyBookings /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/cars" element={
            <ProtectedRoute roles={['admin','manager']}><ManageCars /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/manager" element={
            <ProtectedRoute roles={['manager','admin']}><ManagerDashboard /></ProtectedRoute>
          } />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a26', color: '#f0eee8', border: '1px solid rgba(201,168,76,0.2)' },
            success: { iconTheme: { primary: '#4caf7d', secondary: '#1a1a26' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}