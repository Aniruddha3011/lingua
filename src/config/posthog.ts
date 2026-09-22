import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

if (__DEV__ && !projectToken) {
  console.warn("PostHog is disabled because EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN is not configured.");
}

if (__DEV__ && !host) {
  console.warn("PostHog is disabled because EXPO_PUBLIC_POSTHOG_HOST is not configured.");
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
            console: [],
          },
        },
      })
    : undefined;
