// src/types/webrtc.types.ts

export interface UserData {
    userId: string;
    userName: string;
    role: 'doctor' | 'patient';
}

export interface SignalingMessage {
    type: 'connected' | 'join-room' | 'leave-room' | 'offer' | 'answer' | 'ice-candidate' | 'user-joined' | 'user-left' | 'room-joined';
    id?: string;
    roomId?: string;
    userData?: UserData;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
    senderId?: string;
    userId?: string;
    participants?: Array<{
        userId: string;
        userData?: UserData;
    }>;
}

export interface WebRTCEventHandlers {
    onRemoteStream?: (stream: MediaStream) => void;
    onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
    onUserJoined?: (message: SignalingMessage) => void;
    onUserLeft?: (message: SignalingMessage) => void;
}

export interface MediaConstraints {
    video: boolean | MediaTrackConstraints;
    audio: boolean | MediaTrackConstraints;
}

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'failed';