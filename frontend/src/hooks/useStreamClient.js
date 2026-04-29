import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  const activeCallRef = useRef(null);
  const activeChatClientRef = useRef(null);

  const cleanupConnections = async () => {
    try {
      if (activeCallRef.current) {
        await activeCallRef.current.leave();
        activeCallRef.current = null;
      }

      if (activeChatClientRef.current) {
        await activeChatClientRef.current.disconnectUser();
        activeChatClientRef.current = null;
      }

      await disconnectStreamClient();
    } catch (error) {
      console.error("Cleanup error:", error);
    } finally {
      setCall(null);
      setChatClient(null);
      setChannel(null);
      setStreamClient(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initCall = async () => {
      if (!session?.callId || !isHost && !isParticipant || session.status === "completed") {
        setIsInitializingCall(false);
        return;
      }

      try {
        setIsInitializingCall(true);
        await cleanupConnections();

        const { token, userId, userName, userImage } = await sessionApi.getStreamToken();

        if (!token || !userId) {
          throw new Error("Missing Stream token or user id");
        }

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );

        if (cancelled) {
          await disconnectStreamClient();
          return;
        }

        setStreamClient(client);

        const videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        activeCallRef.current = videoCall;

        if (cancelled) {
          await videoCall.leave();
          activeCallRef.current = null;
          await disconnectStreamClient();
          return;
        }

        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        const chatClientInstance = StreamChat.getInstance(apiKey);

        if (chatClientInstance.userID) {
          await chatClientInstance.disconnectUser();
        }

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          token
        );
        activeChatClientRef.current = chatClientInstance;

        if (cancelled) {
          await chatClientInstance.disconnectUser();
          activeChatClientRef.current = null;
          await cleanupConnections();
          return;
        }

        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();

        if (cancelled) {
          await cleanupConnections();
          return;
        }

        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        if (!cancelled) {
          setIsInitializingCall(false);
        }
      }
    };

    if (session && !loadingSession) initCall();

    return () => {
      cancelled = true;
      void cleanupConnections();
    };
  }, [session, loadingSession, isHost, isParticipant]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
    leaveSessionCall: cleanupConnections,
  };
}

export default useStreamClient;
