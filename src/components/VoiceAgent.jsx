// import React, { useEffect, useState } from "react";
// import "./VoiceAgent.css";

// const VoiceAgent = () => {
//     const [url, setUrl] = useState("wss://ai-kosh-vhmztztz.livekit.cloud");
//     const [token, setToken] = useState("");
//     const [status, setStatus] = useState("Loading LiveKit SDK...");
//     const [statusType, setStatusType] = useState("connecting");
//     const [sdkLoaded, setSdkLoaded] = useState(false);
//     const [room, setRoom] = useState(null);
//     const [isConnected, setIsConnected] = useState(false);

//     useEffect(() => {
//         loadLiveKitSDK();
//     }, []);

    

//     const loadLiveKitSDK = async () => {
//         const cdnUrls = [
//             "https://unpkg.com/livekit-client@2/dist/livekit-client.umd.min.js",
//             "https://cdn.jsdelivr.net/npm/livekit-client@2/dist/livekit-client.umd.min.js",
//             "https://unpkg.com/livekit-client/dist/livekit-client.umd.min.js",
//         ];

//         for (const scriptUrl of cdnUrls) {
//             try {
//                 await loadScript(scriptUrl);
//                 if (window.LivekitClient) {
//                     setStatus("Ready to connect");
//                     setStatusType("disconnected");
//                     setSdkLoaded(true);
//                     return;
//                 }
//             } catch (err) {
//                 console.warn("Failed to load:", scriptUrl);
//             }
//         }

//         setStatus("Failed to load LiveKit SDK. Please refresh.");
//         setStatusType("error");
//     };

//     const loadScript = (scriptUrl) => {
//         return new Promise((resolve, reject) => {
//             const script = document.createElement("script");
//             script.src = scriptUrl;
//             script.onload = resolve;
//             script.onerror = reject;
//             document.head.appendChild(script);
//         });
//     };

//     const connect = async () => {
//         if (!sdkLoaded || !window.LivekitClient) {
//             setStatus("LiveKit SDK not loaded.");
//             setStatusType("error");
//             return;
//         }

//         // Disconnect existing room if any
//         if (room) {
//             await room.disconnect();
//         }

//         try {
//             setStatus("Fetching token...");
//             setStatusType("connecting");

//             // 🔥 Fetch token from backend
//             const fetchedToken = await fetchToken();
//             console.log("Fetched livekit token:", fetchedToken);

//             setStatus("Connecting to LiveKit...");
//             setStatusType("connecting");

//             const newRoom = new window.LivekitClient.Room({
//                 adaptiveStream: true,
//                 dynacast: true,
//             });

//             // Handle audio track subscription
//             const handleTrackSubscribed = (track, publication, participant) => {
//                 console.log("Track subscribed:", track.kind, participant.identity);
//                 if (track.kind === window.LivekitClient.Track.Kind.Audio) {
//                     const element = track.attach();
//                     document.body.appendChild(element);
//                     element.play().catch((err) => {
//                         console.error("Audio autoplay failed:", err);
//                         setStatus("Click anywhere to enable audio");
//                     });
//                 }
//             };

//             // Set up event listeners
//             newRoom
//                 .on(window.LivekitClient.RoomEvent.Connected, () => {
//                     console.log("Connected to room");
//                     setStatus("Connected - You can speak now!");
//                     setStatusType("connected");
//                     setIsConnected(true);
//                 })
//                 .on(window.LivekitClient.RoomEvent.Disconnected, () => {
//                     console.log("Disconnected from room");
//                     handleDisconnect();
//                 })
//                 .on(window.LivekitClient.RoomEvent.Reconnecting, () => {
//                     console.log("Reconnecting...");
//                     setStatus("Reconnecting...");
//                     setStatusType("connecting");
//                 })
//                 .on(window.LivekitClient.RoomEvent.Reconnected, () => {
//                     console.log("Reconnected");
//                     setStatus("Connected - You can speak now!");
//                     setStatusType("connected");
//                 })
//                 .on(window.LivekitClient.RoomEvent.TrackSubscribed, handleTrackSubscribed)
//                 .on(window.LivekitClient.RoomEvent.TrackPublished, (pub, participant) => {
//                     console.log("Track published:", pub.kind, participant.identity);
//                 })
//                 .on(window.LivekitClient.RoomEvent.MediaDevicesError, (e) => {
//                     console.error("Media devices error:", e);
//                     setStatus("Microphone access error");
//                     setStatusType("error");
//                 });

//             await newRoom.connect(url, fetchedToken);
//             console.log("Room connected successfully");

//             // Check for existing tracks (in case we missed the event)
//             newRoom.remoteParticipants.forEach((participant) => {
//                 participant.trackPublications.forEach((publication) => {
//                     if (publication.track) {
//                         handleTrackSubscribed(publication.track, publication, participant);
//                     }
//                 });
//             });

//             await newRoom.localParticipant.setMicrophoneEnabled(true);

//             setRoom(newRoom);
//         } catch (error) {
//             console.error("Connection failed:", error);
//             setStatus(`Error: ${error.message}`);
//             setStatusType("error");
//         }
//     };

//     const disconnect = async () => {
//         if (room) {
//             await room.disconnect();
//         }
//         handleDisconnect();
//     };

//     const handleDisconnect = () => {
//         setIsConnected(false);
//         setRoom(null);
//         setStatus("Disconnected");
//         setStatusType("disconnected");
//     };

//     const fetchToken = async () => {
//         try {
//             const response = await fetch("http://localhost:8000/get-livekit-token", {
//                 method: "GET",
//             });

//             if (!response.ok) {
//                 throw new Error("Failed to fetch token");
//             }

//             const data = await response.json();
//             return data.token;
//         } catch (error) {
//             setStatus("Error fetching token");
//             setStatusType("error");
//             throw error;
//         }
//     };


//     return (
//         <div className="voice-container">
//             <h1>🎙️ Voice Agent</h1>
//             <p className="subtitle">Connect to your LiveKit voice agent</p>

//             {!isConnected ? (
//                 <button className="button connect-btn" onClick={connect}>
//                     Connect to Agent
//                 </button>
//             ) : (
//                 <button className="button disconnect-btn" onClick={disconnect}>
//                     Disconnect
//                 </button>
//             )}

//             <div className={`status ${statusType}`}>{status}</div>

//             {isConnected && (
//                 <div className="audio-indicator">
//                     <div className="audio-wave">
//                         <div className="audio-bar"></div>
//                         <div className="audio-bar"></div>
//                         <div className="audio-bar"></div>
//                         <div className="audio-bar"></div>
//                         <div className="audio-bar"></div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default VoiceAgent;




// VoiceAgent.jsx
import React, { useEffect, useState, useRef } from "react";
import "./VoiceAgent.css";

const VoiceAgent = () => {
  const [url] = useState("wss://ai-kosh-vhmztztz.livekit.cloud");
  const [status, setStatus] = useState("Loading LiveKit SDK...");
  const [statusType, setStatusType] = useState("connecting");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [room, setRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // 🔥 production transcript state
  const [transcripts, setTranscripts] = useState([]);
  const transcriptMapRef = useRef(new Map());
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    loadLiveKitSDK();
  }, []);

  // 🔥 auto scroll like ChatGPT
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

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

  // 🔥 PRODUCTION transcription handler
  const handleTranscriptionReceived = (segments, participant) => {
    if (!segments?.length) return;

    const participantId = participant?.identity;
    const role =
      participantId === room?.localParticipant?.identity ? "user" : "agent";

    let updated = false;

    segments.forEach((segment) => {
      const text = segment.text?.trim();
      if (!text) return;

      const existing = transcriptMapRef.current.get(segment.id);

      if (!existing || existing.text !== text || existing.isFinal !== segment.final) {
        transcriptMapRef.current.set(segment.id, {
          id: segment.id,
          text,
          role,
          isFinal: segment.final,
          timestamp: Date.now(),
        });
        updated = true;
      }
    });

    if (updated) {
      const ordered = Array.from(transcriptMapRef.current.values()).sort(
        (a, b) => a.timestamp - b.timestamp
      );
      setTranscripts(ordered);
    }
  };

  const connect = async () => {
    if (!sdkLoaded || !window.LivekitClient) {
      setStatus("LiveKit SDK not loaded.");
      setStatusType("error");
      return;
    }

    if (room) {
      await room.disconnect();
    }

    try {
      setStatus("Fetching token...");
      setStatusType("connecting");

      const fetchedToken = await fetchToken();

      setStatus("Connecting to LiveKit...");
      setStatusType("connecting");

      const newRoom = new window.LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true,
      });

      const handleTrackSubscribed = (track, publication, participant) => {
        if (track.kind === window.LivekitClient.Track.Kind.Audio) {
          const element = track.attach();
          document.body.appendChild(element);
          element.play().catch(() => {
            setStatus("Click anywhere to enable audio");
          });
        }
      };

      newRoom
        .on(window.LivekitClient.RoomEvent.Connected, () => {
          setStatus("Connected - You can speak now!");
          setStatusType("connected");
          setIsConnected(true);
        })
        .on(
          window.LivekitClient.RoomEvent.TranscriptionReceived,
          handleTranscriptionReceived
        )
        .on(window.LivekitClient.RoomEvent.Disconnected, () => {
          handleDisconnect();
        })
        .on(window.LivekitClient.RoomEvent.Reconnecting, () => {
          setStatus("Reconnecting...");
          setStatusType("connecting");
        })
        .on(window.LivekitClient.RoomEvent.Reconnected, () => {
          setStatus("Connected - You can speak now!");
          setStatusType("connected");
        })
        .on(window.LivekitClient.RoomEvent.TrackSubscribed, handleTrackSubscribed)
        .on(window.LivekitClient.RoomEvent.MediaDevicesError, () => {
          setStatus("Microphone access error");
          setStatusType("error");
        });

      await newRoom.connect(url, fetchedToken);

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

    // 🔥 clear transcripts
    transcriptMapRef.current.clear();
    setTranscripts([]);
  };

  const fetchToken = async () => {
    const response = await fetch("http://localhost:8000/get-livekit-token", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch token");
    }

    const data = await response.json();
    return data.token;
  };

  return (
    <div className="voice-container">
      <h1>🎙️ Voice Agent</h1>
      <p className="subtitle">Connect to your LiveKit voice agent</p>

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

      {/* 🔥 production transcript UI */}
      {isConnected && (
        <div className="transcript-box">
          <h3>Live Transcript</h3>
          <div className="transcript-scroll">
            {transcripts.map((t) => (
              <div key={t.id} className={`msg ${t.role}`}>
                <div className="bubble">
                  {t.text}
                  {!t.isFinal && <span className="typing"> ...</span>}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceAgent;

