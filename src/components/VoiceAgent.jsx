import React, { useEffect, useState } from "react";
import "./VoiceAgent.css";

const VoiceAgent = () => {
    const [url, setUrl] = useState("wss://ai-kosh-vhmztztz.livekit.cloud");
    const [token, setToken] = useState("");
    const [status, setStatus] = useState("Loading LiveKit SDK...");
    const [statusType, setStatusType] = useState("connecting");
    const [sdkLoaded, setSdkLoaded] = useState(false);
    const [room, setRoom] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        loadLiveKitSDK();
    }, []);

    

    const loadLiveKitSDK = async () => {
        const cdnUrls = [
            "https://unpkg.com/livekit-client@2/dist/livekit-client.umd.min.js",
            "https://cdn.jsdelivr.net/npm/livekit-client@2/dist/livekit-client.umd.min.js",
            "https://unpkg.com/livekit-client/dist/livekit-client.umd.min.js",
        ];

        for (const scriptUrl of cdnUrls) {
            try {
                await loadScript(scriptUrl);
                if (window.LivekitClient) {
                    setStatus("Ready to connect");
                    setStatusType("disconnected");
                    setSdkLoaded(true);
                    return;
                }
            } catch (err) {
                console.warn("Failed to load:", scriptUrl);
            }
        }

        setStatus("Failed to load LiveKit SDK. Please refresh.");
        setStatusType("error");
    };

    const loadScript = (scriptUrl) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const connect = async () => {
        if (!sdkLoaded || !window.LivekitClient) {
            setStatus("LiveKit SDK not loaded.");
            setStatusType("error");
            return;
        }

        // Disconnect existing room if any
        if (room) {
            await room.disconnect();
        }

        try {
            setStatus("Fetching token...");
            setStatusType("connecting");

            // 🔥 Fetch token from backend
            const fetchedToken = await fetchToken();
            console.log("Fetched livekit token:", fetchedToken);

            setStatus("Connecting to LiveKit...");
            setStatusType("connecting");

            const newRoom = new window.LivekitClient.Room({
                adaptiveStream: true,
                dynacast: true,
            });

            // Handle audio track subscription
            const handleTrackSubscribed = (track, publication, participant) => {
                console.log("Track subscribed:", track.kind, participant.identity);
                if (track.kind === window.LivekitClient.Track.Kind.Audio) {
                    const element = track.attach();
                    document.body.appendChild(element);
                    element.play().catch((err) => {
                        console.error("Audio autoplay failed:", err);
                        setStatus("Click anywhere to enable audio");
                    });
                }
            };

            // Set up event listeners
            newRoom
                .on(window.LivekitClient.RoomEvent.Connected, () => {
                    console.log("Connected to room");
                    setStatus("Connected - You can speak now!");
                    setStatusType("connected");
                    setIsConnected(true);
                })
                .on(window.LivekitClient.RoomEvent.Disconnected, () => {
                    console.log("Disconnected from room");
                    handleDisconnect();
                })
                .on(window.LivekitClient.RoomEvent.Reconnecting, () => {
                    console.log("Reconnecting...");
                    setStatus("Reconnecting...");
                    setStatusType("connecting");
                })
                .on(window.LivekitClient.RoomEvent.Reconnected, () => {
                    console.log("Reconnected");
                    setStatus("Connected - You can speak now!");
                    setStatusType("connected");
                })
                .on(window.LivekitClient.RoomEvent.TrackSubscribed, handleTrackSubscribed)
                .on(window.LivekitClient.RoomEvent.TrackPublished, (pub, participant) => {
                    console.log("Track published:", pub.kind, participant.identity);
                })
                .on(window.LivekitClient.RoomEvent.MediaDevicesError, (e) => {
                    console.error("Media devices error:", e);
                    setStatus("Microphone access error");
                    setStatusType("error");
                });

            await newRoom.connect(url, fetchedToken);
            console.log("Room connected successfully");

            // Check for existing tracks (in case we missed the event)
            newRoom.remoteParticipants.forEach((participant) => {
                participant.trackPublications.forEach((publication) => {
                    if (publication.track) {
                        handleTrackSubscribed(publication.track, publication, participant);
                    }
                });
            });

            await newRoom.localParticipant.setMicrophoneEnabled(true);

            setRoom(newRoom);
        } catch (error) {
            console.error("Connection failed:", error);
            setStatus(`Error: ${error.message}`);
            setStatusType("error");
        }
    };

    const disconnect = async () => {
        if (room) {
            await room.disconnect();
        }
        handleDisconnect();
    };

    const handleDisconnect = () => {
        setIsConnected(false);
        setRoom(null);
        setStatus("Disconnected");
        setStatusType("disconnected");
    };

    const fetchToken = async () => {
        try {
            const response = await fetch("http://localhost:8000/get-livekit-token", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch token");
            }

            const data = await response.json();
            return data.token;
        } catch (error) {
            setStatus("Error fetching token");
            setStatusType("error");
            throw error;
        }
    };


    return (
        <div className="voice-container">
            <h1>🎙️ Voice Agent</h1>
            <p className="subtitle">Connect to your LiveKit voice agent</p>

            {/* <div className="input-group">
        <label>LiveKit Server URL</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div> */}

            {/* <div className="input-group">
        <label>Access Token</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div> */}

            {!isConnected ? (
                <button className="button connect-btn" onClick={connect}>
                    Connect to Agent
                </button>
            ) : (
                <button className="button disconnect-btn" onClick={disconnect}>
                    Disconnect
                </button>
            )}

            <div className={`status ${statusType}`}>{status}</div>

            {isConnected && (
                <div className="audio-indicator">
                    <div className="audio-wave">
                        <div className="audio-bar"></div>
                        <div className="audio-bar"></div>
                        <div className="audio-bar"></div>
                        <div className="audio-bar"></div>
                        <div className="audio-bar"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceAgent;
