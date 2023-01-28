import Socket from "../socket";
import { SocketConnection } from "../types/sockets";

export const withTry = (
  asyncFn: () => Promise<SocketConnection>,
  bindScope: Socket
) => {
  return async () => {
    try {
      return await asyncFn.bind(bindScope)();
    } catch (error) {
      console.log("here the errorrrrrrr", error);
      return { status: false, err: error };
    }
  };
};
