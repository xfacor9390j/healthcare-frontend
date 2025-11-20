import { userApi as api } from './api.ts';
import type { User, ApiResponse } from '../types';

export const userService = {
    async getProfile(): Promise<ApiResponse<{ user: User }>> {
        const response = await api.get('/profile');
        return response.data;
    },

    async updateProfile(data: Partial<User['profile']>): Promise<ApiResponse<{ user: User }>> {
        const response = await api.put('/profile', data);
        return response.data;
    },

    async changePassword(data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<ApiResponse<any>> {
        const response = await api.put('/change-password', data);
        return response.data;
    },

    async getDoctors(params?: {
        specialization?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<{ doctors: User[]; pagination: any }>> {
        const response = await api.get('/doctors', { params });
        return response.data;
    },

    async getDoctorById(id: string): Promise<ApiResponse<{ user: User }>> {
        const response = await api.get(`/doctor/${id}`);
        return response.data;
    },
};
