import { IncomingForm } from "formidable";
import { IncomingMessage, ServerResponse } from "node:http";

export default async function wrapper(
  im: IncomingMessage,
  sr: ServerResponse,
  fn: (options: RouteOptions) => Promise<unknown> | unknown
) {
  let data = "";

  im.on("data", (chunk) => {
    data += chunk;
  });

  im.on("end", async () => {
    if (im.headers["content-type"] === "application/json") {
      data = JSON.parse(data);
    }
    // else if (im.headers["content-type"].startsWith("multipart/form-data")) {
    //   const incomingForm = new IncomingForm();

    //   const a = await new Promise((resolve, reject) => {
    //     incomingForm.parse(im, (err, fields, files) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve({ fields, files });
    //       }
    //     });
    //   });

    //   console.log({ a });
    // }

    console.log({ type: im.headers["content-type"] });

    console.log(data);

    const response = fn({ data });

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
  });
}

export type RouteOptions = {
  data: unknown;
};
