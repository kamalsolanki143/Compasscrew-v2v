"use client";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { EmergencyProvider } from "@/context/EmergencyContext";
import { useSocket } from "@/hooks/useSocket";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

function SocketProvider({ children }: { children: ReactNode }) {
  useSocket();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EmergencyProvider>
          <SocketProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className: "dark:bg-zinc-800 dark:text-white",
                duration: 4000,
              }}
            />
          </SocketProvider>
        </EmergencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
