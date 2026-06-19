import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/lib/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0e7490" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "600" },
          contentStyle: { backgroundColor: "#f8fafc" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="recordings" options={{ title: "Nahrávky" }} />
        <Stack.Screen name="record" options={{ title: "Nová nahrávka" }} />
        <Stack.Screen name="recording/[id]" options={{ title: "Detail" }} />
      </Stack>
    </AuthProvider>
  );
}
