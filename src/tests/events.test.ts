import "dotenv/config";
import { expect } from "chai";
import WebSocket from "ws";

describe("Binance WebSocket API", () => {
  let ws: WebSocket;
  beforeEach(() => {
    ws = new WebSocket(
      `${process.env.SOCKET_ADDRESS}:${process.env.SOCKET_PORT}/ws`
    );
  });

  afterEach(() => {
    ws.close();
  });

  it("should subscribe to the trade event and receive data", (done) => {
    let isDoneCalled = false;
    ws.on("open", () => {
      const subscribeMessage = JSON.stringify({
        method: "SUBSCRIBE",
        params: ["btcusdt@trade"],
        id: 1,
      });
      ws.send(subscribeMessage);
    });

    ws.on("message", (data) => {
      const message = JSON.parse(data.toString());

      if (message.e) {
        expect(message).to.be.an("object");
        expect(message).to.have.property("e");
        expect(message).to.have.property("s");
        expect(message).to.have.property("p");
        expect(message).to.have.property("q");
        expect(message).to.have.property("m");
        if (!isDoneCalled) {
          done();
        }
        isDoneCalled = true;
      } else {
        expect(message).to.have.property("id");
        expect(message.id).equal(1);
      }
    });
  });
});
