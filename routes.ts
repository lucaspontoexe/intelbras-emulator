import { Router } from "@oak/oak";
import { CheckSession, LoginMiddleware, RPC2Middleware } from "./rpc2-login.ts";
import { RPC2Response } from "./rpc2.d.ts";

export const router = new Router();

router.get("/", (ctx) => ctx.response.body = "tem");

router.post("/RPC2_Login", LoginMiddleware);

router.get(
    "/RPC2_Notify_Method",
    (ctx) => ctx.response.body = { "NotifyMethod": "1.0" },
);

// router.use(CheckSession);

router.post("/RPC2", RPC2Middleware);
