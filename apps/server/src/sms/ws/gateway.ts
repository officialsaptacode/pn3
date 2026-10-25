import { Inject } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { Server, Socket } from "socket.io";
import { SmsService } from "../sms.service";

@WebSocketGateway("ws/campaigns", { cors: { origin: "*" } })
export class SmsWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly subscribed = new Map<number, Set<Socket>>();

  constructor(@Inject() private smsService: SmsService) {
    // subscribe to job events and broadcast to relevant sockets
    this.smsService.jobEvent$
      .pipe(
        filter((e) => e.status),
        map((e) => ({ campaignId: e.campaignId, jobId: e.jobId, status: e.status })),
      )
      .subscribe(({ campaignId, status }) => {
        const sockets = this.subscribed.get(campaignId) ?? new Set();
        sockets.forEach((sock) => sock.emit("job-status", { campaignId, status }));
      });
  }

  handleConnection(client: Socket) {
    // no automatic subscription; client must emit 'subscribe' with campaignId
  }

  handleDisconnect(client: Socket) {
    // remove client from any subscriptions
    for (const [campaignId, sockets] of this.subscribed.entries()) {
      sockets.delete(client);
      if (sockets.size === 0) this.subscribed.delete(campaignId);
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
