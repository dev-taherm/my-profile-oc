import https from "https";
import http from "http";
import { URL } from "url";

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
  timeout?: number;
}

function request(
  url: string,
  options: FetchOptions
): Promise<{ status: number; ok: boolean; headers: http.IncomingHttpHeaders; body: ReadableStream<Uint8Array> }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const mod = isHttps ? https : http;

    const req = mod.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: options.method || "POST",
        headers: options.headers,
        family: 4,
        timeout: options.timeout || 30000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const stream = new ReadableStream<Uint8Array>({
            start(controller) {
              controller.enqueue(new Uint8Array(buffer));
              controller.close();
            },
          });
          resolve({
            status: res.statusCode || 0,
            ok: (res.statusCode || 0) >= 200 && (res.statusCode || 0) < 300,
            headers: res.headers,
            body: stream,
          });
        });
      }
    );

    if (options.signal) {
      options.signal.addEventListener("abort", () => req.destroy());
    }

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("ETIMEDOUT"));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function requestStream(
  url: string,
  options: FetchOptions
): Promise<{ status: number; ok: boolean; headers: http.IncomingHttpHeaders; stream: http.IncomingMessage }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === "https:";
    const mod = isHttps ? https : http;

    const req = mod.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: options.method || "POST",
        headers: options.headers,
        family: 4,
        timeout: options.timeout || 60000,
      },
      (res) => {
        resolve({
          status: res.statusCode || 0,
          ok: (res.statusCode || 0) >= 200 && (res.statusCode || 0) < 300,
          headers: res.headers,
          stream: res,
        });
      }
    );

    if (options.signal) {
      options.signal.addEventListener("abort", () => req.destroy());
    }

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("ETIMEDOUT"));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

export { request, requestStream };
