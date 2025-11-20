// ============================================
// FIXED appointmentService.ts
// Send timeSlot as nested object (not flat)
// ============================================
import { appointmentApi as api } from './api.ts';
import type { Appointment, ApiResponse, TimeSlot } from '../types';

export const appointmentService = {
    async getMyAppointments(params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<{ appointments: Appointment[]; pagination: any }>> {
        const response = await api.get('/', { params });
        return response.data;
    },

    async getAppointmentById(id: string): Promise<ApiResponse<{ appointment: Appointment }>> {
        const response = await api.get(`/${id}`);
        return response.data;
    },

    async createAppointment(data: {
        doctorId: string;
        date: string;
        timeSlot: TimeSlot;
        reason: string;
        patientNotes?: string;
    }): Promise<ApiResponse<{ appointment: Appointment }>> {
        console.log('📤 Sending appointment data:', data);

        // ✅ CRITICAL FIX: Send timeSlot as nested object, not flat
        const payload = {
            doctorId: data.doctorId,
            date: data.date,
            timeSlot: {                          // ✅ Keep as nested object
                startTime: data.timeSlot.startTime,
                endTime: data.timeSlot.endTime
            },
            reason: data.reason,
            patientNotes: data.patientNotes,
        };

        console.log('📤 Payload:', JSON.stringify(payload, null, 2));

        const response = await api.post('/', payload);
        console.log('✅ Appointment created:', response.data);
        return response.data;
    },

    async updateAppointmentStatus(
        id: string,
        status: string,
        doctorNotes?: string
    ): Promise<ApiResponse<{ appointment: Appointment }>> {
        const response = await api.put(`/${id}/status`, {
            status,
            doctorNotes,
        });
        return response.data;
    },

    async cancelAppointment(id: string): Promise<ApiResponse<{ appointment: Appointment }>> {
        const response = await api.delete(`/${id}`);
        return response.data;
    },

    async getAvailableSlots(
        doctorId: string,
        date: string
    ): Promise<ApiResponse<{ availableSlots: TimeSlot[]; date: string; dayName: string }>> {
        console.log('🔵 Fetching available slots:', { doctorId, date });

        const response = await api.get('/available-slots', {
            params: { doctorId, date },
        });

        console.log('✅ Received slots:', response.data);
        return response.data;
    },

    async getDoctorAppointments(
        doctorId: string,
        params?: { date?: string; status?: string }
    ): Promise<ApiResponse<{ appointments: Appointment[] }>> {
        const response = await api.get(`/doctor/${doctorId}`, { params });
        return response.data;
    },
};