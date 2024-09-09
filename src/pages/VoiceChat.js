import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VoiceChat = () => {
    const [socket, setSocket] = useState(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);

    useEffect(() => {
        // Signaling 서버와 WebSocket 연결
        const newSocket = new WebSocket('ws://localhost:8080/api/signal');
        setSocket(newSocket);

        // 로컬 음성 스트림 가져오기
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                localStreamRef.current.srcObject = stream;
                if (peerConnectionRef.current) {
                    stream.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, stream));
                }
            });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        // WebRTC 설정
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
            ],
        };

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        socket.onmessage = async (message) => {
            const data = JSON.parse(message.data);
            if (data.offer) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.send(JSON.stringify({ answer }));
            } else if (data.answer) {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            } else if (data.iceCandidate) {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.iceCandidate));
            }
        };

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socket.send(JSON.stringify({ iceCandidate: event.candidate }));
            }
        };

        peerConnection.ontrack = (event) => {
            remoteStreamRef.current.srcObject = event.streams[0];
        };

        return () => peerConnection.close();
    }, [socket]);

    const createOffer = async () => {
        const offer = await peerConnectionRef.current.createOffer();
        await peerConnectionRef.current.setLocalDescription(offer);
        socket.send(JSON.stringify({ offer }));
    };

    return (
        <div>
            <h1>1:N Voice Chat</h1>
            <audio ref={localStreamRef} autoPlay muted />
            <audio ref={remoteStreamRef} autoPlay />
            <button onClick={createOffer}>Start Call</button>
        </div>
    );
};

export default VoiceChat;
