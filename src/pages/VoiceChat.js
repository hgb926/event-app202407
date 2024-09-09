import React, { useEffect, useRef, useState } from 'react';

const VoiceChat = () => {
    const [socket, setSocket] = useState(null);
    const [isStart, setIsStart] = useState(false)
    const [message, setMessage] = useState("Start Call")
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);


    // WebSocket 연결 설정
    useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8585/api/signal');

        newSocket.onopen = () => {
            console.log("[WebSocket] Connection opened.");
        };

        newSocket.onclose = () => {
            console.log("[WebSocket] Connection closed.");
        };

        newSocket.onerror = (error) => {
            console.error("[WebSocket] Error:", error);
        };

        newSocket.onmessage = (message) => {
            console.log("[WebSocket] Message received:", message.data);
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // 사용자 오디오 스트림 가져오기 및 PeerConnection 설정
    useEffect(() => {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
            ],
        };

        const peerConnection = new RTCPeerConnection(configuration);
        peerConnectionRef.current = peerConnection;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                console.log("[Media] Local stream obtained.");
                localStreamRef.current.srcObject = stream;
                stream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, stream);
                    console.log("[PeerConnection] Track added.");
                });
            })
            .catch(error => {
                console.error("[Media] Error accessing user media:", error);
            });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    console.log("[ICE] ICE candidate:", event.candidate);
                    socket.send(JSON.stringify({ iceCandidate: event.candidate }));
                } else {
                    console.error("[ICE] WebSocket not open, candidate not sent.");
                }
            }
        };

        peerConnection.ontrack = (event) => {
            console.log("[PeerConnection] Remote track received.");
            remoteStreamRef.current.srcObject = event.streams[0];
        };

        return () => {
            peerConnection.close();
            console.log("[PeerConnection] Closed.");
        };
    }, [socket]);

    // Offer 생성 및 전송
    const createOffer = async () => {
        if (!peerConnectionRef.current) return;

        try {
            const offer = await peerConnectionRef.current.createOffer();
            console.log("[Offer] Offer created.");
            await peerConnectionRef.current.setLocalDescription(offer);
            console.log("[Offer] Local description set.");

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ offer }));
                console.log("[WebSocket] Offer sent.");
            } else {
                console.error("[WebSocket] WebSocket not open, offer not sent.");
            }
        } catch (error) {
            console.error("[Offer] Error creating or sending offer:", error);
        }
    };

    return (
        <div>
            <h1>1:N Voice Chat</h1>
            <audio ref={localStreamRef} autoPlay muted />
            <audio ref={remoteStreamRef} autoPlay />
            <button onClick={createOffer}>{message}</button>
        </div>
    );
};

export default VoiceChat;
