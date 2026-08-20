import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { auth } from "@my-portfolio/auth";

function nodeHeadersToHeaders(
  headers: CreateExpressContextOptions["req"]["headers"],
) {
  const webHeaders = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      for (const item of value) webHeaders.append(key, item);
    } else if (typeof value === "string") {
      webHeaders.set(key, value);
    }
  }
  return webHeaders;
}

export async function createContext(opts: CreateExpressContextOptions) {
  const session = await auth.api.getSession({
    headers: nodeHeadersToHeaders(opts.req.headers),
  });
  return {
    session,
    req: {
      ip:
        opts.req.headers["x-forwarded-for"]?.toString().split(",")[0] ??
        opts.req.socket.remoteAddress ??
        "",
      userAgent: opts.req.headers["user-agent"] ?? "",
    },
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
