import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Heart } from 'lucide-react';

const PatientDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.profile.firstName}! 👋
                </h1>
                <p className="text-gray-600">
                    Manage your health appointments and find the best doctors
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Upcoming</p>
                            <p className="text-2xl font-bold text-blue-600">0</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Calendar className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Completed</p>
                            <p className="text-2xl font-bold text-green-600">0</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <Clock className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Doctors</p>
                            <p className="text-2xl font-bold text-purple-600">0</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <User className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Health Score</p>
                            <p className="text-2xl font-bold text-red-600">98%</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <Heart className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <button className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition font-medium">
                        📅 Book New Appointment
                    </button>
                    <button className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition font-medium">
                        👨‍⚕️ Find Doctors
                    </button>
                    <button className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition font-medium">
                        📋 View History
                    </button>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
                <div className="text-center py-12">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500 mb-4">No upcoming appointments</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Book Your First Appointment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;