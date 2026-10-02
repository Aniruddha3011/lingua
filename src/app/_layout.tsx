import "../../global.css";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { PostHogProvider } from "posthog-react-native";

import { StreamVideoProvider } from "@/components/stream-video-provider";
import { posthog } from "@/config/posthog";
import { fontAssets } from "@/theme";

import { useLanguageStore } from "@/store/useLanguageStore";

void SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

function PostHogIdentity() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const identifiedUserId = useRef<string | null>(null);
  const lastIdentifiedLanguage = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn || !user) {
      if (identifiedUserId.current) {
        posthog?.reset();
        identifiedUserId.current = null;
        lastIdentifiedLanguage.current = undefined;
      }
      return;
    }

    const preferredLanguage = selectedLanguageId || null;
    const isNewUser = identifiedUserId.current !== user.id;

    if (isNewUser) {
      if (identifiedUserId.current) {
        posthog?.reset();
      }

      const email = user.primaryEmailAddress?.emailAddress;
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

      posthog?.identify(user.id, {
        $set: {
          ...(email ? { email } : {}),
          ...(name ? { name } : {}),
          preferred_language: preferredLanguage,
        },
        $set_once: {
          signup_date: new Date().toISOString(),
        },
      });
      identifiedUserId.current = user.id;
      lastIdentifiedLanguage.current = preferredLanguage;
    } else if (lastIdentifiedLanguage.current !== preferredLanguage) {
      posthog?.identify(user.id, {
        $set: {
          preferred_language: preferredLanguage,
        },
      });
      lastIdentifiedLanguage.current = preferredLanguage;
    }
  }, [isLoaded, isSignedIn, user, selectedLanguageId]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogIdentity />
      <StreamVideoProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </StreamVideoProvider>
    </ClerkProvider>
  );

  return posthog ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app;
}
