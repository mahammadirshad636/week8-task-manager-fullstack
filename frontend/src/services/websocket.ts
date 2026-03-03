import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { Task } from "../types/task";

type TaskEvent = {
  type: string;
  payload: Task | number;
  timestamp: string;
};

class TaskWebSocketService {
  private client: Client | null = null;

  connect(onMessage: (event: TaskEvent) => void) {
    if (this.client?.connected) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL ?? "http://localhost:8080/ws";

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      onConnect: () => {
        this.client?.subscribe("/topic/tasks", (frame) => {
          onMessage(JSON.parse(frame.body) as TaskEvent);
        });
      }
    });

    this.client.activate();
  }

  disconnect() {
    this.client?.deactivate();
    this.client = null;
  }
}

export const taskWebSocketService = new TaskWebSocketService();
