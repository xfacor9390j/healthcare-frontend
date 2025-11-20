export interface User {
    id: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin';
    profile: {
        firstName: string;
        lastName: string;
        phone?: string;
        dateOfBirth?: string;
        gender?: string;
        address?: string;
    };
    doctorProfile?: DoctorProfile;
    isActive: boolean;
    createdAt: string;
}

export interface DoctorProfile {
    specialization: string;
    licenseNumber: string;
    yearsOfExperience: number;
    qualifications: string[];
    consultationFee: number;
    availability: Availability[];
    bio?: string;
}

export interface Availability {
    day: string;
    slots: TimeSlot[];
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface Appointment {
    id: string;                    // ✅ Changed from _id to id (UUID)
    patientId: string;
    doctorId: string;
    date: string;
    startTime: string;             // ✅ Flat field (not nested in timeSlot)
    endTime: string;               // ✅ Flat field (not nested in timeSlot)
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
    reason: string;
    patientNotes?: string;
    doctorNotes?: string;
    createdAt: string;
    updatedAt: string;
    // Populated fields from backend
    doctor?: User;
    patient?: User;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface RegisterData {
    email: string;
    password: string;
    role: 'patient' | 'doctor';
    profile: {
        firstName: string;
        lastName: string;
        phone?: string;
    };
    doctorProfile?: Partial<DoctorProfile>;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface BookAppointmentData {
    doctorId: string;
    date: string;
    timeSlot: TimeSlot;
    reason: string;
    patientNotes?: string;
}