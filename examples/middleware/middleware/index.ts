import { ReplyNoContinue } from "hapi";
import * as Boom from "boom";

export const loggingHandler = (req: Request, reply: ReplyNoContinue) => {
  console.log(req);
  reply();
};

export const securityHandler = (req: Request, reply: ReplyNoContinue) => {
  // Return a Boom (or any Error) if you want processing to stop
  if (!req.headers["token"]) {
      return reply(Boom.unauthorized("No sessionsession id in request header"));
  }

  return reply();
};