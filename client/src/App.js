import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState('');
  const [roomID, setRoomID] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerRef = useRef(null);

  const handleSend = () => {
    socket.emit('message', { name, text: message });
    setMessage('');
  };

  useEffect(() => {
    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('user-joined', ({ signal }) => {
      const peer = new Peer({ initiator: false, trickle: false, stream: localVideo.current.srcObject });
      peer.signal(signal);
      peer.on('stream', (stream) => {
        remoteVideo.current.srcObject = stream;
      });
      peerRef.current = peer;
    });

    socket.on('signal', (signal) => {
      peerRef.current.signal(signal);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = async () => {
    setJoined(true);

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = stream;

    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (signal) => {
      socket.emit('join-room', { roomID, signal });
    });

    peer.on('stream', (stream) => {
      remoteVideo.current.srcObject = stream;
    });

    peerRef.current = peer;
  };

  if (!joined) {
    return (
      <div className="container">
        <div className="form">
          <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Room ID" value={roomID} onChange={(e) => setRoomID(e.target.value)} />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-chat">
      <div className="video-section">
        <video ref={localVideo} autoPlay muted playsInline />
        <video ref={remoteVideo} autoPlay playsInline />
      </div>

      <div className="chat-section">
        <h3>Live Chat</h3>
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i}><strong>{msg.name}:</strong> {msg.text}</div>
          ))}
        </div>
        <input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;