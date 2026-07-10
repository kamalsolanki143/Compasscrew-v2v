"use client";
import { useEffect, useCallback, useRef } from "react";
import { socketService } from "@/services/socket.service";
import { useEmergency } from "@/context/EmergencyContext";

export function useSocket() {
  const { refreshSession, activeSession } = useEmergency();
  const sessionRef = useRef(activeSession?._id);

  useEffect(() => {
    sessionRef.current = activeSession?._id;
  }, [activeSession]);

  useEffect(() => {
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  useEffect(() => {
    const unsubEmergency = socketService.onEmergencyUpdate(() => {
      if (sessionRef.current) refreshSession();
    });
    const unsubHeartbeat = socketService.onHeartbeatUpdate(() => {
      if (sessionRef.current) refreshSession();
    });
    return () => {
      unsubEmergency();
      unsubHeartbeat();
    };
  }, [refreshSession]);

  useEffect(() => {
    if (activeSession?._id) {
      socketService.joinSession(activeSession._id);
      return () => {
        if (sessionRef.current) socketService.leaveSession(sessionRef.current);
      };
    }
  }, [activeSession?._id]);

  return { isConnected: true };
}
