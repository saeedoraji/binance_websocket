import { WebSocket } from "ws";
import { SOCKET_ADDRESS, SOCKET_PORT } from "./const";
import { PAIR_CURRENCIES } from "./pairs/currencies";
import { EVENTS } from "./types/events";
import {
  SocketConnection,
  SubscribePayload,
  SUBSCRIBE_METHOD,
} from "./types/sockets";
class Socket {
  private socket: WebSocket;
  private subscribeMessage: SubscribePayload;

  constructor() {
    this.socket = new WebSocket(`${SOCKET_ADDRESS}:${SOCKET_PORT}/ws`);

    this.subscribeMessage = {
      method: SUBSCRIBE_METHOD.SUBSCRIBE,
      id: 1,
      params: [],
    };
  }

  init() {
    return new Promise<SocketConnection>((resolve, reject) => {
      this.socket.on("open", () => {
        console.log("connected to socket");
        resolve({ status: true });
      });

      this.setErrorListener((err) => {
        console.log(err, "the error");
        reject({ status: false, err });
      });
    });
  }

  setListener(listener: (data: Buffer) => void) {
    this.socket.on("message", listener);
  }

  setErrorListener(listener: (err: Error) => void) {
    this.socket.on("error", (err) => {
      console.log(err, "the error");
      listener(err);
    });
  }

  subscribe(eventName: EVENTS, ...pairs: Array<PAIR_CURRENCIES>) {
    this.subscribeMessage = {
      method: SUBSCRIBE_METHOD.SUBSCRIBE,
      params: pairs.map((pair) => `${pair}@${eventName}`),
      // The id used in the JSON payloads is an unsigned INT used as an identifier to uniquely identify the messages going back and forth.
      id: 109091,
    };
  }

  unsubscribe() {
    this.socket.send(
      JSON.stringify({
        ...this.subscribeMessage,
        method: SUBSCRIBE_METHOD.UNSUBSCRIBE,
      })
    );
  }

  sendData() {
    console.log(JSON.stringify(this.subscribeMessage));
    this.socket.send(JSON.stringify(this.subscribeMessage), (err) => {
      console.log(err, "data sent");
    });
  }
}

export default Socket;

// const WebSocket = require("ws");

// const ws = new WebSocket("wss://stream.binance.com:9443/ws");
// ws.on('open', () => {
//   ws.send(
//     JSON.stringify({
//       method: "SUBSCRIBE",
//       params: ["btcusdt@trade"],
//       id: 109091,
//     })
//   );
// })

// ws.on("message", function incoming(data) {
//   console.log(data.toString());
// });
