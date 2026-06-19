import { Injectable } from "@nestjs/common";
import {
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import type { RecordingStatus } from "@daka/shared";

@Injectable()
@WebSocketGateway({ cors: true })
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  emitStatus(recordingId: string, stav: RecordingStatus) {
    this.server?.emit("recording.status", { recordingId, stav });
  }

  emitReady(recordingId: string) {
    this.server?.emit("recording.ready", { recordingId });
  }
}
