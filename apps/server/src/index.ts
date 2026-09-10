import { createContext } from "@my-portfolio/api/context";
import { appRouter } from "@my-portfolio/api/routers/index";
import { auth } from "@my-portfolio/auth";
import { env } from "@my-portfolio/env/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { uploadRouter } from "./routes/upload.router";

const app = express();

// 1. CORS Configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// 2. Global Body Parsers (MUST be before custom routes!)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. Better-Auth Endpoint
app.all("/api/auth{/*path}", toNodeHandler(auth));

// 4. Cloudinary File Upload Router
app.use("/api/uploads", uploadRouter);

// 5. tRPC API Endpoint
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    onError({ error, path }) {
      console.error(`Error in tRPC procedure ${path}:`, error);
    },
  }),
);

// 6. Health Check Route
app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

// 7. Server Listener
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
