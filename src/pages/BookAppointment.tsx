import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { appointmentService } from '../services/appointmentService';
import type { User, TimeSlot } from '../types';
import { Calendar, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

const BookAppointment = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState<User | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [reason, setReason] = useState('');
    const [patientNotes, setPatientNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Generate next 7 days
    const availableDates = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(new Date(), i + 1);
        return {
            value: format(date, 'yyyy-MM-dd'),
            label: format(date, 'EEE, MMM dd'),
            full: date,
        };
    });

    useEffect(() => {
        if (doctorId) {
            fetchDoctor();
        }
    }, [doctorId]);

    useEffect(() => {
        if (selectedDate && doctorId) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctorId]);

    const fetchDoctor = async () => {
        try {
            setLoading(true);
            const response = await userService.getDoctorById(doctorId!);
            if (response.success) {
                // @ts-ignore
                setDoctor(response.data.user);
            }
        } catch (err) {
            setError('Failed to load doctor information');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableSlots = async () => {
        try {
            const response = await appointmentService.getAvailableSlots(doctorId!, selectedDate);
            if (response.success) {
                // @ts-ignore
                setAvailableSlots(response.data.availableSlots);
            }
        } catch (err) {
            console.error('Failed to load slots:', err);
            setAvailableSlots([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSlot) {
            setError('Please select a time slot');
            return;
        }

        if (reason.length < 10) {
            setError('Please provide a detailed reason (at least 10 characters)');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await appointmentService.createAppointment({
                doctorId: doctorId!,
                date: selectedDate,
                timeSlot: selectedSlot,
                reason,
                patientNotes,
            });

            if (response.success) {
                setSuccess('Appointment booked successfully!');
                setTimeout(() => {
                    navigate('/patient/appointments');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to book appointment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
                    <button
                        onClick={() => navigate('/doctors')}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Back to doctor list
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Doctor Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-start space-x-4">
                        <div className="bg-blue-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
                            {doctor.profile.firstName[0]}
                            {doctor.profile.lastName[0]}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Dr. {doctor.profile.firstName} {doctor.profile.lastName}
                            </h1>
                            <p className="text-gray-600">{doctor.doctorProfile?.specialization}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                <span>⭐ {doctor.doctorProfile?.yearsOfExperience} years</span>
                                <span className="flex items-center">
                  <DollarSign size={16} />
                                    {doctor.doctorProfile?.consultationFee}
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Book an Appointment</h2>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Date Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline mr-2" size={18} />
                            Select Date
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {availableDates.map((date) => (
                                <button
                                    key={date.value}
                                    type="button"
                                    onClick={() => {
                                        setSelectedDate(date.value);
                                        setSelectedSlot(null);
                                    }}
                                    className={`p-3 border-2 rounded-lg text-center transition ${
                                        selectedDate === date.value
                                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <div className="font-semibold">{date.label.split(',')[0]}</div>
                                    <div className="text-sm">{date.label.split(',')[1]}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Time Slot Selection */}
                    {selectedDate && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="inline mr-2" size={18} />
                                Select Time Slot
                            </label>
                            {availableSlots.length === 0 ? (
                                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
                                    No available slots for this date. Please select another date.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                    {availableSlots.map((slot, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`p-3 border-2 rounded-lg text-center transition ${
                                                selectedSlot?.startTime === slot.startTime
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {slot.startTime}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reason */}
                    <div className="mb-6">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Visit *
                        </label>
                        <textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Please describe your symptoms or reason for consultation..."
                        />
                        <p className="text-sm text-gray-500 mt-1">Minimum 10 characters</p>
                    </div>

                    {/* Patient Notes */}
                    <div className="mb-6">
                        <label htmlFor="patientNotes" className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes (Optional)
                        </label>
                        <textarea
                            id="patientNotes"
                            value={patientNotes}
                            onChange={(e) => setPatientNotes(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Any additional information you'd like the doctor to know..."
                        />
                    </div>

                    {/* Summary */}
                    {selectedDate && selectedSlot && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold text-blue-900 mb-2">Appointment Summary</h3>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p>
                                    <strong>Doctor:</strong> Dr. {doctor.profile.firstName} {doctor.profile.lastName}
                                </p>
                                <p>
                                    <strong>Date:</strong> {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
                                </p>
                                <p>
                                    <strong>Time:</strong> {selectedSlot.startTime} - {selectedSlot.endTime}
                                </p>
                                <p>
                                    <strong>Fee:</strong> ${doctor.doctorProfile?.consultationFee}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/doctors')}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedDate || !selectedSlot}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointment;