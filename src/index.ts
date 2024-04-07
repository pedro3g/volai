import { createServer } from "node:http";
import wrapper, { RouteOptions } from "./wrapper";

type Route = Map<string, (options: RouteOptions) => Promise<unknown> | unknown>;
type Method = "GET" | "POST" | "PUT" | "DELETE";
type Routing = Map<Method, Route>;

const routingMap: Routing = new Map();

routingMap.set("GET", new Map());

const proxy = createServer((req, res) => {
  const method = req.method as Method;
  const path = req.url;

  const route = routingMap.get(method).get(path);
  if (route) {
    return wrapper(req, res, route);
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("okay");
});

export class Volai {
  public listen(port: number, callback?: () => void) {
    console.log(routingMap);
    proxy.listen(port, "127.0.0.1", callback);
  }

  public get(path: string, callback: () => void) {
    routingMap.set("GET", routingMap.get("GET").set(path, callback));
  }
}
