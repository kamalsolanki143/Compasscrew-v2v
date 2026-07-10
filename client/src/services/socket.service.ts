import { getSocket } from "@/lib/socket";

export const socketService = {
  connect() {
    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  },

  disconnect() {
    const socket = getSocket();
    socket.disconnect();
  },

  joinSession(sessionId: string) {
    getSocket().emit("join-session", sessionId);
  },

  leaveSession(sessionId: string) {
    getSocket().emit("leave-session", sessionId);
  },

  onEmergencyUpdate(callback: (data: Record<string, unknown>) => void) {
    getSocket().on("emergency:update", callback);
    return () => getSocket().off("emergency:update", callback);
  },

  onHeartbeatUpdate(callback: (data: Record<string, unknown>) => void) {
    getSocket().on("heartbeat:update", callback);
    return () => getSocket().off("heartbeat:update", callback);
  },

  onLocationUpdate(callback: (data: Record<string, unknown>) => void) {
    getSocket().on("location:update", callback);
    return () => getSocket().off("location:update", callback);
  },

  offAll() {
    const socket = getSocket();
    socket.off("emergency:update");
    socket.off("heartbeat:update");
    socket.off("location:update");
  },
};
