
import * as Boom from "boom";

export const loggingHandler = (req: Request) => {
  console.log(req);
  return null;
};

export const securityHandler = (req: Request) => {
  // Return a Boom (or any Error) if you want processing to stop
  if (!req.headers["token"]) {
      return Boom.unauthorized("No sessionsession id in request header");
  }
  return null;
};