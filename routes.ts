import { Router } from "@oak/oak";
import { LoginMiddleware, RPC2Middleware } from "./rpc2-login.ts";

export const router = new Router();

router.get("/", (ctx) => ctx.response.body = "tem");

router.post("/RPC2_Login", LoginMiddleware);

router.get(
    "/RPC2_Notify_Method",
    (ctx) => ctx.response.body = { "NotifyMethod": "1.0" },
);

router.post("/RPC2", RPC2Middleware);
