import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata: Metadata = {
  title: "DAKA Hlas",
  description: "AI hlasový asistent pre CK DAKA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
