<div id="top"></div>

## About

A Node.js application to connect to binance web socket with three different event types(`trade`, `aggTrade`, `kline_<interval>`) and measure latency time

# Getting Started

## Node

- version: `LTS`
- install packages:
  ```sh
  npm i
  ```
- environment variables: use `.env`
- start app:

  ```sh
  npm run start:dev [trade|aggTrade|kline_1m] [true]
  ```

  live subscribe trade event:

  ```sh
  npm run start:dev trade
  ```

  live subscribe and measure latency time trade event:

  ```sh
  npm run start:dev trade true
  ```
