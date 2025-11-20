import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import type { User } from '../types';
import { Search, DollarSign, Award, Calendar } from 'lucide-react';

const DoctorList = () => {
    const [doctors, setDoctors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');

    const specializations = [
        'All',
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Pediatrics',
        'Orthopedics',
        'General Practice',
    ];

    useEffect(() => {
        fetchDoctors();
    }, [selectedSpecialization]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (selectedSpecialization && selectedSpecialization !== 'All') {
                params.specialization = selectedSpecialization;
            }

            const response = await userService.getDoctors(params);
            if (response.success) {
                // @ts-ignore
                setDoctors(response.data.doctors);
            }
        } catch (err: any) {
            setError('Failed to load doctors');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${doctor.profile.firstName} ${doctor.profile.lastName}`.toLowerCase();
        const specialization = doctor.doctorProfile?.specialization.toLowerCase() || '';

        return fullName.includes(searchLower) || specialization.includes(searchLower);
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
                    <p className="text-gray-600">Browse our qualified healthcare professionals</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name or specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Specialization Filter */}
                        <select
                            value={selectedSpecialization}
                            onChange={(e) => setSelectedSpecialization(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {specializations.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec === 'All' ? 'All Specializations' : spec}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        Found <span className="font-semibold">{filteredDoctors.length}</span> doctors
                    </p>
                </div>

                {/* Doctor Cards Grid */}
                {filteredDoctors.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                            >
                                {/* Doctor Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white text-blue-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                                            {doctor.profile.firstName[0]}
                                            {doctor.profile.lastName[0]}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">
                                                Dr. {doctor.profile.firstName} {doctor.profile.lastName}
                                            </h3>
                                            <p className="text-blue-100">
                                                {doctor.doctorProfile?.specialization}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Details */}
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <Award className="mr-2" size={18} />
                                        <span className="text-sm">
                      {doctor.doctorProfile?.yearsOfExperience} years experience
                    </span>
                                    </div>

                                    <div className="flex items-center text-gray-600">
                                        <DollarSign className="mr-2" size={18} />
                                        <span className="text-sm">
                      ${doctor.doctorProfile?.consultationFee} per consultation
                    </span>
                                    </div>

                                    {doctor.doctorProfile?.qualifications && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {doctor.doctorProfile.qualifications.slice(0, 3).map((qual, idx) => (
                                                <span
                                                    key={idx}
                                                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                                >
                          {qual}
                        </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Book Button */}
                                    <Link
                                        to={`/book-appointment/${doctor.id}`}
                                        className="block w-full mt-4 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        <Calendar className="inline mr-2" size={18} />
                                        Book Appointment
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorList;