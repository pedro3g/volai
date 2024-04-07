import { IncomingMessage, ServerResponse } from "http";

export default async function wrapper(
  im: IncomingMessage,
  sr: ServerResponse,
  fn: (options: RouteOptions) => Promise<unknown> | unknown
) {
  const body = im.read() ?? {};

  const response = fn({ body });

  if (typeof response === "string") {
    sr.writeHead(200, { "Content-Type": "text/plain" });
    sr.end(response);
  } else if (typeof response === "object") {
    sr.writeHead(200, { "Content-Type": "application/json" });
    sr.end(JSON.stringify(response));
  } else {
    sr.writeHead(500, { "Content-Type": "text/plain" });
    sr.end("Malformed response");
  }
}

export type RouteOptions = {
  body: unknown;
};
