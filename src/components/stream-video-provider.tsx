import { useUser } from "@clerk/expo";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { fetchStreamAudioToken } from "@/lib/stream";

let StreamVideo: any = null;
let StreamVideoClient: any = null;
let isWebRTCAvailable = true;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const streamSdk = require("@stream-io/video-react-native-sdk");
  StreamVideo = streamSdk.StreamVideo;
  StreamVideoClient = streamSdk.StreamVideoClient;
} catch {
  isWebRTCAvailable = false;
  console.warn("[StreamVideo] WebRTC native module not found in this build.");
}

type User = {
  id: string;
  name?: string;
  image?: string;
};

type StreamVideoClientInstance = any;

type StreamVideoConnection = {
  error: string | null;
  status: "connecting" | "connected" | "failed";
};

const StreamVideoConnectionContext = createContext<StreamVideoConnection>({
  error: null,
  status: "connecting",
});

export function useStreamVideoConnection(): StreamVideoConnection {
  return useContext(StreamVideoConnectionContext);
}

/**
 * Keeps one authenticated Stream client alive while a signed-in learner uses
 * the app. Calls themselves remain owned by the lesson screen.
 */
export function StreamVideoProvider({ children }: PropsWithChildren) {
  const { isLoaded, user } = useUser();
  const [client, setClient] = useState<StreamVideoClientInstance | null>(null);
  const [connection, setConnection] = useState<StreamVideoConnection>(() => {
    if (!isWebRTCAvailable) {
      return {
        error: "Native WebRTC module not compiled in this build. Please run 'npx expo run:android'.",
        status: "failed",
      };
    }
    return {
      error: null,
      status: "connecting",
    };
  });

  useEffect(() => {
    if (!isWebRTCAvailable || !isLoaded || !user) {
      return;
    }

    const clerkUser = user;
    let isActive = true;
    let streamClient: StreamVideoClientInstance | null = null;

    async function connectStreamUser() {
      const userName = clerkUser.fullName ?? clerkUser.firstName ?? "Learner";
      const tokenResponse = await fetchStreamAudioToken({
        userId: clerkUser.id,
        userName,
        userImage: clerkUser.imageUrl,
      });

      if (!isActive) {
        return;
      }

      if (!tokenResponse.success) {
        console.warn("[Stream] Could not connect learner:", tokenResponse.error);
        setConnection({
          error: tokenResponse.error || "Could not connect to Stream.",
          status: "failed",
        });
        return;
      }

      const streamUser: User = {
        id: tokenResponse.userId,
        name: tokenResponse.userName,
        image: tokenResponse.userImage,
      };

      streamClient = StreamVideoClient.getOrCreateInstance({
        apiKey: tokenResponse.apiKey,
        user: streamUser,
        token: tokenResponse.token,
        tokenProvider: async () => {
          const refreshedToken = await fetchStreamAudioToken({
            userId: clerkUser.id,
            userName,
            userImage: clerkUser.imageUrl,
          });

          if (!refreshedToken.success) {
            throw new Error(refreshedToken.error || "Could not refresh the Stream token.");
          }

          return refreshedToken.token;
        },
      });

      if (isActive) {
        setClient(streamClient);
        setConnection({ error: null, status: "connected" });
      }
    }

    void connectStreamUser();

    return () => {
      isActive = false;
      setClient(null);
      if (streamClient) {
        void streamClient.disconnectUser();
      }
    };
  }, [isLoaded, user]);

  return (
    <StreamVideoConnectionContext.Provider value={connection}>
      {client ? <StreamVideo client={client}>{children}</StreamVideo> : children}
    </StreamVideoConnectionContext.Provider>
  );
}
