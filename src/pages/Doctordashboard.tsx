import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Users, DollarSign } from 'lucide-react';

const DoctorDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome, Dr. {user?.profile.lastName}! 👨‍⚕️
                </h1>
                <p className="text-gray-600">
                    {user?.doctorProfile?.specialization} • {user?.doctorProfile?.yearsOfExperience} years experience
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Today's Appointments</p>
                            <p className="text-3xl font-bold text-blue-600">0</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Calendar className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Pending</p>
                            <p className="text-3xl font-bold text-yellow-600">0</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <Clock className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Patients</p>
                            <p className="text-3xl font-bold text-green-600">0</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Consultation Fee</p>
                            <p className="text-3xl font-bold text-purple-600">${user?.doctorProfile?.consultationFee}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <DollarSign className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    <button className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition font-medium">
                        📅 View Schedule
                    </button>
                    <button className="bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition font-medium">
                        👥 Patient List
                    </button>
                    <button className="bg-purple-600 text-white px-6 py-4 rounded-lg hover:bg-purple-700 transition font-medium">
                        ⚙️ Settings
                    </button>
                </div>
            </div>

            {/* Today's Schedule */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
                    <div className="text-center py-12">
                        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No appointments scheduled for today</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Requests</h2>
                    <div className="text-center py-12">
                        <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No pending appointment requests</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;