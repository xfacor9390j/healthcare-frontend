// src/services/webrtc.service.ts

import type {
    SignalingMessage,
    WebRTCEventHandlers,
    MediaConstraints,
    UserData
} from '../types/webrtc.types';

class WebRTCService {
    private peerConnection: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private socket: WebSocket | null = null;
    private roomId: string | null = null;
    private eventHandlers: WebRTCEventHandlers = {};

    private readonly configuration: RTCConfiguration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
        ]
    };

    /**
     * Initialize WebSocket connection to signaling server
     */
    async initializeSocket(socketUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new WebSocket(socketUrl);

                this.socket.onopen = () => {
                    console.log('Socket connected');
                    resolve();
                };

                this.socket.onerror = (error) => {
                    console.error('Socket error:', error);
                    reject(error);
                };

                this.socket.onmessage = (event) => {
                    try {
                        const message: SignalingMessage = JSON.parse(event.data);
                        this.handleSignalingMessage(message);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                };

                this.socket.onclose = () => {
                    console.log('Socket disconnected');
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get local media stream (camera and microphone)
     */
    async getLocalStream(constraints: MediaConstraints = { video: true, audio: true }): Promise<MediaStream> {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
            return this.localStream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            throw error;
        }
    }

    /**
     * Create peer connection
     */
    createPeerConnection(): RTCPeerConnection {
        this.peerConnection = new RTCPeerConnection(this.configuration);

        // Add local stream tracks to peer connection
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                this.peerConnection!.addTrack(track, this.localStream!);
            });
        }

        // Handle remote stream
        this.peerConnection.ontrack = (event) => {
            console.log('Received remote track');
            this.remoteStream = event.streams[0];
            if (this.eventHandlers.onRemoteStream) {
                this.eventHandlers.onRemoteStream(this.remoteStream);
            }
        };

        // Handle ICE candidates
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.roomId) {
                this.sendSignalingMessage({
                    type: 'ice-candidate',
                    candidate: event.candidate.toJSON(),
                    roomId: this.roomId
                });
            }
        };

        // Handle connection state changes
        this.peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', this.peerConnection?.connectionState);
            if (this.eventHandlers.onConnectionStateChange && this.peerConnection) {
                this.eventHandlers.onConnectionStateChange(this.peerConnection.connectionState);
            }
        };

        return this.peerConnection;
    }

    /**
     * Create and send offer
     */
    async createOffer(roomId: string): Promise<RTCSessionDescriptionInit> {
        this.roomId = roomId;

        if (!this.peerConnection) {
            this.createPeerConnection();
        }

        try {
            const offer = await this.peerConnection!.createOffer();
            await this.peerConnection!.setLocalDescription(offer);

            this.sendSignalingMessage({
                type: 'offer',
                offer: offer,
                roomId: this.roomId
            });

            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    /**
     * Create and send answer
     */
    async createAnswer(offer: RTCSessionDescriptionInit, roomId: string): Promise<RTCSessionDescriptionInit> {
        this.roomId = roomId;

        if (!this.peerConnection) {
            this.createPeerConnection();
        }

        try {
            await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await this.peerConnection!.createAnswer();
            await this.peerConnection!.setLocalDescription(answer);

            this.sendSignalingMessage({
                type: 'answer',
                answer: answer,
                roomId: this.roomId
            });

            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    }

    /**
     * Handle incoming signaling messages
     */
    private async handleSignalingMessage(message: SignalingMessage): Promise<void> {
        try {
            switch (message.type) {
                case 'offer':
                    await this.handleOffer(message);
                    break;
                case 'answer':
                    await this.handleAnswer(message);
                    break;
                case 'ice-candidate':
                    await this.handleIceCandidate(message);
                    break;
                case 'user-joined':
                    if (this.eventHandlers.onUserJoined) {
                        this.eventHandlers.onUserJoined(message);
                    }
                    break;
                case 'user-left':
                    if (this.eventHandlers.onUserLeft) {
                        this.eventHandlers.onUserLeft(message);
                    }
                    break;
                case 'room-joined':
                    console.log('Room joined successfully:', message);
                    break;
                default:
                    console.log('Unknown message type:', message.type);
            }
        } catch (error) {
            console.error('Error handling signaling message:', error);
        }
    }

    /**
     * Handle incoming offer
     */
    private async handleOffer(message: SignalingMessage): Promise<void> {
        if (!this.peerConnection) {
            this.createPeerConnection();
        }
        if (message.offer && message.roomId) {
            await this.createAnswer(message.offer, message.roomId);
        }
    }

    /**
     * Handle incoming answer
     */
    private async handleAnswer(message: SignalingMessage): Promise<void> {
        if (this.peerConnection && message.answer) {
            await this.peerConnection.setRemoteDescription(
                new RTCSessionDescription(message.answer)
            );
        }
    }

    /**
     * Handle incoming ICE candidate
     */
    private async handleIceCandidate(message: SignalingMessage): Promise<void> {
        if (this.peerConnection && message.candidate) {
            try {
                await this.peerConnection.addIceCandidate(
                    new RTCIceCandidate(message.candidate)
                );
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        }
    }

    /**
     * Send signaling message through WebSocket
     */
    private sendSignalingMessage(message: SignalingMessage): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('Socket not connected');
        }
    }

    /**
     * Join a room
     */
    joinRoom(roomId: string, userData: UserData): void {
        this.roomId = roomId;
        this.sendSignalingMessage({
            type: 'join-room',
            roomId: roomId,
            userData: userData
        });
    }

    /**
     * Leave room
     */
    leaveRoom(): void {
        if (this.roomId) {
            this.sendSignalingMessage({
                type: 'leave-room',
                roomId: this.roomId
            });
        }
    }

    /**
     * Toggle audio
     */
    toggleAudio(enabled: boolean): boolean {
        if (this.localStream) {
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = enabled;
            });
            return enabled;
        }
        return false;
    }

    /**
     * Toggle video
     */
    toggleVideo(enabled: boolean): boolean {
        if (this.localStream) {
            this.localStream.getVideoTracks().forEach(track => {
                track.enabled = enabled;
            });
            return enabled;
        }
        return false;
    }

    /**
     * Close connection and cleanup
     */
    closeConnection(): void {
        // Stop all tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }

        // Close peer connection
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }

        // Leave room
        this.leaveRoom();

        // Close socket
        if (this.socket) {
            this.socket.close();
        }

        // Reset streams
        this.localStream = null;
        this.remoteStream = null;
        this.roomId = null;
    }

    /**
     * Set event handlers
     */
    setEventHandlers(handlers: WebRTCEventHandlers): void {
        this.eventHandlers = handlers;
    }

    /**
     * Get local stream
     */
    getLocalStreamInstance(): MediaStream | null {
        return this.localStream;
    }

    /**
     * Get remote stream
     */
    getRemoteStreamInstance(): MediaStream | null {
        return this.remoteStream;
    }
}

// Export singleton instance
export const webRTCService = new WebRTCService();
export default webRTCService;