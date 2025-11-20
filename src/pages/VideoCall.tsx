import { useState, useEffect, useRef } from 'react';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    PhoneOff,
    Maximize,
    Minimize,
    Users
} from 'lucide-react';
import webRTCService from '../services/webrtc.service';
import type { ConnectionStatus } from '../types/webrtc.types';

interface VideoCallProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: string;
    otherUser: {
        firstName: string;
        lastName: string;
        role?: string;
    };
    currentUser: {
        id: string;
        profile: {
            firstName: string;
            lastName: string;
        };
        role: 'doctor' | 'patient';
    };
}

const VideoCall: React.FC<VideoCallProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 appointmentId,
                                                 otherUser,
                                                 currentUser
                                             }) => {
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
    const [callDuration, setCallDuration] = useState(0);
    const [isCallStarted, setIsCallStarted] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const callStartTimeRef = useRef<number | null>(null);
    const timerIntervalRef = useRef<number | null>(null);

    // Initialize video call
    useEffect(() => {
        if (isOpen && appointmentId) {
            initializeCall();
        }

        return () => {
            cleanupCall();
        };
    }, [isOpen, appointmentId]);

    // Timer for call duration
    useEffect(() => {
        if (isCallStarted) {
            callStartTimeRef.current = Date.now();
            timerIntervalRef.current = window.setInterval(() => {
                const elapsed = Math.floor((Date.now() - (callStartTimeRef.current || 0)) / 1000);
                setCallDuration(elapsed);
            }, 1000);
        }

        return () => {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, [isCallStarted]);

    const initializeCall = async () => {
        try {
            setConnectionStatus('connecting');

            // Initialize socket connection
            const socketUrl = import.meta.env.VITE_SIGNALING_SERVER || 'ws://localhost:3003';
            await webRTCService.initializeSocket(socketUrl);

            // Set event handlers
            webRTCService.setEventHandlers({
                onRemoteStream: handleRemoteStream,
                onConnectionStateChange: handleConnectionStateChange,
                onUserJoined: handleUserJoined,
                onUserLeft: handleUserLeft
            });

            // Get local media stream
            const localStream = await webRTCService.getLocalStream({
                video: true,
                audio: true
            });

            // Display local video
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
            }

            // Join room with appointment ID
            const roomId = `appointment_${appointmentId}`;
            webRTCService.joinRoom(roomId, {
                userId: currentUser.id,
                userName: `${currentUser.profile.firstName} ${currentUser.profile.lastName}`,
                role: currentUser.role
            });

            setConnectionStatus('connected');
        } catch (error) {
            console.error('Error initializing call:', error);
            setConnectionStatus('failed');
            alert('Failed to access camera/microphone. Please check permissions.');
        }
    };

    const handleRemoteStream = (stream: MediaStream) => {
        console.log('Remote stream received');
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            setIsCallStarted(true);
        }
    };

    const handleConnectionStateChange = (state: RTCPeerConnectionState) => {
        console.log('Connection state changed:', state);
        if (state === 'connected') {
            setConnectionStatus('connected');
        } else if (state === 'disconnected' || state === 'failed') {
            setConnectionStatus('disconnected');
        }
    };

    const handleUserJoined = () => {
        console.log('User joined');
        // If we're the doctor, create an offer when patient joins
        if (currentUser.role === 'doctor') {
            webRTCService.createOffer(`appointment_${appointmentId}`);
        }
    };

    const handleUserLeft = () => {
        console.log('User left');
        setConnectionStatus('disconnected');
    };

    const toggleAudio = () => {
        const newState = !isAudioEnabled;
        webRTCService.toggleAudio(newState);
        setIsAudioEnabled(newState);
    };

    const toggleVideo = () => {
        const newState = !isVideoEnabled;
        webRTCService.toggleVideo(newState);
        setIsVideoEnabled(newState);
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const endCall = () => {
        cleanupCall();
        onClose();
    };

    const cleanupCall = () => {
        webRTCService.closeConnection();
        setIsCallStarted(false);
        setCallDuration(0);
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'bg-green-500';
            case 'connecting': return 'bg-yellow-500';
            case 'disconnected': return 'bg-red-500';
            case 'failed': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'Connected';
            case 'connecting': return 'Connecting';
            case 'disconnected': return 'Disconnected';
            case 'failed': return 'Failed';
            default: return 'Idle';
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 bg-gray-900 z-50 ${isFullScreen ? 'p-0' : 'p-4'}`}>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Users className="text-white" size={20} />
                            <div>
                                <h3 className="text-white font-semibold">
                                    {otherUser.firstName} {otherUser.lastName}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {isCallStarted && `${formatDuration(callDuration)}`}
                                    {connectionStatus === 'connecting' && 'Connecting...'}
                                    {connectionStatus === 'connected' && !isCallStarted && 'Waiting for other user...'}
                                    {connectionStatus === 'disconnected' && 'Disconnected'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor()} text-white`}>
                            {getStatusText()}
                        </div>
                    </div>
                </div>

                {/* Video Container */}
                <div className="flex-1 relative bg-black">
                    {/* Remote Video (Main) */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Local Video (Picture-in-Picture) */}
                    <div className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                        {!isVideoEnabled && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                                <VideoOff size={32} className="text-gray-400" />
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
                            You
                        </div>
                    </div>

                    {/* Waiting/Connecting Overlay */}
                    {(connectionStatus === 'connecting' || (connectionStatus === 'connected' && !isCallStarted)) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                                <p className="text-white text-xl">
                                    {connectionStatus === 'connecting' ? 'Connecting...' : 'Waiting for other user to join...'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-gray-800 px-6 py-6">
                    <div className="flex justify-center items-center space-x-4">
                        {/* Audio Toggle */}
                        <button
                            onClick={toggleAudio}
                            className={`p-4 rounded-full transition-all ${
                                isAudioEnabled
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {isAudioEnabled ? (
                                <Mic className="text-white" size={24} />
                            ) : (
                                <MicOff className="text-white" size={24} />
                            )}
                        </button>

                        {/* Video Toggle */}
                        <button
                            onClick={toggleVideo}
                            className={`p-4 rounded-full transition-all ${
                                isVideoEnabled
                                    ? 'bg-gray-700 hover:bg-gray-600'
                                    : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {isVideoEnabled ? (
                                <Video className="text-white" size={24} />
                            ) : (
                                <VideoOff className="text-white" size={24} />
                            )}
                        </button>

                        {/* End Call */}
                        <button
                            onClick={endCall}
                            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
                        >
                            <PhoneOff className="text-white" size={24} />
                        </button>

                        {/* Fullscreen Toggle */}
                        <button
                            onClick={toggleFullScreen}
                            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-all"
                        >
                            {isFullScreen ? (
                                <Minimize className="text-white" size={24} />
                            ) : (
                                <Maximize className="text-white" size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;