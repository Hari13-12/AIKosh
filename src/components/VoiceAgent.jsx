import React, { useEffect, useState } from "react";
import "./VoiceAgent.css";
import { useNavigate } from "react-router-dom";
import FileUploader from "./FileUploader";

const VoiceAgent = () => {
  const navigate = useNavigate();

  // const [url] = useState("wss://ai-kosh-final-demo-w9vtrp7m.livekit.cloud");
  const [url] = useState("wss://mgl-form-zwjfvwji.livekit.cloud")
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
  };

  const fetchToken = async () => {
    const response = await fetch("http://localhost:8000/get-livekit-token");
    const data = await response.json();
    return data.token;
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQUkgS29zaCBBZ2VudCIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJhaWtvc2giLCJpc3MiOiJBUElkclB4QlZ1Y3V1RXgiLCJuYmYiOjE3NzcyOTgxMjQsImV4cCI6MTc3NzMxOTcyNH0.zpHw4kpw2fZNieTkBRdD3G20oci4UfJSUDfLKUpCKyM"
    return token
  };

  return (
    <div className="voice-container">
      <FileUploader />
      <h1>🎙️ Voice Agent</h1>

      {!isConnected ? (
        <button
          className="button connect-btn"
          onClick={connect}
          disabled={!sdkLoaded}
        >
          Connect
        </button>
      ) : (
        // <button
        //   className="button disconnect-btn"
        //   onClick={async () => {
        //     await disconnect();
        //     navigate(-1);
        //   }}
        // >
        //   Disconnect
        // </button>

        <button
  className="button disconnect-btn"
  onClick={async () => {
    const data = {
      payment_proof: "cheque uploaded",
      title: "Mr.",
      full_name: "AKSHAY J",
      flat_house_number: "36",
      building_name: "THE WORK ADDRESS",
      area_location: "KORAMANGALA",
      pincode: "560102",
      mobile_number: "9092630125",
      cheque_number: "000067",
      bank_name: "Bank of Baroda",
      date_of_issue: "2026-03-28",
      ownership_status: "owner_occupier",
      proof_of_identity: "Aadhar Card",
      proof_of_address: "Government ID",
      signature_name: "AKSHAY J",
    };

    await disconnect();

    // ✅ Navigate to /mgl (where MGLForm lives) with formData in state
    navigate("/mgl", { state: { formData: data } });
  }}
>
  Disconnect
</button>
      )}

      {/* ✅ Audio wave only */}
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
