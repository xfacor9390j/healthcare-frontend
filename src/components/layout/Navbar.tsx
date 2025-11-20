import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Calendar, Home } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <span className="text-xl font-bold text-gray-900">HealthCare</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-blue-600 transition flex items-center space-x-1">
                            <Home size={18} />
                            <span>Home</span>
                        </Link>

                        {isAuthenticated && (
                            <>
                                {user?.role === 'patient' && (
                                    <>
                                        <Link
                                            to="/doctors"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            Find Doctors
                                        </Link>
                                        <Link
                                            to="/patient/appointments"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            My Appointments
                                        </Link>
                                    </>
                                )}

                                {user?.role === 'doctor' && (
                                    <>
                                        <Link
                                            to="/doctor/dashboard"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/doctor/appointments"
                                            className="text-gray-700 hover:text-blue-600 transition"
                                        >
                                            Appointments
                                        </Link>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                <div className="hidden md:flex items-center space-x-2 text-sm">
                                    <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                                        {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
                                    </div>
                                    <span className="text-gray-700">
                    {user.profile.firstName} {user.profile.lastName}
                  </span>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu (simplified) */}
            {isAuthenticated && (
                <div className="md:hidden bg-gray-50 px-4 py-3 border-t">
                    <div className="text-sm text-gray-700 mb-2">
                        {user?.profile.firstName} {user?.profile.lastName} ({user?.role})
                    </div>
                    <div className="space-y-2">
                        {user?.role === 'patient' && (
                            <>
                                <Link
                                    to="/doctors"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    Find Doctors
                                </Link>
                                <Link
                                    to="/patient/appointments"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    My Appointments
                                </Link>
                            </>
                        )}
                        {user?.role === 'doctor' && (
                            <>
                                <Link
                                    to="/doctor/dashboard"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/doctor/appointments"
                                    className="block text-gray-700 hover:text-blue-600"
                                >
                                    Appointments
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;