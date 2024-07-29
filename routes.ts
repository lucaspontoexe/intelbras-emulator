import { Router } from "@oak/oak";
import { LoginMiddleware } from "./rpc2-login.ts";
import { RPC2Response } from "./rpc2.d.ts";

export const router = new Router();

router.get("/", (ctx) => ctx.response.body = "tem");

router.post("/RPC2_Login", LoginMiddleware);

router.get(
    "/RPC2_Notify_Method",
    (ctx) => ctx.response.body = { "NotifyMethod": "1.0" },
);

router.post("/RPC2", (ctx) => {
    // not implemented (por enquanto)
    ctx.response.body = {result: true, params: {},} as RPC2Response<unknown>;
});
