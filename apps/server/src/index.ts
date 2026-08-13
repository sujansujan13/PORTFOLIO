import { createContext } from "@my-portfolio/api/context";
import { appRouter } from "@my-portfolio/api/routers/index";
import { auth } from "@my-portfolio/auth";
import { env } from "@my-portfolio/env/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { UPLOAD_DIR } from "./middlewares/upload.middleware";
import { uploadRouter } from "./routes/upload.router";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

//# express.static() -> Serves static files.
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/api/uploads", uploadRouter);

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
