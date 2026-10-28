import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { filter, map } from "rxjs";
import { Socket } from "socket.io";
import { SmsService } from "../sms.service";

@WebSocketGateway({
  namespace: "ws/campaigns",
  cors: { origin: "*" },
})
export class SmsWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly subscribed = new Map<number, Set<Socket>>();

  constructor(private smsService: SmsService) {
    this.smsService.jobEvent$
      .pipe(
        filter((e) => Boolean(e.status)),
        map((e) => ({ campaignId: e.campaignId, jobId: e.jobId, status: e.status })),
      )
      .subscribe(({ campaignId, status }) => {
        const sockets = this.subscribed.get(campaignId) ?? new Set();
        sockets.forEach((sock) => {
          sock.emit("job-status", { campaignId, status });
        });
      });
  }

  handleConnection(_client: Socket) {
    return;
  }

  handleDisconnect(client: Socket) {
    for (const [, sockets] of this.subscribed.entries()) {
      sockets.delete(client);
    }
  }

  @SubscribeMessage("subscribe")
  handleSubscribe(client: Socket, campaignId: number) {
    let sockets = this.subscribed.get(campaignId);
    if (!sockets) {
      sockets = new Set();
      this.subscribed.set(campaignId, sockets);
    }
    sockets.add(client);
  }
}
