// VoiceAgent.jsx
import React, { useEffect, useState, useRef } from "react";
import "./VoiceAgent.css";
import { useNavigate } from "react-router-dom";
import FileUploader  from "./FileUploader";

const VoiceAgent = () => {

  const navigate = useNavigate();


  // const [url] = useState("wss://ai-kosh-vhmztztz.livekit.cloud");
  const [url] = useState("wss://ai-kosh-demo-2-gwp13vvg.livekit.cloud")
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [room, setRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // 🔥 transcript state
  const [transcripts, setTranscripts] = useState([]);
  const transcriptMapRef = useRef(new Map());
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    loadLiveKitSDK();
  }, []);

  // 🔥 auto scroll
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
          setSdkLoaded(true);
          return;
        }
      } catch (err) {
        console.warn("Failed to load:", scriptUrl);
      }
    }
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

  const handleTranscriptionReceived = (segments, participant) => {
    if (!segments?.length) return;

    const participantId = participant?.identity;
    const role = participantId?.startsWith("agent-") ? "agent" : "user";

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
    if (!sdkLoaded || !window.LivekitClient) return;

    if (room) {
      await room.disconnect();
    }

    try {
      const fetchedToken = await fetchToken();

      const newRoom = new window.LivekitClient.Room({
        adaptiveStream: true,
        dynacast: true,
      });

      const handleTrackSubscribed = (track, publication, participant) => {
        if (track.kind === window.LivekitClient.Track.Kind.Audio) {
          const element = track.attach();
          document.body.appendChild(element);
          element.play().catch(() => {});
        }
      };

      newRoom
        .on(window.LivekitClient.RoomEvent.Connected, () => {
          setIsConnected(true);
        })
        .on(
          window.LivekitClient.RoomEvent.TranscriptionReceived,
          handleTranscriptionReceived
        )
        .on(window.LivekitClient.RoomEvent.Disconnected, () => {
          handleDisconnect();
        })
        .on(window.LivekitClient.RoomEvent.TrackSubscribed, handleTrackSubscribed);

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
      console.error("Connection error:", error.message);
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
    transcriptMapRef.current.clear();
    setTranscripts([]);
  };

  const fetchToken = async () => {
    const response = await fetch("http://localhost:8000/get-livekit-token");
    const data = await response.json();
    return data.token;
  };

  return (
    <div className="voice-container">
      <FileUploader />
      <h1>🎙️ Voice Agent</h1>
      {/* <p className="subtitle">Connect to your LiveKit voice agent</p> */}

      {/* 🔥 SINGLE BUTTON TOGGLE */}
      {!isConnected ? (
        <button
          className="button connect-btn"
          onClick={connect}
          disabled={!sdkLoaded}
        >
          Connect
        </button>
      ) : (
        <button
  className="button disconnect-btn"
  onClick={async () => {
    await disconnect();
    navigate(-1);
  }}
>
  Disconnect
</button>

      )}

      {/* 🔥 Show transcript + audio only when connected */}
      {isConnected && (
        <>
          <div className="audio-indicator">
            <div className="audio-wave">
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
              <div className="audio-bar"></div>
            </div>
          </div>

          <div className="transcript-box">
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
        </>
      )}
    </div>
  );
};

export default VoiceAgent;
