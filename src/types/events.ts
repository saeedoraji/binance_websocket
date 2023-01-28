export enum EVENTS {
  TRADE = "trade",
  AGGTRADE = "aggTrade",
  KLINE = "kline_1m", // TODO: set interval in different object _<interval>
}

export type EventTypeCLI = "trade" | "aggTrade" | "kline_1m";
