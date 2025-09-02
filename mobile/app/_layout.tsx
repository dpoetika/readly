import { Stack } from "expo-router";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/hooks/useTheme";
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="(tabs)"
          >
          </Stack.Screen>
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
