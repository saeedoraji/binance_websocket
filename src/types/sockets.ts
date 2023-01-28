export type SocketConnection = {
  status: boolean;
  err?: Error;
};

export enum SUBSCRIBE_METHOD {
  SUBSCRIBE = "SUBSCRIBE",
  UNSUBSCRIBE = "UNSUBSCRIBE",
}

export type SubscribePayload = {
  method: SUBSCRIBE_METHOD;
  id: number;
  params: Array<string>;
};
