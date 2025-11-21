// import { useState, useEffect } from 'react';
// import { appointmentService } from '../services/appointmentService';
// import type { Appointment } from '../types';
// import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
// import { format } from 'date-fns';
//
// const DoctorAppointments = () => {
//     const [appointments, setAppointments] = useState<Appointment[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [filter, setFilter] = useState<string>('all');
//     const [error, setError] = useState('');
//     const [updatingId, setUpdatingId] = useState<string | null>(null);
//
//     useEffect(() => {
//         fetchAppointments();
//     }, [filter]);
//
//     const fetchAppointments = async () => {
//         try {
//             setLoading(true);
//             const params: any = {};
//             if (filter !== 'all') {
//                 params.status = filter;
//             }
//
//             const response = await appointmentService.getMyAppointments(params);
//             if (response.success) {
//                 // @ts-ignore
//                 setAppointments(response.data.appointments);
//             }
//         } catch (err) {
//             setError('Failed to load appointments');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleUpdateStatus = async (
//         appointmentId: string,
//         status: string,
//         notes?: string
//     ) => {
//         try {
//             setUpdatingId(appointmentId);
//             await appointmentService.updateAppointmentStatus(appointmentId, status, notes);
//             fetchAppointments(); // Refresh list
//         } catch (err: any) {
//             alert(err.response?.data?.message || 'Failed to update appointment');
//         } finally {
//             setUpdatingId(null);
//         }
//     };
//
//     const handleConfirm = async (appointmentId: string) => {
//         const notes = prompt('Add notes for the patient (optional):');
//         await handleUpdateStatus(appointmentId, 'confirmed', notes || undefined);
//     };
//
//     const handleReject = async (appointmentId: string) => {
//         const notes = prompt('Reason for rejection (optional):');
//         if (confirm('Are you sure you want to reject this appointment?')) {
//             await handleUpdateStatus(appointmentId, 'rejected', notes || undefined);
//         }
//     };
//
//     const handleComplete = async (appointmentId: string) => {
//         const notes = prompt('Add consultation notes:');
//         await handleUpdateStatus(appointmentId, 'completed', notes || undefined);
//     };
//
//     const getStatusBadge = (status: string) => {
//         const styles = {
//             pending: 'bg-yellow-100 text-yellow-800',
//             confirmed: 'bg-green-100 text-green-800',
//             completed: 'bg-blue-100 text-blue-800',
//             cancelled: 'bg-red-100 text-red-800',
//             rejected: 'bg-gray-100 text-gray-800',
//         };
//
//         return (
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </span>
//         );
//     };
//
//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }
//
//     return (
//         <div className="min-h-screen bg-gray-50 py-8">
//             <div className="container mx-auto px-4">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
//                     <p className="text-gray-600">Manage your patient appointments</p>
//                 </div>
//
//                 {/* Filter Tabs */}
//                 <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//                     <div className="flex space-x-2 overflow-x-auto">
//                         {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
//                             <button
//                                 key={status}
//                                 onClick={() => setFilter(status)}
//                                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
//                                     filter === status
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 {status.charAt(0).toUpperCase() + status.slice(1)}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//
//                 {/* Error Message */}
//                 {error && (
//                     <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
//                         {error}
//                     </div>
//                 )}
//
//                 {/* Appointments List */}
//                 {appointments.length === 0 ? (
//                     <div className="bg-white rounded-lg shadow-md p-12 text-center">
//                         <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
//                         <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                             No appointments found
//                         </h3>
//                         <p className="text-gray-600">
//                             {filter === 'all'
//                                 ? 'No patients have booked appointments yet'
//                                 : `No ${filter} appointments`}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {appointments.map((appointment) => (
//                             <div
//                                 key={appointment.id}
//                                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
//                             >
//                                 <div className="flex justify-between items-start mb-4">
//                                     <div>{getStatusBadge(appointment.status)}</div>
//                                     <div className="text-right text-sm text-gray-500">
//                                         Booked: {format(new Date(appointment.createdAt), 'MMM dd, yyyy')}
//                                     </div>
//                                 </div>
//
//                                 <div className="grid md:grid-cols-2 gap-6">
//                                     {/* Appointment Details */}
//                                     <div>
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                                             Appointment Details
//                                         </h3>
//                                         <div className="space-y-2 text-sm">
//                                             <div className="flex items-center text-gray-600">
//                                                 <Calendar className="mr-2" size={18} />
//                                                 <span>
//                           {format(new Date(appointment.date), 'EEEE, MMMM dd, yyyy')}
//                         </span>
//                                             </div>
//                                             <div className="flex items-center text-gray-600">
//                                                 <Clock className="mr-2" size={18} />
//                                                 <span>
//                           {appointment.startTime} - {appointment.endTime}
//                         </span>
//                                             </div>
//                                         </div>
//
//                                         <div className="mt-4">
//                                             <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
//                                             <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
//                                                 {appointment.reason}
//                                             </p>
//                                         </div>
//
//                                         {appointment.patientNotes && (
//                                             <div className="mt-3">
//                                                 <p className="text-sm font-medium text-gray-700 mb-1">Patient Notes:</p>
//                                                 <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
//                                                     {appointment.patientNotes}
//                                                 </p>
//                                             </div>
//                                         )}
//
//                                         {appointment.doctorNotes && (
//                                             <div className="mt-3">
//                                                 <p className="text-sm font-medium text-gray-700 mb-1">Your Notes:</p>
//                                                 <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">
//                                                     {appointment.doctorNotes}
//                                                 </p>
//                                             </div>
//                                         )}
//                                     </div>
//
//                                     {/* Patient Info */}
//                                     <div>
//                                         <h3 className="text-lg font-semibold text-gray-900 mb-3">
//                                             Patient Information
//                                         </h3>
//                                         <div className="bg-gray-50 p-4 rounded-lg">
//                                             {typeof appointment.patient === 'object' && appointment.patient ? (
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
//                                                         {appointment.patient.profile?.firstName?.[0] || 'P'}
//                                                         {appointment.patient.profile?.lastName?.[0] || 'T'}
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-semibold text-gray-900">
//                                                             {appointment.patient.profile?.firstName || ''} {appointment.patient.profile?.lastName || ''}
//                                                         </p>
//                                                         <p className="text-sm text-gray-600">
//                                                             Patient ID: {appointment.patient.id?.substring(0, 8) || 'N/A'}
//                                                         </p>
//                                                         {appointment.patient.profile?.phone && (
//                                                             <p className="text-sm text-gray-500">
//                                                                 Phone: {appointment.patient.profile.phone}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="flex items-center space-x-3">
//                                                     <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
//                                                         P
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-semibold text-gray-900">Patient</p>
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//
//                                 {/* Actions */}
//                                 {appointment.status === 'pending' && (
//                                     <div className="mt-6 pt-4 border-t flex space-x-3">
//                                         <button
//                                             onClick={() => handleConfirm(appointment.id)}
//                                             disabled={updatingId === appointment.id}
//                                             className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
//                                         >
//                                             <CheckCircle size={18} />
//                                             <span>Confirm</span>
//                                         </button>
//                                         <button
//                                             onClick={() => handleReject(appointment.id)}
//                                             disabled={updatingId === appointment.id}
//                                             className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
//                                         >
//                                             <XCircle size={18} />
//                                             <span>Reject</span>
//                                         </button>
//                                     </div>
//                                 )}
//
//                                 {appointment.status === 'confirmed' && (
//                                     <div className="mt-6 pt-4 border-t">
//                                         <button
//                                             onClick={() => handleComplete(appointment.id)}
//                                             disabled={updatingId === appointment.id}
//                                             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
//                                         >
//                                             <CheckCircle size={18} />
//                                             <span>Mark as Completed</span>
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default DoctorAppointments;

import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import type { Appointment } from '../types';
import { Calendar, Clock, CheckCircle, XCircle, Video } from 'lucide-react';
import { format } from 'date-fns';
import VideoCall from './VideoCall';
import { useAuth } from '../context/AuthContext';

const DoctorAppointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Video call state
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params: any = {};
            if (filter !== 'all') {
                params.status = filter;
            }

            const response = await appointmentService.getMyAppointments(params);
            if (response.success) {
                // @ts-ignore
                setAppointments(response.data.appointments);
            }
        } catch (err) {
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (
        appointmentId: string,
        status: string,
        notes?: string
    ) => {
        try {
            setUpdatingId(appointmentId);
            await appointmentService.updateAppointmentStatus(appointmentId, status, notes);
            fetchAppointments(); // Refresh list
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update appointment');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleConfirm = async (appointmentId: string) => {
        const notes = prompt('Add notes for the patient (optional):');
        await handleUpdateStatus(appointmentId, 'confirmed', notes || undefined);
    };

    const handleReject = async (appointmentId: string) => {
        const notes = prompt('Reason for rejection (optional):');
        if (confirm('Are you sure you want to reject this appointment?')) {
            await handleUpdateStatus(appointmentId, 'rejected', notes || undefined);
        }
    };

    const handleComplete = async (appointmentId: string) => {
        const notes = prompt('Add consultation notes:');
        await handleUpdateStatus(appointmentId, 'completed', notes || undefined);
    };

    // Video call handler
    const handleStartVideoCall = (appointment: Appointment) => {
        // Validation 1: Only confirmed appointments
        if (appointment.status !== 'confirmed') {
            alert('Only confirmed appointments can start video calls');
            return;
        }

        // Validation 2: Check time (optional - allow 10 minutes before)
        //from here
        // const appointmentDate = new Date(appointment.date);
        // const [hours, minutes] = appointment.startTime.split(':').map(Number);
        // appointmentDate.setHours(hours, minutes, 0, 0);
        //
        // const now = new Date();
        // const canJoinTime = new Date(appointmentDate.getTime() - 10 * 60000); // 10 min before
        //
        // if (now < canJoinTime) {
        //     const timeUntil = Math.floor((canJoinTime.getTime() - now.getTime()) / 60000);
        //     alert(`Video call will be available in ${timeUntil} minutes`);
        //     return;
        // }
        //to here

        // All good - start the call!
        setSelectedAppointment(appointment);
        setIsVideoCallOpen(true);
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800',
            rejected: 'bg-gray-100 text-gray-800',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                    <p className="text-gray-600">Manage your patient appointments</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex space-x-2 overflow-x-auto">
                        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                                    filter === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Appointments List */}
                {appointments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No appointments found
                        </h3>
                        <p className="text-gray-600">
                            {filter === 'all'
                                ? 'No patients have booked appointments yet'
                                : `No ${filter} appointments`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>{getStatusBadge(appointment.status)}</div>
                                    <div className="text-right text-sm text-gray-500">
                                        Booked: {format(new Date(appointment.createdAt), 'MMM dd, yyyy')}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Appointment Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            Appointment Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="mr-2" size={18} />
                                                <span>
                                                    {format(new Date(appointment.date), 'EEEE, MMMM dd, yyyy')}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="mr-2" size={18} />
                                                <span>
                                                    {appointment.startTime} - {appointment.endTime}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                                {appointment.reason}
                                            </p>
                                        </div>

                                        {appointment.patientNotes && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Patient Notes:</p>
                                                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                                    {appointment.patientNotes}
                                                </p>
                                            </div>
                                        )}

                                        {appointment.doctorNotes && (
                                            <div className="mt-3">
                                                <p className="text-sm font-medium text-gray-700 mb-1">Your Notes:</p>
                                                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded">
                                                    {appointment.doctorNotes}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Patient Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            Patient Information
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {typeof appointment.patient === 'object' && appointment.patient ? (
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                                        {appointment.patient.profile?.firstName?.[0] || 'P'}
                                                        {appointment.patient.profile?.lastName?.[0] || 'T'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {appointment.patient.profile?.firstName || ''} {appointment.patient.profile?.lastName || ''}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Patient ID: {appointment.patient.id?.substring(0, 8) || 'N/A'}
                                                        </p>
                                                        {appointment.patient.profile?.phone && (
                                                            <p className="text-sm text-gray-500">
                                                                Phone: {appointment.patient.profile.phone}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                                                        P
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">Patient</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {appointment.status === 'pending' && (
                                    <div className="mt-6 pt-4 border-t flex space-x-3">
                                        <button
                                            onClick={() => handleConfirm(appointment.id)}
                                            disabled={updatingId === appointment.id}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50"
                                        >
                                            <CheckCircle size={18} />
                                            <span>Confirm</span>
                                        </button>
                                        <button
                                            onClick={() => handleReject(appointment.id)}
                                            disabled={updatingId === appointment.id}
                                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
                                        >
                                            <XCircle size={18} />
                                            <span>Reject</span>
                                        </button>
                                    </div>
                                )}


                                {appointment.status === 'confirmed' && (
                                    <div className="mt-6 pt-4 border-t flex space-x-3">
                                        <div className="w-full mb-2 text-sm text-gray-500">
                                            DEBUG - Status: {appointment.status} | User: {user?.id}
                                        </div>
                                        {/* ⭐ VIDEO CALL BUTTON */}

                                        <button
                                            onClick={() => handleStartVideoCall(appointment)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                        >
                                            <Video size={18} />
                                            <span>Start Video Call</span>
                                        </button>

                                        <button
                                            onClick={() => handleComplete(appointment.id)}
                                            disabled={updatingId === appointment.id}
                                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                                        >
                                            <CheckCircle size={18} />
                                            <span>Mark as Completed</span>
                                        </button>
                                    </div>
                                )}

                                {/* Time availability notice */}
                                {appointment.status === 'confirmed' && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800">
                                            💡 Video call will be available 10 minutes before appointment time
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ⭐ VIDEO CALL MODAL */}
            {isVideoCallOpen && selectedAppointment && user && (
                <VideoCall
                    isOpen={isVideoCallOpen}
                    onClose={() => {
                        setIsVideoCallOpen(false);
                        setSelectedAppointment(null);
                    }}
                    appointmentId={selectedAppointment.id}
                    otherUser={{
                        firstName: selectedAppointment.patient?.profile?.firstName || 'Patient',
                        lastName: selectedAppointment.patient?.profile?.lastName || '',
                    }}
                    currentUser={{
                        id: user.id,
                        profile: {
                            firstName: user.profile.firstName,
                            lastName: user.profile.lastName,
                        },
                        role: 'doctor'
                    }}
                />
            )}
        </div>
    );
};

export default DoctorAppointments;