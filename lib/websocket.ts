"use client";

export type WSMessage = Record<string, unknown>;
export type WSHandler = (data: WSMessage) => void;

export class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: WSHandler[] = [];
  private retryDelay = 1000;
  private maxDelay = 30_000;
  private shouldConnect = true;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  connect(): void {
    if (!this.shouldConnect) return;
    if (typeof window === "undefined") return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.retryDelay = 1000;
      this.startPing();
    };

    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as WSMessage;
        this.handlers.forEach((h) => h(data));
      } catch {}
    };

    this.ws.onclose = () => {
      this.stopPing();
      if (!this.shouldConnect) return;
      setTimeout(() => {
        this.retryDelay = Math.min(this.retryDelay * 2, this.maxDelay);
        this.connect();
      }, this.retryDelay);
    };

    this.ws.onerror = () => this.ws?.close();
  }

  send(data: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  on(handler: WSHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  disconnect(): void {
    this.shouldConnect = false;
    this.stopPing();
    this.ws?.close();
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => this.send({ type: "ping" }), 25_000);
  }

  private stopPing(): void {
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = null;
  }
}
