import "dotenv/config";
import { PAIR_CURRENCIES } from "./pairs/currencies";

import Socket from "./socket";
import { EVENTS, EventTypeCLI } from "./types/events";
import { withTry } from "./utils/utils";

const latencyData: { [key: string]: Array<number> } = {};

function getData(data: Buffer) {
  const message = JSON.parse(data.toString());
  const receiveTime = Date.now();
  if (!latencyData[message.s]) {
    latencyData[message.s] = [];
  }
  latencyData[message.s].push(receiveTime - message.T);
}

function getError(err: Error) {
  console.log(err);
}

async function main(eventType: EventTypeCLI, isMeasurement: boolean) {
  // @TODO: validate event type input
  const socket = new Socket();

  const { status, err } = await withTry(socket.init, socket)();

  if (!status) {
    return err;
  }

  socket.setListener(getData);
  socket.setErrorListener(getError);

  socket.subscribe(
    eventType as EVENTS, // it can be changed to EVENTS.AGG_TRADE, EVENTS.KLINE
    PAIR_CURRENCIES.BTC_USDT,
    PAIR_CURRENCIES.ETH_USDT
  );

  socket.sendData();

  if (isMeasurement) {
    setInterval(() => {
      for (const stream of Object.keys(latencyData)) {
        if (stream === "undefined") continue;
        const streamData = latencyData[stream];
        const min = Math.min(...streamData);
        const max = Math.max(...streamData);
        const avg = streamData.reduce((a, b) => a + b, 0) / streamData.length;
        console.log(`Stream: ${stream} Min: ${min} Max: ${max} Avg: ${avg}`);
      }
    }, 60000);
  }
}

main(process.argv[2] as EventTypeCLI, process.argv[3] === "true");
