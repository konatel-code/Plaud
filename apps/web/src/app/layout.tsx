import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { PWA } from "@/components/PWA";

export const metadata: Metadata = {
  title: "DAKA Hlas",
  description: "AI hlasový asistent pre CK DAKA",
  manifest: "/Plaud/manifest.webmanifest",
  icons: {
    icon: "/Plaud/icon-512.png",
    apple: "/Plaud/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    title: "DAKA Hlas",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0e7490",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body>
        <PWA />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
